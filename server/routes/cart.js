const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate total
const recalculateTotal = (cart) => {
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.qty), 0);
};

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/cart/:cartId
router.get('/:cartId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/cart/:cartId/add
router.post('/:cartId/add', async (req, res) => {
  try {
    const { barcode, productId } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    if (cart.status !== 'active') return res.status(400).json({ message: 'Cart is no longer active' });

    let product;
    if (barcode) {
      product = await Product.findOne({ barcode });
    } else if (productId) {
      product = await Product.findById(productId);
    }

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingItemIndex = cart.items.findIndex(item => item.barcode === product.barcode);
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].qty += 1;
    } else {
      cart.items.push({
        productId: product._id,
        barcode: product.barcode,
        productName: product.productName,
        price: product.price,
        qty: 1
      });
    }

    recalculateTotal(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/cart/:cartId/item/:itemId
router.put('/:cartId/item/:itemId', async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (qty <= 0) {
      cart.items.pull({ _id: req.params.itemId });
    } else {
      item.qty = qty;
    }

    recalculateTotal(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/cart/:cartId/item/:itemId
router.delete('/:cartId/item/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items.pull({ _id: req.params.itemId });
    recalculateTotal(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/cart/:cartId/checkout
router.post('/:cartId/checkout', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.status = 'checked_out';
    await cart.save();
    res.json({ message: 'Checkout successful', total: cart.totalAmount, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
