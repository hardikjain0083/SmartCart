import React from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Download, Home, QrCode } from 'lucide-react';

const Receipt = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const state = location.state;

  if (!state) {
    // If someone tries to navigate to receipt directly without state
    return <Navigate to="/" replace />;
  }

  const { amount, items, date } = state;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 pt-8">
      
      {/* Success Animation & Header */}
      <div className="text-center animate-[fade-in_0.5s_ease-out]">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
          <CheckCircle className="w-10 h-10 text-emerald-600 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
        <p className="text-slate-500 mt-1">Thank you for shopping with SmartCart.</p>
      </div>

      {/* Digital Receipt Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Receipt Header */}
        <div className="bg-slate-800 text-white p-6 text-center rounded-b-[2rem] shadow-inner relative z-10">
          <h3 className="font-bold text-xl tracking-wider mb-1">MALL CENTRAL</h3>
          <p className="text-sm opacity-80 font-mono">{orderId}</p>
          <p className="text-xs opacity-60 mt-1">{new Date(date).toLocaleString()}</p>
        </div>

        {/* Paper texture / items area */}
        <div className="p-6 bg-[#fcfcfc] relative z-0">
          <div className="absolute top-0 left-0 right-0 h-4 -mt-2 flex space-x-2 px-2 overflow-hidden z-20">
             {/* zig-zag top edge illusion */}
          </div>
          
          <div className="space-y-4 mb-6">
            <h4 className="font-bold text-slate-800 border-b border-dashed border-slate-300 pb-2">Itemized Bill</h4>
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-slate-600 flex-1 pr-4">{item.qty}x {item.product.name}</span>
                <span className="font-mono text-slate-800 font-medium">₹{(item.product.price * (1 - item.product.discount/100) * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t-2 border-slate-800 border-dashed pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-sm">Total Paid</span>
              <span className="text-2xl font-black text-slate-800 font-mono">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
            <p className="text-sm font-bold text-indigo-800 mb-4">Scan to Exit</p>
            <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center shadow-sm">
              {/* Mock QR Code for Exit Gate */}
              <QrCode className="w-24 h-24 text-slate-800" />
            </div>
            <p className="text-xs text-indigo-600 mt-4">Show this QR code at the automated exit gate.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Download className="w-5 h-5 mr-2 text-slate-500" />
          Save PDF
        </button>
        <Link to="/" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <Home className="w-5 h-5 mr-2" />
          Home
        </Link>
      </div>

    </div>
  );
};

export default Receipt;
