import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from './store/cartStore';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboards & Customer Pages
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import ShoppingLists from './pages/customer/ShoppingLists';
import Search from './pages/customer/Search';
import Checkout from './pages/customer/Checkout';
import Receipt from './pages/customer/Receipt';

// Super Admin Imports
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import MallsList from './pages/superadmin/MallsList';
import SmartCarts from './pages/superadmin/SmartCarts';

// Mall Admin Imports
import MallAdminLayout from './pages/malladmin/MallAdminLayout';
import MallAdminDashboard from './pages/dashboards/MallAdminDashboard'; // Using the one we built in Dashboards earlier
import ProductsList from './pages/malladmin/ProductsList';
import AddProduct from './pages/malladmin/AddProduct';
import BulkUpload from './pages/malladmin/BulkUpload';
import Inventory from './pages/malladmin/Inventory';
import Offers from './pages/malladmin/Offers';

// Store
import { useAuthStore } from './store/authStore';
import { useOfferStore } from './store/offerStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isGuest } = useAuthStore();
  
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { getCartTotals } = useCartStore();
  const { offers } = useOfferStore();
  const { itemCount } = getCartTotals(offers);

  return (
    <div className="min-h-screen relative bg-slate-50">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Customer Routes with Layout */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lists" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ShoppingLists />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Search />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/receipt/:orderId" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Receipt />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Super Admin Routes */}
        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="malls" element={<MallsList />} />
          <Route path="carts" element={<SmartCarts />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Mall Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['malladmin']}>
            <MallAdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<MallAdminDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/bulk" element={<BulkUpload />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="offers" element={<Offers />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch old admin login route and redirect */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
