import React, { useState } from 'react';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, AlertCircle } from 'lucide-react';

const AddProduct = () => {
  const { addProduct, isValidEAN13 } = useMallAdminStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    brand: '',
    category: '',
    price: '',
    mrp: '',
    gst: '5',
    stock: '',
    unit: '',
    aisle: '',
    expiryDate: '',
    discount: '0',
  });
  
  const [barcodeError, setBarcodeError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'barcode') {
      if (value.length > 0 && !isValidEAN13(value)) {
        setBarcodeError('Invalid EAN-13 Barcode. Must be 13 digits with correct check digit.');
      } else {
        setBarcodeError('');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a mock preview url
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcodeError) return;

    // Convert strings to numbers where necessary
    const product = {
      ...formData,
      price: parseFloat(formData.price),
      mrp: parseFloat(formData.mrp),
      gst: parseFloat(formData.gst),
      stock: parseInt(formData.stock),
      discount: parseFloat(formData.discount),
      image: imagePreview || 'https://via.placeholder.com/150'
    };

    addProduct(product);
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/products" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Add New Product</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Area */}
            <div className="col-span-1 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50 relative group">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-full object-contain rounded-lg" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  )}
                  <div className="flex text-sm text-slate-600 justify-center mt-4">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Barcode (EAN-13)</label>
                <input 
                  type="text" name="barcode" required value={formData.barcode} onChange={handleInputChange} maxLength="13"
                  className={`w-full px-4 py-2 border ${barcodeError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg outline-none transition-all`}
                  placeholder="e.g. 8901030940141"
                />
                {barcodeError && <p className="mt-1 text-xs text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {barcodeError}</p>}
              </div>

              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Tomato Ketchup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <input 
                  type="text" name="brand" required value={formData.brand} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Kissan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  name="category" required value={formData.category} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select category...</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                <input 
                  type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                <input 
                  type="number" name="mrp" required min="0" step="0.01" value={formData.mrp} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GST %</label>
                <select 
                  name="gst" required value={formData.gst} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input 
                  type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit (e.g. 500g, 1L)</label>
                <input 
                  type="text" name="unit" required value={formData.unit} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Aisle Number</label>
                <input 
                  type="text" name="aisle" required value={formData.aisle} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. A4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input 
                  type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount % (Optional)</label>
                <input 
                  type="number" name="discount" min="0" max="100" value={formData.discount} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end space-x-4">
            <Link 
              to="/admin/products"
              className="px-6 py-2.5 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={!!barcodeError}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
