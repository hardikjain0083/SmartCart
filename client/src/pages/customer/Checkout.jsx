import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useOfferStore } from '../../store/offerStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, ArrowLeft, Loader2, ShieldCheck, Scale, AlertTriangle, Award } from 'lucide-react';

const Checkout = () => {
  const { getCartTotals, clearCart, items } = useCartStore();
  const { offers } = useOfferStore();
  const { user, updateLoyaltyPoints } = useAuthStore();
  const navigate = useNavigate();
  
  const { itemCount, subtotal, totalSavings, totalGST, grandTotal } = getCartTotals(offers);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, wallet
  const [isProcessing, setIsProcessing] = useState(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Anti-Theft Weight Verification
  const [weightStatus, setWeightStatus] = useState('pending'); // pending, verifying, ok, mismatch
  const [expectedWeight, setExpectedWeight] = useState(0);

  useEffect(() => {
    // Calculate expected weight
    const weight = items.reduce((sum, item) => sum + ((item.product.weight || 0) * item.qty), 0);
    setExpectedWeight(weight);
  }, [items]);

  // Points calculation
  const maxPointsToUse = Math.min(user?.loyaltyPoints || 0, Math.floor(grandTotal)); // 1 point = 1 rupee
  const finalAmount = useLoyaltyPoints ? grandTotal - maxPointsToUse : grandTotal;

  const startWeightVerification = () => {
    setWeightStatus('verifying');
    // Simulate smart cart sensor reading
    setTimeout(() => {
      // Mock: 90% chance it's fine, 10% chance mismatch (for demo purposes)
      const isMismatch = Math.random() > 0.9;
      if (isMismatch) {
        setWeightStatus('mismatch');
      } else {
        setWeightStatus('ok');
      }
    }, 2000);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      // Typically we'd generate an order ID and save to backend here
      const orderId = `ORD${Date.now()}`;
      
      // Points logic:
      if (useLoyaltyPoints) {
        updateLoyaltyPoints(-maxPointsToUse);
      }
      // Earn points (1 point per ₹100 spent)
      const earnedPoints = Math.floor(finalAmount / 100);
      if (earnedPoints > 0) {
        updateLoyaltyPoints(earnedPoints);
      }
      
      // Clear cart
      clearCart();
      
      // Navigate to receipt
      navigate(`/receipt/${orderId}`, { state: { 
        amount: finalAmount, 
        items: items,
        date: new Date().toISOString()
      }});
    }, 2500);
  };

  if (itemCount === 0 && !isProcessing) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-medium">Return to Scanner</button>
      </div>
    );
  }

  // Weight Verification Interstitial
  if (weightStatus === 'pending' || weightStatus === 'verifying' || weightStatus === 'mismatch') {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
        {weightStatus === 'pending' && (
          <>
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Weight Verification</h2>
            <p className="text-slate-500 mb-8">Please place all scanned items in the cart basket to verify weight before payment.</p>
            <p className="text-sm font-mono bg-slate-50 p-2 rounded mb-6">Expected: {expectedWeight}g</p>
            <button 
              onClick={startWeightVerification}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-colors"
            >
              Verify Cart Weight
            </button>
            <button onClick={() => navigate('/cart')} className="w-full mt-4 py-4 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
          </>
        )}
        
        {weightStatus === 'verifying' && (
          <div className="py-8">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
               <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-ping opacity-20"></div>
               <Scale className="w-10 h-10 text-indigo-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Reading Sensors...</h2>
            <p className="text-slate-500">Checking physical weight matches scanned items.</p>
          </div>
        )}

        {weightStatus === 'mismatch' && (
          <div className="py-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Weight Mismatch!</h2>
            <p className="text-slate-700 mb-6">The items in your cart do not match the scanned items. Mall staff has been notified.</p>
            <div className="space-y-3">
              <button 
                onClick={() => setWeightStatus('pending')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Re-weigh Items
              </button>
              {/* Bypass for demo purposes */}
              <button 
                onClick={() => setWeightStatus('ok')}
                className="w-full py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm"
              >
                (Demo) Bypass Security
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        {!isProcessing && (
          <button onClick={() => setWeightStatus('pending')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-slate-800">Checkout</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="space-y-6 relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="font-bold text-lg text-slate-800">Processing Payment...</p>
              <p className="text-sm text-slate-500 mt-1">Please don't close this window.</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Select Payment Method</h3>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                <Smartphone className={`w-6 h-6 mr-4 ${paymentMethod === 'upi' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <p className="font-bold text-slate-800">UPI / QR Code</p>
                  <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
                {paymentMethod === 'upi' && <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-indigo-200"></div>}
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                <CreditCard className={`w-6 h-6 mr-4 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Credit / Debit Card</p>
                  <p className="text-xs text-slate-500">Visa, MasterCard, RuPay</p>
                </div>
                {paymentMethod === 'card' && <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-indigo-200"></div>}
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
                <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="hidden" />
                <Wallet className={`w-6 h-6 mr-4 ${paymentMethod === 'wallet' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">Store Wallet</p>
                    <p className="text-xs text-slate-500">Available Balance: ₹1,250.00</p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-indigo-200"></div>}
              </label>
            </div>
          </div>

          {/* Contextual UI for payment method */}
          {paymentMethod === 'upi' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <p className="text-sm text-slate-500 mb-4">Scan QR with any UPI app</p>
              <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <span className="text-slate-400 font-mono text-sm">QR_CODE_MOCK</span>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
               <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                 <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-xs font-medium text-slate-500 mb-1">Expiry (MM/YY)</label>
                   <input type="text" placeholder="12/25" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <div className="flex-1">
                   <label className="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                   <input type="password" placeholder="***" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Order Summary Summary & Loyalty */}
        <div className="space-y-6">
          {user && user.loyaltyPoints > 0 && maxPointsToUse > 0 && (
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-2xl shadow-sm border border-amber-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-amber-900 flex items-center mb-1">
                    <Award className="w-5 h-5 mr-2 text-amber-600" />
                    Loyalty Rewards
                  </h3>
                  <p className="text-sm text-amber-800">You have {user.loyaltyPoints} points available.</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={useLoyaltyPoints} onChange={() => setUseLoyaltyPoints(!useLoyaltyPoints)} />
                    <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
              {useLoyaltyPoints && (
                <p className="text-sm font-medium text-amber-700 mt-3 pt-3 border-t border-amber-200/50">
                  Using {maxPointsToUse} points to save ₹{maxPointsToUse}.
                </p>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-slate-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Total Savings</span>
                <span className="font-medium">- ₹{totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Estimated</span>
                <span className="font-medium text-slate-800">₹{totalGST.toFixed(2)}</span>
              </div>
              {useLoyaltyPoints && (
                <div className="flex justify-between text-amber-600 font-medium pt-2">
                  <span>Loyalty Discount</span>
                  <span>- ₹{maxPointsToUse.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-slate-800">Amount to Pay</span>
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-600">₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center transition-all"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${finalAmount.toFixed(2)}`}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
              Secure 256-bit encrypted checkout
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
