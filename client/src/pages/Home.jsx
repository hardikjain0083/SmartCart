import React, { useState, useEffect, useRef } from 'react';
import { useMallAdminStore } from '../store/mallAdminStore';
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import { Camera, Search, Check, ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

const Home = () => {
  const { products } = useMallAdminStore();
  const { addToCart, items } = useCartStore();
  
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanError, setScanError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce for scanning
  const lastScanTime = useRef(0);

  useEffect(() => {
    let scanner = null;
    if (isScanning && !scannedProduct) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, // Increase frame rate slightly
          qrbox: { width: 300, height: 150 }, // Rectangular box is much better for 1D barcodes
          rememberLastUsedCamera: true,
          aspectRatio: 1.777778, // 16:9 aspect ratio for HD feed
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true // Uses hardware acceleration if available in browser
          }
        },
        false
      );
      
      scanner.render(
        (decodedText) => {
          // Success callback
          scanner.clear();
          handleScan(decodedText);
        },
        (error) => {
          // Failure callback - constantly fires, so we ignore it
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [isScanning, scannedProduct]);

  const handleScan = (barcode) => {
    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScanTime.current < 2000) {
      return;
    }
    
    setIsProcessing(true);
    setScanError('');
    setScannedProduct(null);
    setIsScanning(false); // Turn off camera UI
    
    // Simulate slight API delay for UX
    setTimeout(() => {
      lastScanTime.current = Date.now();
      const product = products.find(p => p.barcode === barcode);
      
      if (product) {
        // Check if already in cart
        const inCart = items.find(i => i.product.id === product.id);
        if (inCart) {
          toast('Product already in cart. Quantity will be updated.', { icon: '🛒' });
        }
        setScannedProduct(product);
      } else {
        setScanError(`Product with barcode ${barcode} not found. Please try again or check the database.`);
      }
      setIsProcessing(false);
    }, 800);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleScan(manualBarcode.trim());
    }
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart(scannedProduct);
      toast.success(`${scannedProduct.name} added to cart!`);
      setScannedProduct(null);
      setManualBarcode('');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">
      <Toaster position="top-center" />
      
      {/* Welcome / Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Scan & Go</h2>
        <p className="text-slate-500">Scan barcodes to add items to your cart instantly.</p>
      </div>

      {/* Main Scanner Area */}
      {!scannedProduct && (
        <div className="space-y-6">
          {/* Camera Viewfinder */}
          <div className="relative w-full min-h-[300px] bg-slate-900 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 flex flex-col items-center justify-center">
            {isScanning ? (
              <div className="w-full h-full bg-white relative">
                 <div id="reader" className="w-full h-full border-none"></div>
                 <button 
                    onClick={() => setIsScanning(false)}
                    className="absolute top-4 right-4 z-50 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold shadow-lg transition-colors"
                  >
                    Close
                  </button>
              </div>
            ) : (
              <div 
                className="text-slate-400 flex flex-col items-center p-6 text-center transition-transform hover:scale-105 cursor-pointer w-full h-full justify-center"
                onClick={() => setIsScanning(true)}
              >
                <Camera className="w-16 h-16 mb-4 text-slate-500" />
                <p className="font-medium text-slate-300 text-lg mb-1">Tap to open Camera</p>
                <p className="text-sm text-slate-500">Point at the barcode to scan</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/80 z-40 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-indigo-400" />
                <p className="font-medium animate-pulse">Processing Barcode...</p>
              </div>
            )}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Image File Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <label className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
              <Camera className="w-8 h-8 text-indigo-500 mb-2" />
              <span className="font-medium text-indigo-600">Take Photo / Upload Image</span>
              <span className="text-xs text-slate-500 mt-1">Upload a clear picture of the barcode</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={async (e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setIsProcessing(true);
                    setScanError('');
                    const file = e.target.files[0];
                    try {
                      const scanner = new Html5Qrcode("reader");
                      const text = await scanner.scanFile(file, true);
                      scanner.clear();
                      handleScan(text);
                    } catch (err) {
                      setScanError("No barcode found in this image. Make sure it is clear and well-lit.");
                      setIsProcessing(false);
                    }
                  }
                }} 
              />
            </label>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleManualSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter barcode manually..." 
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              disabled={isProcessing || isScanning}
              className="w-full pl-12 pr-24 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
            />
            <button 
              type="submit"
              disabled={!manualBarcode.trim() || isProcessing || isScanning}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium disabled:bg-indigo-300 transition-colors"
            >
              Enter
            </button>
          </form>

          {/* Error State */}
          {scanError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start animate-[fade-in_0.3s_ease-out]">
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Invalid Barcode</p>
                <p className="text-sm opacity-90">{scanError}</p>
                <button 
                  onClick={() => setScanError('')}
                  className="mt-3 text-sm font-semibold bg-white px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success State / Product Card */}
      {scannedProduct && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-[slide-up_0.4s_ease-out]">
          <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center justify-center text-emerald-700">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-bold">Product Found!</span>
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={scannedProduct.image} alt={scannedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-600 mb-1">{scannedProduct.brand}</p>
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2">{scannedProduct.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{scannedProduct.unit} • Aisle {scannedProduct.aisle}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-500 font-medium">Price</span>
                <div className="text-right">
                  {scannedProduct.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through mr-2">₹{scannedProduct.mrp}</span>
                  )}
                  <span className="text-2xl font-bold text-slate-800">
                    ₹{(scannedProduct.price * (1 - scannedProduct.discount/100)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {scannedProduct.discount > 0 && (
                <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">
                  {scannedProduct.discount}% OFF
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setScannedProduct(null)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddToCart}
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center transition-all active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adding a global style for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* Make html5-qrcode UI look slightly better */
        #reader { border-radius: 12px; overflow: hidden; background: white; }
        #reader button { background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; margin-top: 10px; }
        #reader select { padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; margin-bottom: 10px; width: 80%; }
        #reader__dashboard_section_csr span { color: #475569; font-size: 14px; }
      `}} />
    </div>
  );
};

export default Home;
