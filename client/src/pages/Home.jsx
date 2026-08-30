import React, { useState } from 'react';
import Scanner from '../components/Scanner';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CheckCircle } from 'lucide-react';

const Home = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const { addToCart } = useCart();

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleScanSuccess = async (barcode) => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const res = await axios.get(`/api/scan/${barcode}`);
      setProduct(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`Product not found in database (Barcode: ${barcode})`);
      } else {
        setError('Error connecting to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setProduct(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/scan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProduct(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error decoding image.');
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.barcode);
      showToast();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {/* Toast Notification */}
      <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <CheckCircle size={18} />
        <span className="font-medium">Added to cart!</span>
      </div>

      {/* Scanner */}
      <div className="w-full mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">📷 Live Camera Scanner</h2>
        <Scanner onScanSuccess={handleScanSuccess} />
      </div>

      {/* Upload Section */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-700 mb-3 text-center">Or upload a barcode image</h3>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-green-50 transition-colors">
          <span className="text-gray-500 text-sm">Click to browse or drag & drop</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG accepted</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Status */}
      {loading && (
        <div className="mt-6 flex items-center gap-3 text-secondary font-medium animate-pulse">
          <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 w-full text-center font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Product Card */}
      {product && (
        <div className="mt-8 w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in">
          {product.productImage && (
            <img
              src={`/uploads/${product.productImage}`}
              alt={product.productName}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div>
              <h2 className="text-2xl font-bold text-dark leading-tight">{product.productName}</h2>
              <p className="text-gray-500 text-sm mt-1">{product.brand}{product.category ? ` · ${product.category}` : ''}</p>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
              {product.mrp > product.price && (
                <span className="text-gray-400 line-through text-lg">${product.mrp.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
              <span className={`px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
              </span>
              {product.aisleNumber && (
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Aisle: {product.aisleNumber}</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-6 w-full bg-primary hover:bg-emerald-600 disabled:bg-gray-300 text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-95 shadow-md text-lg flex justify-center items-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
