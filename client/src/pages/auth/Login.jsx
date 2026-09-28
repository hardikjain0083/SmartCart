import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShoppingCart, User, Shield, Building, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('customer'); // 'customer', 'malladmin', 'superadmin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, continueAsGuest } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const actualRole = await login(email, password);
      if (actualRole !== role) {
         // Optionally warn them, but for mock purposes just redirect
      }
      
      if (actualRole === 'superadmin') navigate('/superadmin/dashboard');
      else if (actualRole === 'malladmin') navigate('/admin/dashboard');
      else navigate('/dashboard'); // customer dashboard
      
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
            <ShoppingCart className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          SmartCart
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* Role Selector Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
                role === 'customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Customer
            </button>
            <button
              onClick={() => setRole('malladmin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
                role === 'malladmin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building className="w-4 h-4 mr-2" />
              Mall Admin
            </button>
            <button
              onClick={() => setRole('superadmin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${
                role === 'superadmin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Super Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder={`Enter your ${role} email`}
                />
              </div>
              {role === 'customer' && <p className="text-xs text-slate-400 mt-2">Try: customer@smartcart.com</p>}
              {role === 'malladmin' && <p className="text-xs text-slate-400 mt-2">Try: malladmin@smartcart.com</p>}
              {role === 'superadmin' && <p className="text-xs text-slate-400 mt-2">Try: superadmin@smartcart.com</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {role === 'customer' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={handleGuestLogin}
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Continue as Guest
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {role === 'customer' && (
             <p className="mt-8 text-center text-sm text-slate-600">
               Don't have an account?{' '}
               <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                 Register here
               </Link>
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
