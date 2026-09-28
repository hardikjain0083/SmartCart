import React, { useState, useRef } from 'react';
import { useMallAdminStore } from '../../store/mallAdminStore';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';

const BulkUpload = () => {
  const { products, importBulkProducts, isValidEAN13 } = useMallAdminStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Mock parsing CSV/Excel for preview
  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);
    
    // Simulate parsing the file
    // In a real app, use PapaParse or xlsx library
    setTimeout(() => {
      const mockData = [
        { barcode: '8901030940141', name: 'Duplicate Product (Maggi)', category: 'Groceries', price: 15, stock: 100 }, // Duplicate
        { barcode: '1234567890123', name: 'Invalid Barcode Item', category: 'Snacks', price: 20, stock: 50 }, // Invalid EAN13
        { barcode: '8901234567895', name: 'Valid New Product', category: 'Beverages', price: 40, stock: 200 } // Valid
      ];
      validateData(mockData);
    }, 500);
  };

  const validateData = (data) => {
    const existingBarcodes = new Set(products.map(p => p.barcode));
    const newErrors = [];
    const validatedData = data.map((row, index) => {
      let rowErrors = [];
      let isDuplicate = false;
      let isInvalidBarcode = false;

      if (existingBarcodes.has(row.barcode)) {
        isDuplicate = true;
        rowErrors.push('Duplicate barcode exists in database.');
      }
      
      // We won't strictly enforce EAN-13 in this mock if we just want to show errors, but let's do it
      if (!isValidEAN13(row.barcode)) {
        isInvalidBarcode = true;
        rowErrors.push('Invalid EAN-13 barcode format.');
      }

      if (rowErrors.length > 0) {
        newErrors.push({ row: index + 1, reasons: rowErrors });
      }

      return {
        ...row,
        _isDuplicate: isDuplicate,
        _isInvalid: isInvalidBarcode
      };
    });

    setPreviewData(validatedData);
    setErrors(newErrors);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => setIsDragOver(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    const validProducts = previewData
      .filter(p => !p._isDuplicate && !p._isInvalid)
      .map(({ _isDuplicate, _isInvalid, ...rest }) => ({
        ...rest,
        id: `p${Date.now()}_${Math.random()}`,
        mrp: rest.price * 1.2, // mock data
        gst: 5,
        brand: 'Generic',
        unit: '1 pc',
        aisle: 'A1',
        discount: 0,
        image: 'https://via.placeholder.com/150'
      }));

    importBulkProducts(validProducts);
    navigate('/admin/products');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/products" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Bulk Import Products</h2>
      </div>

      {!file ? (
        <div 
          className={`bg-white rounded-xl shadow-sm border-2 border-dashed ${isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'} p-12 text-center transition-all`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <FileSpreadsheet className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & Drop your Excel/CSV file here</h3>
          <p className="text-slate-500 mb-6">or click to browse your files. Maximum file size 10MB.</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center mx-auto"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            Browse Files
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e.target.files[0])} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          />
          
          <div className="mt-8 pt-8 border-t border-slate-100">
             <p className="text-sm font-medium text-slate-700 mb-2">Required Columns:</p>
             <p className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block">
               Barcode, Product Name, Brand, Category, Price, MRP, GST, Stock, Unit, Aisle Number
             </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="font-bold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setPreviewData([]); setErrors([]); }}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>

          {errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <h4 className="flex items-center font-bold text-amber-800 mb-2">
                <AlertTriangle className="w-5 h-5 mr-2" /> 
                Validation Errors Found ({errors.length})
              </h4>
              <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                {errors.map((err, idx) => (
                  <li key={idx}>Row {err.row}: {err.reasons.join(' | ')}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Data Preview</h3>
              <span className="text-sm font-medium text-slate-600">
                {previewData.filter(p => !p._isDuplicate && !p._isInvalid).length} valid rows
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-600 font-medium">
                    <th className="p-3">Status</th>
                    <th className="p-3">Barcode</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={`${row._isDuplicate || row._isInvalid ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                      <td className="p-3">
                        {row._isDuplicate || row._isInvalid ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" title="Error in row" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </td>
                      <td className={`p-3 font-mono ${row._isDuplicate ? 'text-red-600 font-bold' : ''}`}>
                        {row.barcode}
                      </td>
                      <td className="p-3">{row.name}</td>
                      <td className="p-3">{row.category}</td>
                      <td className="p-3">₹{row.price}</td>
                      <td className="p-3">{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
             <Link 
               to="/admin/products"
               className="px-6 py-2.5 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
             >
               Cancel
             </Link>
             <button 
               onClick={handleImport}
               disabled={previewData.filter(p => !p._isDuplicate && !p._isInvalid).length === 0}
               className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
             >
               <UploadCloud className="w-5 h-5 mr-2" />
               Import Valid Rows
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
