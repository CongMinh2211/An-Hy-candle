const User = require('../models/User');

const ensureDefaultAdmin = async () => {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin';
    const aliasEmail = process.env.DEFAULT_ADMIN_ALIAS_EMAIL || 'admin@gmail.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
      }
      return;
    }

    await User.create({
      name: 'Admin',
      email,
      password,
      isAdmin: true
    });
    console.log(`Default admin created: ${email}`);

    if (aliasEmail && aliasEmail !== email && !(await User.findOne({ email: aliasEmail }))) {
      await User.create({
        name: 'Admin',
        email: aliasEmail,
        password,
        isAdmin: true
      });
      console.log(`Default admin alias created: ${aliasEmail}`);
    }
  } catch (error) {
    console.error(`Default admin setup skipped: ${error.message}`);
  }
};

module.exports = ensureDefaultAdmin;
