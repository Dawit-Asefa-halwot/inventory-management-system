import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../ui/button';

const PurchaseDetailModal = ({ isOpen, onClose, purchase }) => {
     const [activeProduct, setActiveProduct] = useState(null);
     const qrRef = useRef(null); // Create a ref for the QR code container

     if (!isOpen || !purchase) return null;

     // Helper function to format prices safely
     const formatPrice = (price) => {
          const num = parseFloat(price);
          return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
     };



     //png format



     // const downloadQRCode = (productId) => {
     //     try {
     //         if (!qrRef.current) return;

     //         const svgElement = qrRef.current.querySelector(`#qr-svg-${productId} svg`);
     //         if (!svgElement) return;

     //         // Create a canvas element
     //         const canvas = document.createElement('canvas');
     //         const ctx = canvas.getContext('2d');

     //         // Set canvas size to match SVG
     //         const svgRect = svgElement.getBoundingClientRect();
     //         canvas.width = svgRect.width;
     //         canvas.height = svgRect.height;

     //         // Convert SVG to data URL
     //         const svgData = new XMLSerializer().serializeToString(svgElement);
     //         const img = new Image();
     //         const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
     //         const url = URL.createObjectURL(svgBlob);

     //         img.onload = function() {
     //             ctx.drawImage(img, 0, 0);
     //             URL.revokeObjectURL(url);

     //             // Create download link for PNG
     //             const pngUrl = canvas.toDataURL('image/png');
     //             const downloadLink = document.createElement('a');
     //             downloadLink.href = pngUrl;
     //             downloadLink.download = `Product-${productId}.png`;
     //             document.body.appendChild(downloadLink);
     //             downloadLink.click();
     //             document.body.removeChild(downloadLink);
     //         };

     //         img.src = url;
     //     } catch (error) {
     //         console.error('Error downloading QR code:', error);
     //         alert('Failed to download QR code');
     //     }
     // };







     //svg format

     const downloadQRCode = (productId) => {
          try {
               if (!qrRef.current) return;

               // Find the specific QR code SVG element
               const svgElement = qrRef.current.querySelector(`#qr-svg-${productId} svg`);
               if (!svgElement) return;

               // Serialize the SVG to string
               const svgData = new XMLSerializer().serializeToString(svgElement);

               // Create a Blob with SVG data
               const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
               const url = URL.createObjectURL(svgBlob);

               // Create download link
               const downloadLink = document.createElement("a");
               downloadLink.href = url;
               downloadLink.download = `Product-${productId}.svg`;
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
               <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                         <div>
                              <h3 className="text-lg font-semibold">Purchase Order #{purchase.id}</h3>
                              <p className="text-sm text-gray-500">
                                   Supplier: {purchase.supplier?.name || `Supplier #${purchase.supplier_id}`}
                              </p>
                              <p className="text-sm text-gray-500">Date: {new Date(purchase.created_at).toLocaleString()}</p>
                         </div>
                         <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                              &times;
                         </button>
                    </div>

                    <div className="mb-6">
                         <h4 className="font-medium mb-3">Products</h4>
                         <table className="w-full border-collapse">
                              <thead>
                                   <tr className="bg-gray-50">
                                        <th className="border p-2 text-left">Product</th>
                                        <th className="border p-2 text-left">Quantity</th>
                                        <th className="border p-2 text-left">Unit Price</th>
                                        <th className="border p-2 text-left">Total</th>
                                        <th className="border p-2 text-left">QR Code</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {purchase.items?.map((item, index) => {
                                        // Safely parse prices
                                        const unitPrice = parseFloat(item.price);
                                        const totalPrice = parseFloat(item.price) * item.quantity;

                                        return (
                                             <tr key={index}>
                                                  <td className="border p-2">{item.product?.name || 'Unknown Product'}</td>
                                                  <td className="border p-2">{item.quantity}</td>
                                                  <td className="border p-2">{formatPrice(item.price)}</td>
                                                  <td className="border p-2">{formatPrice(totalPrice)}</td>
                                                  <td className="border p-2">
                                                       <div className="flex gap-2">
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => setActiveProduct(item.product?.id)}
                                                                 disabled={!item.product?.id}
                                                            >
                                                                 Show QR
                                                            </Button>
                                                            <Button
                                                                 variant="primary"
                                                                 size="sm"
                                                                 onClick={() => downloadQRCode(item.product?.id)}
                                                                 disabled={!item.product?.id}
                                                            >
                                                                 Download
                                                            </Button>
                                                       </div>
                                                  </td>
                                             </tr>
                                        );
                                   })}
                              </tbody>
                         </table>
                    </div>

                    {/* QR Preview Section */}
                    {activeProduct && (
                         <div ref={qrRef} className="border-t pt-4 mt-4">
                              <h4 className="font-medium mb-3">QR Code Preview</h4>
                              <div className="flex flex-col items-center">
                                   <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                                        <div id={`qr-svg-${activeProduct}`}>
                                             <QRCodeSVG
                                                  value={activeProduct.toString()}
                                                  size={200}
                                                  includeMargin={true}
                                                  level="H"
                                             />
                                        </div>
                                   </div>
                                   <p className="text-gray-600 mb-1">
                                        Product ID: <span className="font-mono font-bold">{activeProduct}</span>
                                   </p>
                              </div>
                         </div>
                    )}

                    <div className="flex justify-end mt-4">
                         <Button
                              variant="outline"
                              onClick={onClose}
                         >
                              Close
                         </Button>
                    </div>
               </div>
          </div>
     );
};

export default PurchaseDetailModal;