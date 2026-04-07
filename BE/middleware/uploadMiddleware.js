const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeName = path
      .basename(file.originalname || 'anhy-candle', extension)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');
    callback(null, `${Date.now()}-${safeName || 'product'}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const isAllowedMime = allowedMimeTypes.includes(file.mimetype);
    const isAllowedExtension = allowedExtensions.includes(extension);

    if (isAllowedMime || isAllowedExtension) {
      callback(null, true);
      return;
    }

    callback(new Error('Chỉ hỗ trợ ảnh JPG, PNG, WebP, HEIC hoặc HEIF.'));
  }
});

module.exports = upload;
