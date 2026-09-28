import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Shield, Database } from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-indigo-900 shadow-sm border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">SmartCart - Super Admin</span>
            </div>
            <div className="flex items-center">
              <span className="text-indigo-100 mr-4 font-medium">{user?.name || 'Super Admin'}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-slate-300 rounded-lg h-96 flex flex-col items-center justify-center p-6 text-center">
             <Database className="h-16 w-16 text-indigo-300 mb-4" />
             <h2 className="text-2xl font-semibold text-slate-800">Welcome to Super Admin Dashboard</h2>
             <p className="mt-2 text-slate-500">
               Here you will manage all malls, system analytics, and smart carts.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
