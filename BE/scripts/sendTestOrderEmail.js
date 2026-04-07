require('dotenv').config();
const { sendOrderNotification } = require('../services/emailService');

const testOrder = {
  _id: { toString: () => '661111111111111111ab2026' },
  items: [
    { name: 'Ấm Áp (Cozy)', qty: 2, price: 320000 },
    { name: 'Oải Hương (Lavender Dream)', qty: 1, price: 290000 }
  ],
  shippingAddress: {
    fullName: 'Khách test An Hy',
    phone: '0946081027',
    email: 'khach-test@example.com',
    address: 'Phường Vĩnh Quang',
    district: 'Rạch Giá',
    city: 'Kiên Giang'
  },
  paymentMethod: 'qr',
  subtotal: 930000,
  shippingFee: 0,
  totalPrice: 930000
};

sendOrderNotification(testOrder)
  .then(() => {
    console.log('Sent mobile-friendly UTF-8 test order email.');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
