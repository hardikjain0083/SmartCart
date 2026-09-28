import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useOfferStore } from '../store/offerStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { items, updateQty, removeFromCart, clearCart, getCartTotals } = useCartStore();
  const { offers } = useOfferStore();
  const navigate = useNavigate();
  const { itemCount, subtotal, totalSavings, totalGST, grandTotal } = getCartTotals(offers);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-indigo-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">Looks like you haven't scanned any items yet.</p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Start Scanning
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Shopping Cart ({itemCount})</h2>
        <button 
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const p = item.product;
            const originalPrice = p.price;
            const finalPrice = originalPrice * (1 - p.discount / 100);

            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4 relative animate-[fade-in_0.3s_ease-out]">
                <div className="w-24 h-24 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight pr-4">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{p.unit} • GST {p.gst}%</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(p.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-slate-800">₹{finalPrice.toFixed(2)}</span>
                        {p.discount > 0 && (
                          <span className="text-sm text-slate-400 line-through">₹{originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {p.discount > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Saved ₹{(originalPrice - finalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQty(p.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-800">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(p.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Running Bill Panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-slate-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Total Savings</span>
                <span className="font-medium">- ₹{totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Estimated</span>
                <span className="font-medium text-slate-800">₹{totalGST.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-slate-800">Grand Total</span>
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')} // Module 13/14 hook
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center transition-all active:scale-95 text-lg"
            >
              Proceed to Pay
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
