const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

dotenv.config();

const demoProducts = [
  { barcode: '8901234567890', productName: 'Organic Apple Juice', brand: 'NatureFresh', category: 'Beverages', price: 4.99, mrp: 5.99, stock: 50, aisleNumber: '1A' },
  { barcode: '8901234567891', productName: 'Whole Wheat Bread', brand: 'DailyBake', category: 'Bakery', price: 2.49, mrp: 2.99, stock: 30, aisleNumber: '2B' },
  { barcode: '8901234567892', productName: 'Almond Milk (1L)', brand: 'Nutty', category: 'Dairy', price: 3.99, mrp: 4.50, stock: 40, aisleNumber: '3C' },
  { barcode: '8901234567893', productName: 'Dark Chocolate Bar', brand: 'ChocoDelight', category: 'Snacks', price: 1.99, mrp: 2.50, stock: 100, aisleNumber: '4D' },
  { barcode: '8901234567894', productName: 'Arabica Coffee Beans', brand: 'MorningBrew', category: 'Beverages', price: 8.99, mrp: 10.00, stock: 20, aisleNumber: '1B' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcart');
    console.log('MongoDB connected...');

    // Clear existing data
    await Product.deleteMany({});
    await Admin.deleteMany({});

    // Seed products
    await Product.insertMany(demoProducts);
    console.log('Demo products inserted.');

    // Seed admin
    const admin = new Admin({ email: 'admin@smartcart.com', password: 'password123' });
    await admin.save();
    console.log('Demo admin inserted (admin@smartcart.com / password123).');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
