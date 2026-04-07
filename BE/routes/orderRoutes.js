const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderNotification } = require('../services/emailService');
const { protect, admin } = require('../middleware/authMiddleware');

const getOptionalUser = async (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : '';
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'anhy_secret_key');
    return await User.findById(decoded.id).select('-password');
  } catch {
    return null;
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged-in customer orders
// @route   GET /api/orders/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, totalPrice } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const user = await getOptionalUser(req);
    const order = new Order({
      user: user?._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      totalPrice
    });

    const createdOrder = await order.save();
    let emailNotification = 'sent';

    try {
      const emailResult = await sendOrderNotification(createdOrder);
      emailNotification = emailResult?.skipped ? 'skipped' : 'sent';
    } catch (emailError) {
      emailNotification = 'failed';
      console.error(`Order email notification failed: ${emailError.message}`);
    }

    res.status(201).json({ order: createdOrder, emailNotification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public/Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, isPaid: req.body.isPaid },
      { new: true, runValidators: true }
    );

    order ? res.json(order) : res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
