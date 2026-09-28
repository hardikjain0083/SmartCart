import React, { useState } from 'react';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Download, Upload } from 'lucide-react';

const ProductsList = () => {
  const { products, deleteProduct } = useMallAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm);
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID,Barcode,Name,Brand,Category,Price,MRP,GST,Stock,Unit,Aisle,Discount'];
    const rows = filteredProducts.map(p => 
      `${p.id},${p.barcode},"${p.name}","${p.brand}","${p.category}",${p.price},${p.mrp},${p.gst},${p.stock},"${p.unit}","${p.aisle}",${p.discount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Database</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <Link 
            to="/admin/products/bulk"
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import
          </Link>
          <Link 
            to="/admin/products/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by product name or barcode..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium text-sm">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Aisle</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                         {/* Optional Image rendering */}
                         <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-400 font-bold text-xs">
                           IMG
                         </div>
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand} • {product.unit}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{product.barcode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">₹{product.price}</p>
                    <p className="text-xs text-slate-500 line-through">₹{product.mrp}</p>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${product.stock > 20 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {product.aisle}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Product">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => confirmDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Product?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
