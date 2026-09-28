import React, { useState } from 'react';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { Search, AlertTriangle, AlertCircle, Plus, Minus } from 'lucide-react';

const Inventory = () => {
  const { products, adjustStock } = useMallAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, Low Stock, Out of Stock

  const LOW_STOCK_THRESHOLD = 20;

  const filteredInventory = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm);
    let matchesFilter = true;
    if (filter === 'Low Stock') {
      matchesFilter = p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
    } else if (filter === 'Out of Stock') {
      matchesFilter = p.stock === 0;
    }
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
    if (stock <= LOW_STOCK_THRESHOLD) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: null };
  };

  const tabs = ['All', 'Low Stock', 'Out of Stock'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2 w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex-1 md:flex-none ${
                filter === tab 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium text-sm">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredInventory.map((product) => {
                const status = getStockStatus(product.stock);
                const StatusIcon = status.icon;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{product.barcode} • {product.brand}</div>
                    </td>
                    <td className="p-4 text-slate-600">{product.category}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-lg font-bold ${
                        product.stock === 0 ? 'text-red-600' : product.stock <= LOW_STOCK_THRESHOLD ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {product.stock}
                      </span>
                      <span className="text-xs text-slate-500 ml-1 block">{product.unit}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => adjustStock(product.id, -10)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                          title="Reduce Stock (-10)"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => adjustStock(product.id, -1)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-amber-100 hover:text-amber-600 transition-colors"
                          title="Reduce Stock (-1)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => adjustStock(product.id, 1)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                          title="Add Stock (+1)"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => adjustStock(product.id, 10)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                          title="Add Stock (+10)"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    No products found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
