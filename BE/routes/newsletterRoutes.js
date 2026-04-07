const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { email, source: source || 'website' },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find({}).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
