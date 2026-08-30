import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Edit, Trash2, Search } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`/api/products?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(searchTerm);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">Barcode</th>
              <th className="p-4 font-medium">Product Name</th>
              <th className="p-4 font-medium">Brand</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-600">{product.barcode}</td>
                  <td className="p-4 font-medium text-dark">{product.productName}</td>
                  <td className="p-4 text-gray-600">{product.brand}</td>
                  <td className="p-4 font-medium text-primary">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
