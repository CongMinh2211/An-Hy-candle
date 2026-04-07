export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URLS = {
  products: `${API_BASE_URL}/api/products`,
  orders: `${API_BASE_URL}/api/orders`,
  users: `${API_BASE_URL}/api/users`,
  reviews: `${API_BASE_URL}/api/reviews`,
  contact: `${API_BASE_URL}/api/contact`,
  blogs: `${API_BASE_URL}/api/blogs`,
  newsletter: `${API_BASE_URL}/api/newsletter`,
};
