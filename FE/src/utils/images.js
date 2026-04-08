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
