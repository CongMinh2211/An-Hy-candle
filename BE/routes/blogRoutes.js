const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect, admin } = require('../middleware/authMiddleware');

const fallbackPosts = [
  {
    _id: 'guide-burn-candle',
    title: 'Cách đốt nến thơm lần đầu để mặt sáp tan đều',
    slug: 'cach-dot-nen-thom-lan-dau',
    excerpt: 'Một vài thao tác nhỏ giúp nến thơm bền mùi, cháy đẹp và ít bị lõm tim.',
    content: 'Lần đốt đầu tiên nên kéo dài 2-3 giờ để toàn bộ bề mặt sáp tan đều. Luôn cắt bấc còn khoảng 5mm trước mỗi lần đốt và không đặt nến ở nơi có gió mạnh.',
    category: 'Hướng dẫn',
    coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1470&auto=format&fit=crop',
    author: 'An Hy Candle'
  },
  {
    _id: 'scent-room-guide',
    title: 'Chọn mùi hương theo từng không gian sống',
    slug: 'chon-mui-huong-theo-khong-gian',
    excerpt: 'Gợi ý mùi floral, woody, citrus cho phòng ngủ, phòng khách và góc làm việc.',
    content: 'Phòng ngủ hợp lavender và eucalyptus, phòng khách hợp woody/amber, góc làm việc hợp citrus hoặc green tea để tạo cảm giác tỉnh táo.',
    category: 'Cảm hứng',
    coverImage: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?q=80&w=1470&auto=format&fit=crop',
    author: 'An Hy Candle'
  }
];

router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(posts.length ? posts : fallbackPosts);
  } catch (error) {
    res.json(fallbackPosts);
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    post ? res.json(post) : res.status(404).json({ message: 'Blog post not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    post ? res.json({ message: 'Blog post deleted' }) : res.status(404).json({ message: 'Blog post not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
