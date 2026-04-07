const express = require('express');
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const User = require('../models/User');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const optionalUser = async (req) => {
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

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', (req, res) => {
  upload.single('image')(req, res, async (error) => {
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    try {
      const user = await optionalUser(req);
      const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}` : '';
      const review = await Review.create({
        productId: req.body.productId,
        user: user?._id,
        userName: user?.name || req.body.userName || 'Khách hàng An Hy',
        rating: Number(req.body.rating),
        comment: req.body.comment,
        image
      });
      res.status(201).json(review);
    } catch (saveError) {
      res.status(400).json({ message: saveError.message });
    }
  });
});

module.exports = router;
