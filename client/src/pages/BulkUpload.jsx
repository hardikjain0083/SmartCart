import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Download } from 'lucide-react';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return setError('Please select a file first.');
    
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/products/bulk', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,barcode,productName,brand,category,price,mrp,stock,aisleNumber\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-dark">Bulk Product Upload</h2>
          <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-secondary hover:underline">
            <Download size={16} /> Download CSV Template
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
          <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse.</p>
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => setFile(e.target.files[0])}
            className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-primary hover:file:bg-gray-200 cursor-pointer"
          />
        </div>

        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-primary hover:bg-emerald-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium shadow flex items-center gap-2"
          >
            {loading ? 'Processing...' : 'Import Products'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-dark mb-4">Upload Results</h3>
          <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 mb-6">
            <p className="font-medium">{result.successCount} products imported successfully.</p>
          </div>
          
          {result.failedRows && result.failedRows.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Failed Imports ({result.failedRows.length})</h4>
              <div className="bg-red-50 rounded border border-red-200 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-red-200 bg-red-100 text-red-800">
                    <tr>
                      <th className="p-2">Barcode</th>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.failedRows.map((fail, i) => (
                      <tr key={i} className="border-b border-red-100">
                        <td className="p-2">{fail.row.barcode || '-'}</td>
                        <td className="p-2">{fail.row.productName || '-'}</td>
                        <td className="p-2 text-red-600">{fail.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
