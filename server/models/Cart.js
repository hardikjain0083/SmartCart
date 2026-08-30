const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  barcode: String,
  productName: String,
  price: Number,
  qty: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'checked_out'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
