const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: '../.env' }); // Assuming .env is in backend root

const products = [
  {
    name: 'Ấm Áp (Cozy)',
    description: 'Mang lại cảm giác ấm cúng cho căn phòng của bạn với hương gỗ đàn hương và hổ phách.',
    price: 320000,
    scent: 'Woody',
    notes: 'Sandalwood, Amber, Vanilla',
    materials: '100% Soy Wax, Cotton Wick',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d5dfd0?q=80&w=1472&auto=format&fit=crop',
    inventory: 50,
    category: 'Signature'
  },
  {
    name: 'Sớm Mai (Daylight)',
    description: 'Đánh thức giác quan với hương cam chanh tươi mát và trà xanh thanh khiết.',
    price: 350000,
    scent: 'Fresh',
    notes: 'Bergamot, Green Tea, Jasmine',
    materials: '100% Soy Wax, Cotton Wick',
    image: 'https://images.unsplash.com/photo-1596433809252-260c2745dfdd?q=80&w=1471&auto=format&fit=crop',
    inventory: 40,
    category: 'Signature'
  },
  {
    name: 'Rừng Khuya (Night Scent)',
    description: 'Hương thơm đầy bí ẩn từ nhựa thông và gỗ tuyết tùng trầm lắng.',
    price: 380000,
    scent: 'Woody',
    notes: 'Pine, Cedarwood, Musk',
    materials: '100% Soy Wax, Cotton Wick',
    image: 'https://images.unsplash.com/photo-1620023617300-610b2eeed598?q=80&w=1472&auto=format&fit=crop',
    inventory: 30,
    category: 'Signature'
  },
  {
    name: 'Oải Hương (Lavender Dream)',
    description: 'Giúp bạn thư giãn tuyệt đối với hương oải hương tự nhiên dịu nhẹ.',
    price: 290000,
    scent: 'Floral',
    notes: 'Lavender, Eucalyptus',
    materials: '100% Soy Wax, Cotton Wick',
    image: 'https://images.unsplash.com/photo-1602873145311-bf43f628299a?q=80&w=1470&auto=format&fit=crop',
    inventory: 60,
    category: 'Relax'
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anhy_candle';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for seeding');

    await Product.deleteMany({});
    console.log('🗑️ Old products deleted');

    await Product.insertMany(products);
    console.log('✨ Products seeded successfully');

    process.exit();
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
