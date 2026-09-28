import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Package, Database, Tag, FileText, LogOut, Building2 } from 'lucide-react';

const MallAdminLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Inventory', path: '/admin/inventory', icon: Database },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Building2 className="h-6 w-6 text-indigo-400" />
          <span className="ml-3 font-bold text-lg">Mall Admin</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Handle active state also matching sub-routes (like /admin/products/new)
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 hover:text-indigo-200'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white truncate max-w-[140px]">{user?.name || 'Mall Admin'}</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
            {navItems.find(item => location.pathname.startsWith(item.path) && item.path !== '/admin/dashboard')?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MallAdminLayout;
