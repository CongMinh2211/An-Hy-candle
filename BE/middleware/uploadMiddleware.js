const path = require('path');
const multer = require('multer');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giảm xuống 5MB để tránh timeout ném lỗi "Load failed" trên Render Nginx
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
