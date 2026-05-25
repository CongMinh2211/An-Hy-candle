const fallbackApiUrl = import.meta.env.PROD
  ? 'https://an-hy-candle.onrender.com'
  : 'http://localhost:5000';
const configuredApiUrl = import.meta.env.VITE_API_URL;
const isVercelFrontendUrl = configuredApiUrl?.includes('an-hy-candle.vercel.app');

export const API_BASE_URL = configuredApiUrl && !isVercelFrontendUrl
  ? configuredApiUrl
  : fallbackApiUrl;

const catalogHiddenUrl = import.meta.env.PROD
  ? '/api/products/catalog-hidden'
  : `${API_BASE_URL}/api/products/catalog-hidden`;

export const API_URLS = {
  products: `${API_BASE_URL}/api/products`,
  catalogHidden: catalogHiddenUrl,
  orders: `${API_BASE_URL}/api/orders`,
  users: `${API_BASE_URL}/api/users`,
  reviews: `${API_BASE_URL}/api/reviews`,
  contact: `${API_BASE_URL}/api/contact`,
  blogs: `${API_BASE_URL}/api/blogs`,
  newsletter: `${API_BASE_URL}/api/newsletter`,
};
