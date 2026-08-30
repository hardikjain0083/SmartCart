const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  barcode: { type: String, unique: true, required: true, index: true },
  productName: { type: String, required: true },
  brand: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  mrp: { type: Number },
  stock: { type: Number, default: 0 },
  aisleNumber: { type: String },
  productImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
