const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const upload = multer({ dest: 'uploads/' });

// GET /api/scan/:barcode
router.get('/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found in database", barcode });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/scan/upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const imagePath = path.join(__dirname, '..', req.file.path);
  const scriptPath = path.join(__dirname, '..', 'python_scripts', 'decode.py');

  // Try to use venv python if available, otherwise python3 (Linux/Mac) or python (Windows)
  const venvPythonPath = path.join(__dirname, '..', '..', 'venv', 'Scripts', 'python.exe');
  const defaultPython = process.platform === 'win32' ? 'python' : 'python3';
  const pythonExecutable = fs.existsSync(venvPythonPath) ? venvPythonPath : defaultPython;

  const pythonProcess = spawn(pythonExecutable, [scriptPath, imagePath]);

  let result = '';
  let errorOutput = '';

  pythonProcess.on('error', (err) => {
    console.error('Failed to start python process:', err);
    errorOutput = err.message;
  });

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    // Delete the temp image file
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting temp image:', err);
    });

    if (code !== 0) {
      console.error(`Python script error: ${errorOutput}`);
      return res.status(500).json({ message: 'Error decoding barcode image', error: errorOutput });
    }

    const decodedText = result.trim();

    if (decodedText === 'NOT_FOUND' || !decodedText) {
      return res.status(400).json({ message: "Could not decode barcode from image" });
    }

    try {
      const product = await Product.findOne({ barcode: decodedText });
      if (!product) {
         return res.status(404).json({ message: "Product not found in database", barcode: decodedText });
      }
      res.json(product);
    } catch (dbError) {
      res.status(500).json({ message: 'Database error', error: dbError.message });
    }
  });
});

module.exports = router;
