const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true }, // e.g., 'qr', 'cod'
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 5 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Processing' }, // e.g., Processing, Shipped, Delivered, Cancelled
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
