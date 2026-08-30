import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cart, updateQty, clearCart } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState(null);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-medium mb-2 text-dark">Your cart is empty</h2>
        <p className="text-gray-400">Scan some items to add them to your cart.</p>
        <a href="/" className="mt-8 bg-primary text-white px-8 py-3 rounded-xl shadow-md font-medium hover:bg-emerald-600 transition-colors">
          Start Scanning
        </a>
      </div>
    );
  }

  if (checkoutStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="text-7xl mb-6">✅</div>
        <h2 className="text-3xl font-bold mb-2 text-dark">Checkout Successful!</h2>
        <p className="text-gray-500 text-lg">Thank you for shopping with SmartCart.</p>
        <a href="/" className="mt-8 bg-primary text-white px-8 py-3 rounded-xl shadow-md font-medium hover:bg-emerald-600 transition-colors">
          Start New Session
        </a>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      await axios.post(`/api/cart/${cart._id}/checkout`);
      setCheckoutStatus('success');
      clearCart();
    } catch (err) {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-dark">Cart Summary</h2>
          <button onClick={clearCart} className="text-red-500 text-sm font-medium hover:underline">
            🗑 Empty Cart
          </button>
        </div>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark truncate">{item.productName}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{item.barcode}</p>
                <p className="text-primary font-semibold mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold transition-colors"
                    onClick={() => updateQty(item._id, item.qty - 1)}
                  >−</button>
                  <span className="w-8 h-9 flex items-center justify-center font-bold text-dark">{item.qty}</span>
                  <button
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold transition-colors"
                    onClick={() => updateQty(item._id, item.qty + 1)}
                  >+</button>
                </div>
                <div className="text-sm font-medium text-gray-500 w-16 text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Checkout */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky bottom-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 font-medium text-lg">Total Amount</span>
          <span className="text-4xl font-extrabold text-primary">${cart.totalAmount.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-lg"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;
