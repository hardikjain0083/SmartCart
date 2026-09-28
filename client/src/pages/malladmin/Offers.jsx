import React, { useState } from 'react';
import { useOfferStore } from '../../store/offerStore';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { Tag, Plus, Trash2, Power, PowerOff, Percent, Gift, PackagePlus } from 'lucide-react';

const Offers = () => {
  const { offers, addOffer, deleteOffer, toggleOfferStatus } = useOfferStore();
  const { products } = useMallAdminStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'festival',
    discountPercentage: '',
    applicableTo: [],
    productBarcode: '',
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleCategoryToggle = (cat) => {
    setFormData(prev => ({
      ...prev,
      applicableTo: prev.applicableTo.includes(cat) 
        ? prev.applicableTo.filter(c => c !== cat) 
        : [...prev.applicableTo, cat]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOffer = { ...formData };
    if (formData.type === 'festival' || formData.type === 'percentage') {
      newOffer.discountPercentage = parseFloat(formData.discountPercentage);
    }
    addOffer(newOffer);
    setIsAddModalOpen(false);
    setFormData({ title: '', type: 'festival', discountPercentage: '', applicableTo: [], productBarcode: '' });
  };

  const getOfferIcon = (type) => {
    switch(type) {
      case 'festival': return <Gift className="w-5 h-5 text-fuchsia-500" />;
      case 'bogo': return <PackagePlus className="w-5 h-5 text-emerald-500" />;
      case 'percentage': return <Percent className="w-5 h-5 text-blue-500" />;
      default: return <Tag className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Offers & Discounts</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
            <div className={`absolute top-0 left-0 w-1 h-full ${offer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mr-3 border border-slate-100">
                  {getOfferIcon(offer.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{offer.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{offer.type}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4 flex-1 border border-slate-100">
              {(offer.type === 'festival' || offer.type === 'percentage') && (
                <>
                  <p className="text-sm text-slate-600 mb-2">Discount: <strong className="text-slate-800">{offer.discountPercentage}% OFF</strong></p>
                  <p className="text-xs text-slate-500">Categories: {offer.applicableTo?.join(', ') || 'All'}</p>
                </>
              )}
              {offer.type === 'bogo' && (
                <>
                  <p className="text-sm text-emerald-600 font-bold mb-2">Buy 1 Get 1 Free</p>
                  <p className="text-xs text-slate-500 truncate">Product Barcode: {offer.productBarcode}</p>
                </>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                offer.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {offer.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => toggleOfferStatus(offer.id)}
                  className={`p-1.5 rounded-lg transition-colors ${offer.status === 'active' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                  title={offer.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {offer.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => deleteOffer(offer.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <Tag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No offers created yet.</p>
          </div>
        )}
      </div>

      {/* Add Offer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Create New Offer</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Offer Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Diwali Mega Sale"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Offer Type</label>
                <select 
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="festival">Festival Discount</option>
                  <option value="percentage">Percentage Discount</option>
                  <option value="bogo">Buy 1 Get 1 (BOGO)</option>
                </select>
              </div>

              {(formData.type === 'festival' || formData.type === 'percentage') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label>
                    <input 
                      type="number" required min="1" max="100"
                      value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Applicable Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            formData.applicableTo.includes(cat) 
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                              : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'bogo' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Barcode for BOGO</label>
                  <input 
                    type="text" required
                    value={formData.productBarcode} onChange={(e) => setFormData({...formData, productBarcode: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Enter 13-digit EAN"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 mt-6">
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
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
