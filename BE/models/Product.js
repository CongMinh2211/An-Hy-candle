const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  scent: { type: String, required: true }, // e.g., Woody, Floral
  notes: { type: String }, // e.g., Sandalwood, Amber
  materials: { type: String, default: '100% Soy Wax' },
  image: { type: String, required: true },
  size: { type: String, default: 'Standard' },
  inventory: { type: Number, default: 100 },
  category: { type: String, default: 'Candle' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
