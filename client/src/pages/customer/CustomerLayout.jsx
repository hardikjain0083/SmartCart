import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';

const CustomerLayout = () => {
  const { getCartTotals } = useCartStore();
  const { itemCount } = getCartTotals();
  const location = useLocation();

  // Hide floating cart on checkout and receipt
  const hideCartButton = location.pathname.includes('/checkout') || location.pathname.includes('/receipt');
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'SmartCart Scanner';
    if (location.pathname === '/cart') return 'Your Cart';
    if (location.pathname === '/search') return 'Product Search';
    if (location.pathname === '/lists') return 'Shopping Lists';
    if (location.pathname === '/checkout') return 'Checkout';
    if (location.pathname.includes('/receipt')) return 'Digital Receipt';
    return 'SmartCart';
  };

  return (
    <div className="min-h-screen relative bg-slate-50">
      {/* Global Customer Header */}
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center text-sm font-medium hover:text-indigo-200 bg-indigo-700/50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-4 pb-24">
        <Outlet />
      </main>

      {/* Floating Cart Button */}
      {!hideCartButton && (
        <div className="fixed bottom-6 right-6 z-50 animate-[fade-in_0.3s_ease-out]">
          <Link 
            to="/cart" 
            className="bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all relative border border-slate-700"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center shadow-md border-2 border-slate-900">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerLayout;
