import React, { useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRDisplayModal = ({ isOpen, onClose, purchaseOrderId }) => {
     const qrRef = useRef(null);

     if (!isOpen) return null;

     const downloadQRCode = () => {
          if (!qrRef.current) return;

          try {
               // Get the SVG element
               const svgElement = qrRef.current.querySelector('svg');
               if (!svgElement) return;

               // Convert SVG to data URL
               const svgData = new XMLSerializer().serializeToString(svgElement);
               const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
               const url = URL.createObjectURL(svgBlob);

               // Create download link
               const downloadLink = document.createElement("a");
               downloadLink.href = url;
               downloadLink.download = `PO-${purchaseOrderId}.svg`;
               document.body.appendChild(downloadLink);
               downloadLink.click();

               // Clean up
               setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);
               }, 0);
          } catch (error) {
               console.error('Error downloading QR code:', error);
               alert('Failed to download QR code');
          }
     };

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-semibold">Purchase Order QR Code</h3>
                         <button
                              onClick={onClose}
                              className="text-gray-500 hover:text-gray-700 text-2xl"
                         >
                              &times;
                         </button>
                    </div>

                    <div ref={qrRef} className="flex flex-col items-center">
                         <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                              {/* Updated QR component without inline comment */}
                              <QRCodeSVG
                                   value={purchaseOrderId.toString()}
                                   size={200}
                                   includeMargin={true}
                                   level="H"
                              />
                         </div>

                         <p className="text-gray-600 mb-1">
                              PO: <span className="font-mono font-bold">{purchaseOrderId}</span>
                         </p>

                         <p className="text-sm text-gray-500 mb-4 text-center">
                              Scan this QR code to quickly look up this purchase order
                         </p>

                         <button
                              onClick={downloadQRCode}
                              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                         >
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   className="h-5 w-5 mr-2"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   stroke="currentColor"
                              >
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                   />
                              </svg>
                              Download QR Code
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default QRDisplayModal;