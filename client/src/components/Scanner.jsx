import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

const Scanner = ({ onScanSuccess }) => {
  const [scannerActive, setScannerActive] = useState(true);
  const scannerRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const lastScannedBarcodeRef = useRef(null);

  useEffect(() => {
    if (!scannerActive) return;

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    scannerRef.current.render(
      (decodedText, decodedResult) => {
        const now = Date.now();
        // Prevent duplicate scans within 3 seconds
        if (decodedText !== lastScannedBarcodeRef.current || (now - lastScanTimeRef.current > 3000)) {
          lastScannedBarcodeRef.current = decodedText;
          lastScanTimeRef.current = now;
          onScanSuccess(decodedText);
        }
      },
      (error) => {
        // Handle scan failure silently, it happens constantly when no barcode is in view
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [scannerActive, onScanSuccess]);

  return (
    <div className="w-full">
      <div id="reader" className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 bg-black"></div>
    </div>
  );
};

export default Scanner;
