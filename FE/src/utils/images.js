import productFallbackImage from '../assets/hero-banner.png';
import { API_BASE_URL } from '../config/api';

export const fallbackProductImage = productFallbackImage;

export const resolveProductImageUrl = (image) => {
  if (!image || typeof image !== 'string') {
    return fallbackProductImage;
  }

  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return fallbackProductImage;
  }

  if (trimmedImage.startsWith('http://localhost:5000')) {
    return trimmedImage.replace('http://localhost:5000', API_BASE_URL);
  }

  if (trimmedImage.startsWith('https://localhost:5000')) {
    return trimmedImage.replace('https://localhost:5000', API_BASE_URL);
  }

  if (trimmedImage.startsWith('/uploads/')) {
    return `${API_BASE_URL}${trimmedImage}`;
  }

  return trimmedImage;
};

export const handleProductImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackProductImage;
};

export const compressImage = (file, maxWidth = 1000, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
