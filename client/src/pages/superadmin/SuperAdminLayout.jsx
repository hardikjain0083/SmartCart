import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, LayoutDashboard, Building2, ShoppingCart, BarChart3, LogOut } from 'lucide-react';

const SuperAdminLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'Malls', path: '/superadmin/malls', icon: Building2 },
    { name: 'Smart Carts', path: '/superadmin/carts', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-950 text-indigo-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-indigo-900/50">
          <Shield className="h-6 w-6 text-indigo-400" />
          <span className="ml-3 font-bold text-lg text-white">Super Admin</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-200' : 'text-indigo-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-indigo-900/50">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || 'Super Admin'}</p>
              <p className="text-xs text-indigo-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-900/50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 shadow-sm border-b border-slate-200 flex items-center px-8 z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
