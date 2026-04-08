const express = require('express');
const path = require('path');
const { Readable } = require('stream');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const CLOUDINARY_HOST = 'res.cloudinary.com';

const slugifyForCloudinary = (value) => {
  return String(value || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const shouldImportRemoteImage = (image) => {
  if (!image || typeof image !== 'string') return false;
  const trimmedImage = image.trim();

  if (!/^https?:\/\//i.test(trimmedImage)) return false;
  if (trimmedImage.includes(CLOUDINARY_HOST)) return false;

  return true;
};

const importRemoteImageToCloudinary = async (image, name) => {
  if (!shouldImportRemoteImage(image) || !isCloudinaryConfigured) {
    return image;
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: 'an-hy-candle/products',
    public_id: `${Date.now()}-${slugifyForCloudinary(name)}`,
    resource_type: 'image'
  });

  return result.secure_url;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, admin, (req, res) => {
  upload.single('image')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Chưa chọn ảnh sản phẩm.' });
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        message: 'Cloudinary chưa được cấu hình. Hãy thêm CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET.'
      });
    }

    try {
      const extension = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
      const safeName = path
        .basename(req.file.originalname || 'anhy-candle', extension)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'an-hy-candle/products',
            public_id: `${Date.now()}-${safeName || 'product'}`,
            resource_type: 'image'
          },
          (streamError, uploadResult) => {
            if (streamError) {
              reject(streamError);
              return;
            }

            resolve(uploadResult);
          }
        );

        uploadStream.on('error', (err) => {
          reject(err);
        });

        Readable.from(req.file.buffer).pipe(uploadStream);
      });

      return res.status(201).json({
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
    } catch (uploadError) {
      return res.status(500).json({ message: `Upload Cloudinary thất bại: ${uploadError.message}` });
    }
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      image: await importRemoteImageToCloudinary(req.body.image, req.body.name)
    };
    const product = new Product(payload);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      image: await importRemoteImageToCloudinary(req.body.image, req.body.name)
    };

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    product ? res.json({ message: 'Product deleted' }) : res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
