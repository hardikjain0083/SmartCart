import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    barcode: '',
    productName: '',
    brand: '',
    category: '',
    price: '',
    mrp: '',
    stock: '',
    aisleNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setFormData({
        barcode: '', productName: '', brand: '', category: '', price: '', mrp: '', stock: '', aisleNumber: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-dark mb-6">Add New Product</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4">Product added successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode *</label>
            <input 
              type="text" name="barcode" required 
              className="w-full px-4 py-2 rounded-lg border border-primary ring-2 ring-primary/20 outline-none"
              value={formData.barcode} onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Enter the exact barcode number printed on the product packaging.</p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input 
              type="text" name="productName" required 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.productName} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input 
              type="text" name="brand" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.brand} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              type="text" name="category" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.category} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
            <input 
              type="number" step="0.01" name="price" required 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.price} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
            <input 
              type="number" step="0.01" name="mrp" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.mrp} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input 
              type="number" name="stock" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.stock} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aisle Number</label>
            <input 
              type="text" name="aisleNumber" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
              value={formData.aisleNumber} onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-4 border-t mt-6 flex justify-end">
          <button type="submit" className="bg-primary hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium shadow">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
