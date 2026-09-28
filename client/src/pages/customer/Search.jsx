import React, { useState } from 'react';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { useOfferStore } from '../../store/offerStore';
import { Search as SearchIcon, Filter, MapPin, Tag } from 'lucide-react';

const Search = () => {
  const { products } = useMallAdminStore();
  const { offers } = useOfferStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const activeOffers = offers.filter(o => o.status === 'active');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.barcode.includes(searchTerm) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' ? true : p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getActiveOfferForProduct = (p) => {
    const bogo = activeOffers.find(o => o.type === 'bogo' && o.productBarcode === p.barcode);
    if (bogo) return bogo;
    const catOffer = activeOffers.find(o => (o.type === 'festival' || o.type === 'percentage') && o.applicableTo?.includes(p.category));
    if (catOffer) return catOffer;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Find Products</h2>
        <p className="text-slate-500 text-sm">Search by name, brand, or barcode</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-4 sticky top-16 z-20">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 shadow-inner rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
          />
        </div>
        
        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                categoryFilter === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {filteredProducts.map((p) => {
          const offer = getActiveOfferForProduct(p);
          let finalPrice = p.price * (1 - p.discount / 100);
          if (offer && offer.type === 'percentage') {
            finalPrice -= finalPrice * (offer.discountPercentage / 100);
          } else if (offer && offer.type === 'festival') {
            finalPrice -= finalPrice * (offer.discountPercentage / 100);
          }

          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4 animate-[fade-in_0.3s_ease-out]">
              <div className="w-24 h-24 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-indigo-600 mb-0.5">{p.brand}</p>
                    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3 mr-1" /> Aisle {p.aisle}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-tight">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.unit}</p>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-slate-800">₹{finalPrice.toFixed(2)}</span>
                      {(p.discount > 0 || (offer && offer.type !== 'bogo')) && (
                        <span className="text-sm text-slate-400 line-through">₹{p.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {p.stock > 20 ? (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">In Stock</span>
                    ) : p.stock > 0 ? (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Low Stock</span>
                    ) : (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">Out of Stock</span>
                    )}
                  </div>
                </div>

                {offer && (
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center text-[10px] font-bold text-fuchsia-700 bg-fuchsia-100 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3 mr-1" />
                      {offer.type === 'bogo' ? 'Buy 1 Get 1 Free' : `${offer.discountPercentage}% Extra Off`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>No products found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
