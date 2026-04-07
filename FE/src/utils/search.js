export const normalizeSearchText = (value = '') => (
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
);

export const buildProductSearchText = (product = {}) => (
  [
    product.name,
    product.scent,
    product.notes,
    product.category,
    product.size,
    product.description
  ]
    .filter(Boolean)
    .join(' ')
);
