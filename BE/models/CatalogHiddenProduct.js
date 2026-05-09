const mongoose = require('mongoose');

const catalogHiddenProductSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CatalogHiddenProduct', catalogHiddenProductSchema);
