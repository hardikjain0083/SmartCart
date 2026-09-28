import React, { useState } from 'react';
import { useSuperAdminStore } from '../../store/superAdminStore';
import { ShoppingCart, Plus, Trash2, BatteryCharging, AlertCircle, RefreshCw } from 'lucide-react';

const SmartCarts = () => {
  const { carts, malls, addCart, deleteCart, updateCartStatus } = useSuperAdminStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ serialNumber: '', mallId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.serialNumber && formData.mallId) {
      addCart(formData);
      setIsAddModalOpen(false);
      setFormData({ serialNumber: '', mallId: '' });
    }
  };

  const getMallName = (mallId) => {
    return malls.find(m => m.id === mallId)?.name || 'Unknown Mall';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Smart Carts Management</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Register New Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {carts.map(cart => (
          <div key={cart.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              cart.status === 'active' ? 'bg-emerald-500' : 
              cart.status === 'maintenance' ? 'bg-amber-500' : 'bg-slate-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-slate-800">{cart.serialNumber}</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[120px]">{getMallName(cart.mallId)}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteCart(cart.id)}
                className="text-slate-400 hover:text-red-600 transition-colors"
                title="Deregister Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 text-xs mb-1">
                  <BatteryCharging className="w-3 h-3 mr-1" /> Battery
                </div>
                <div className="font-semibold text-slate-800 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${cart.battery > 20 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  {cart.battery}%
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center text-slate-500 text-xs mb-1">
                  <AlertCircle className="w-3 h-3 mr-1" /> Status
                </div>
                <div className="font-semibold text-slate-800 capitalize">
                  {cart.status}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs text-slate-500">ID: {cart.id}</span>
               <button 
                 onClick={() => updateCartStatus(cart.id, cart.status === 'active' ? 'maintenance' : 'active')}
                 className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
               >
                 <RefreshCw className="w-3 h-3 mr-1" />
                 {cart.status === 'active' ? 'Set Maintenance' : 'Set Active'}
               </button>
            </div>
          </div>
        ))}

        {carts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No smart carts registered yet.</p>
          </div>
        )}
      </div>

      {/* Add Cart Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Register Smart Cart</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                <input 
                  type="text" required
                  value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. SC-1045"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Mall</label>
                <select 
                  required
                  value={formData.mallId} 
                  onChange={(e) => setFormData({...formData, mallId: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a mall...</option>
                  {malls.map(mall => (
                    <option key={mall.id} value={mall.id}>{mall.name} ({mall.location})</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCarts;
