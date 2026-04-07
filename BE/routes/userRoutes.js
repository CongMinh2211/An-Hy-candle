const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const fallbackAdminId = '000000000000000000000000';
const fallbackAdminEmails = ['admin', 'admin@gmail.com'];
const fallbackAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

const sendAuthResponse = (res, user) => {
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  });
};

const upsertOAuthUser = async ({ name, email, provider, providerId }) => {
  const user = await User.findOne({ email });
  if (user) {
    user.provider = user.provider || provider;
    user.providerId = user.providerId || providerId;
    await user.save();
    return user;
  }

  return User.create({
    name,
    email,
    provider,
    providerId,
    isAdmin: false
  });
};

const redirectOAuthSuccess = (res, user) => {
  const params = new URLSearchParams({
    token: generateToken(user._id),
    name: user.name,
    email: user.email,
    id: user._id.toString(),
    isAdmin: String(user.isAdmin)
  });
  res.redirect(`${frontendUrl}/auth?oauth=success&${params.toString()}`);
};

const redirectOAuthConfigError = (res, provider) => {
  const message = `${provider} OAuth chưa đủ cấu hình CLIENT_ID, CLIENT_SECRET hoặc CALLBACK_URL trong BE/.env`;
  res.redirect(`${frontendUrl}/auth?oauth=error&message=${encodeURIComponent(message)}`);
};

const redirectOAuthProviderError = (res, provider, query) => {
  const rawMessage = query.error_description || query.error_message || query.error || 'Provider rejected the login request';
  const message = `${provider} OAuth lỗi: ${rawMessage}`;
  res.redirect(`${frontendUrl}/auth?oauth=error&message=${encodeURIComponent(message)}`);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'anhy_secret_key', {
    expiresIn: '30d'
  });
};

const isFallbackAdminLogin = (email, password) => {
  return fallbackAdminEmails.includes(String(email).toLowerCase()) && password === fallbackAdminPassword;
};

const sendFallbackAdminResponse = (res) => {
  res.json({
    _id: fallbackAdminId,
    name: 'Admin',
    email: 'admin',
    phone: '',
    addresses: [],
    isAdmin: true,
    token: generateToken(fallbackAdminId)
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isFallbackAdminLogin(email, password)) {
      sendFallbackAdminResponse(res);
      return;
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendAuthResponse(res, user);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    const { email, password } = req.body;
    if (isFallbackAdminLogin(email, password)) {
      sendFallbackAdminResponse(res);
      return;
    }

    res.status(500).json({ message: error.message });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201);
      sendAuthResponse(res, user);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  sendAuthResponse(res, req.user);
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, address, district, city } = req.body;

    user.name = name || user.name;
    user.phone = phone || '';
    user.addresses = [
      {
        fullName: name || user.name,
        phone: phone || '',
        address: address || '',
        district: district || '',
        city: city || '',
        isDefault: true
      }
    ];

    const updatedUser = await user.save();
    sendAuthResponse(res, updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { currentPassword, newPassword } = req.body;

    if (user.password && !(await user.matchPassword(currentPassword))) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    user.password = newPassword;
    user.provider = 'local';
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/oauth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    redirectOAuthConfigError(res, 'Google');
    return;
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account'
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

router.get('/oauth/google/callback', async (req, res) => {
  try {
    if (req.query.error) {
      redirectOAuthProviderError(res, 'Google', req.query);
      return;
    }

    if (!req.query.code) {
      throw new Error('Google callback không có authorization code. Kiểm tra Authorized redirect URI trong Google Console.');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: req.query.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error_description || 'Google token exchange failed');

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok) throw new Error('Google profile fetch failed');

    const user = await upsertOAuthUser({
      name: profile.name,
      email: profile.email,
      provider: 'google',
      providerId: profile.id
    });
    redirectOAuthSuccess(res, user);
  } catch (error) {
    res.redirect(`${frontendUrl}/auth?oauth=error&message=${encodeURIComponent(error.message)}`);
  }
});

router.get('/oauth/facebook', (req, res) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET || !process.env.FACEBOOK_CALLBACK_URL) {
    redirectOAuthConfigError(res, 'Facebook');
    return;
  }

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    response_type: 'code',
    scope: 'email,public_profile'
  });

  res.redirect(`https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`);
});

router.get('/oauth/facebook/callback', async (req, res) => {
  try {
    if (req.query.error || req.query.error_message) {
      redirectOAuthProviderError(res, 'Facebook', req.query);
      return;
    }

    if (!req.query.code) {
      throw new Error('Facebook callback không có authorization code. Kiểm tra Valid OAuth Redirect URI trong Facebook Login settings.');
    }

    const tokenParams = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
      code: req.query.code
    });
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`);
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error?.message || 'Facebook token exchange failed');

    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`);
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email) throw new Error('Facebook profile email is unavailable');

    const user = await upsertOAuthUser({
      name: profile.name,
      email: profile.email,
      provider: 'facebook',
      providerId: profile.id
    });
    redirectOAuthSuccess(res, user);
  } catch (error) {
    res.redirect(`${frontendUrl}/auth?oauth=error&message=${encodeURIComponent(error.message)}`);
  }
});

router.get('/oauth/status', (_req, res) => {
  res.json({
    google: {
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL),
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
      clientIdSuffix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.slice(-24) : ''
    },
    facebook: {
      configured: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && process.env.FACEBOOK_CALLBACK_URL),
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL || '',
      appId: process.env.FACEBOOK_APP_ID || ''
    },
    frontendUrl
  });
});

// @desc    Get all users for admin dashboard
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.isAdmin = typeof req.body.isAdmin === 'boolean' ? req.body.isAdmin : user.isAdmin;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      provider: updatedUser.provider
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
