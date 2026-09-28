import React, { useState } from 'react';
import { useSuperAdminStore } from '../../store/superAdminStore';
import { Plus, Edit2, Trash2, Power, PowerOff, X } from 'lucide-react';

const MallsList = () => {
  const { malls, addMall, updateMall, deleteMall, toggleMallStatus } = useSuperAdminStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mallToDelete, setMallToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    adminEmail: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMall(formData);
    setIsAddModalOpen(false);
    setFormData({ name: '', location: '', adminEmail: '' });
  };

  const confirmDelete = (id) => {
    setMallToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (mallToDelete) {
      deleteMall(mallToDelete);
    }
    setIsDeleteModalOpen(false);
    setMallToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mall Management</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Mall
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium text-sm">
                <th className="p-4">Mall Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Admin Email</th>
                <th className="p-4">Smart Carts</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {malls.map((mall) => (
                <tr key={mall.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{mall.name}</td>
                  <td className="p-4 text-slate-600">{mall.location}</td>
                  <td className="p-4 text-slate-600">{mall.adminEmail}</td>
                  <td className="p-4 text-slate-600 font-medium">{mall.carts} Carts</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mall.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {mall.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => toggleMallStatus(mall.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        mall.status === 'active' 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={mall.status === 'active' ? "Suspend Mall" : "Activate Mall"}
                    >
                      {mall.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Mall">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => confirmDelete(mall.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete Mall"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {malls.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No malls found. Add your first mall to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Mall Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Register New Mall</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mall Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Phoenix Mall"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location / City</label>
                <input 
                  type="text" required
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Mall Admin (Email)</label>
                <input 
                  type="email" required
                  value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="admin@mall.com"
                />
                <p className="text-xs text-slate-500 mt-1">An invitation will be sent to this email to create a Mall Admin password.</p>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Register Mall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Mall?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Are you sure you want to delete this mall? This action cannot be undone and will delete all associated smart carts and data.
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

export default MallsList;
