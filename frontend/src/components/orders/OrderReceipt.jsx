import React from 'react';
import { useReactToPrint } from 'react-to-print';

const OrderReceipt = ({
     orderId,
     items,
     totalAmount,
     date,
     type
}) => {
     const componentRef = React.useRef(null);
     const handlePrint = useReactToPrint({
          content: () => componentRef.current,
     });

     return (
          <div>
               <div ref={componentRef} className="p-6 bg-white">
                    <div className="text-center mb-6">
                         <h2 className="text-2xl font-bold">
                              {type === 'sale' ? 'Sales Receipt' : 'Purchase Order'}
                         </h2>
                         <p className="text-gray-600">{orderId}</p>
                         <p className="text-gray-600">
                              {new Date(date).toLocaleDateString('en-US', {
                                   year: 'numeric',
                                   month: 'long',
                                   day: 'numeric',
                                   hour: '2-digit',
                                   minute: '2-digit'
                              })}
                         </p>
                    </div>

                    <table className="w-full mb-6">
                         <thead>
                              <tr className="border-b">
                                   <th className="text-left py-2">Item</th>
                                   <th className="text-right py-2">Qty</th>
                                   <th className="text-right py-2">Price</th>
                                   <th className="text-right py-2">Total</th>
                              </tr>
                         </thead>
                         <tbody>
                              {items.map((item, index) => (
                                   <tr key={index} className="border-b">
                                        <td className="py-2">{item.name}</td>
                                        <td className="text-right py-2">{item.quantity}</td>
                                        <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                        <td className="text-right py-2">
                                             ${(item.quantity * item.price).toFixed(2)}
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                         <tfoot>
                              <tr className="font-bold">
                                   <td colSpan={3} className="text-right py-2">Total:</td>
                                   <td className="text-right py-2">${totalAmount.toFixed(2)}</td>
                              </tr>
                         </tfoot>
                    </table>
               </div>

               <div className="mt-4 flex justify-end">
                    <button
                         onClick={handlePrint}
                         className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                         Print Receipt
                    </button>
               </div>
          </div>
     );
};

export default OrderReceipt;
