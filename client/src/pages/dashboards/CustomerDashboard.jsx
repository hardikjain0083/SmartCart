import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, ShoppingBag, Award, ListTodo, Search, ArrowRight } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">SmartCart</span>
            </div>
            <div className="flex items-center">
              <span className="text-slate-600 mr-4 font-medium">{user?.name || 'Customer'}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none shadow-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile & Loyalty Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl shadow-lg p-8 text-white flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-6 border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!</h2>
              <p className="text-indigo-200 mt-1">{user?.email || 'Start shopping to earn rewards.'}</p>
            </div>
          </div>
          
          {user && !user.isGuest && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center min-w-[200px]">
              <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                <Award className="w-6 h-6 text-amber-900" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium mb-0.5">Loyalty Balance</p>
                <p className="text-3xl font-black">{user.loyaltyPoints || 0} <span className="text-sm font-medium">pts</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-start transition-all hover:shadow-md hover:border-indigo-200 group">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Scan & Shop</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Open the scanner to start adding items to your smart cart.</p>
            <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto">
              Start Shopping <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link to="/lists" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-start transition-all hover:shadow-md hover:indigo-200 group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ListTodo className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Shopping Lists</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Create and manage your shopping lists before visiting the mall.</p>
            <div className="flex items-center text-emerald-600 font-medium text-sm mt-auto">
              View Lists <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link to="/search" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-start transition-all hover:shadow-md hover:indigo-200 group">
            <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-fuchsia-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Browse Products</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">Search for products, check stock, and see active offers.</p>
            <div className="flex items-center text-fuchsia-600 font-medium text-sm mt-auto">
              Browse Now <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default CustomerDashboard;
