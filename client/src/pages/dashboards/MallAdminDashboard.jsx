import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Building2, LayoutDashboard } from 'lucide-react';

const MallAdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar placeholder */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
         <div className="h-16 flex items-center px-6 border-b border-slate-800">
           <Building2 className="h-6 w-6 text-indigo-400" />
           <span className="ml-3 font-bold text-lg">Mall Admin</span>
         </div>
         <div className="flex-1 py-6 px-4 space-y-2">
           <div className="bg-indigo-600 text-white rounded-lg px-4 py-3 flex items-center shadow-md">
             <LayoutDashboard className="h-5 w-5 mr-3" />
             <span className="font-medium">Dashboard</span>
           </div>
           {/* Other links would go here */}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 shadow-sm border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard Overview</h1>
          <div className="flex items-center">
            <span className="text-slate-600 mr-4 font-medium">{user?.name || 'Mall Admin'}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="border-4 border-dashed border-slate-200 rounded-lg h-96 flex flex-col items-center justify-center p-6 text-center">
             <Building2 className="h-16 w-16 text-slate-300 mb-4" />
             <h2 className="text-2xl font-semibold text-slate-800">Welcome to Mall Admin Dashboard</h2>
             <p className="mt-2 text-slate-500">
               Here you will manage products, inventory, offers, and view mall reports.
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MallAdminDashboard;
