const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const Product = require('../models/Product');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const upload = multer({ dest: 'uploads/' });

// Middleware to protect admin routes
const protectAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    if (req.admin.role !== 'admin') {
       return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { barcode: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products (Protected)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { barcode, productName, brand, category, price, mrp, stock, aisleNumber, productImage } = req.body;
    const existing = await Product.findOne({ barcode });
    if (existing) return res.status(409).json({ message: 'Product with this barcode already exists' });
    
    const newProduct = new Product({ barcode, productName, brand, category, price, mrp, stock, aisleNumber, productImage });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/products/:id (Protected)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/products/:id (Protected)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products/bulk (Protected)
router.post('/bulk', protectAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const results = [];
  const failedRows = [];
  let successCount = 0;

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      fs.unlinkSync(req.file.path); // remove temp file

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        if (!row.barcode || !row.productName || !row.price) {
          failedRows.push({ row, reason: 'Missing required fields (barcode, productName, price)' });
          continue;
        }

        try {
          const existing = await Product.findOne({ barcode: row.barcode });
          if (existing) {
            failedRows.push({ row, reason: 'Duplicate barcode' });
          } else {
            const newProduct = new Product({
              barcode: row.barcode,
              productName: row.productName,
              brand: row.brand,
              category: row.category,
              price: Number(row.price),
              mrp: row.mrp ? Number(row.mrp) : undefined,
              stock: row.stock ? Number(row.stock) : 0,
              aisleNumber: row.aisleNumber
            });
            await newProduct.save();
            successCount++;
          }
        } catch (err) {
          failedRows.push({ row, reason: err.message });
        }
      }
      res.json({ successCount, failedRows });
    });
});

module.exports = router;
