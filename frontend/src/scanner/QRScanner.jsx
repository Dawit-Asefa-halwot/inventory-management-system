import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError }) => {
     const [isScanning, setIsScanning] = useState(false);
     const scannerRef = useRef(null);

     useEffect(() => {
          scannerRef.current = new Html5QrcodeScanner(
               "qr-reader",
               { fps: 10, qrbox: { width: 250, height: 250 } },
               false
          );

          scannerRef.current.render(
               (decodedText) => {
                    onScanSuccess(decodedText);
                    if (scannerRef.current) {
                         scannerRef.current.clear();
                         setIsScanning(false);
                    }
               },
               (error) => {
                    if (onScanError) {
                         onScanError(error);
                    }
               }
          );

          setIsScanning(true);

          return () => {
               if (scannerRef.current) {
                    scannerRef.current.clear();
               }
          };
     }, [onScanSuccess, onScanError]);

     return (
          <div className="qr-scanner">
               <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
               {isScanning && (
                    <p className="text-center mt-4 text-gray-600">
                         Position the QR code within the frame to scan
                    </p>
               )}
          </div>
     );
};

export default QRScanner;
