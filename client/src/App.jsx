import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import BulkUpload from './pages/BulkUpload';
import AdminLayout from './components/AdminLayout';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './context/CartContext';

function App() {
  const { cart } = useCart();
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.qty, 0) || 0;

  return (
    <div className="min-h-screen relative bg-light">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
              <h1 className="text-xl font-bold">SmartCart Scanner</h1>
            </header>
            <main className="container mx-auto p-4 pb-20">
              <Home />
            </main>
            <div className="fixed bottom-6 right-6">
              <a href="/cart" className="bg-secondary text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors relative z-50">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </a>
            </div>
          </>
        } />
        <Route path="/cart" element={
          <>
            <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
              <h1 className="text-xl font-bold">Your Cart</h1>
              <a href="/" className="text-sm underline">Back to Scanner</a>
            </header>
            <main className="container mx-auto p-4 pb-20">
              <Cart />
            </main>
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/bulk" element={<BulkUpload />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
