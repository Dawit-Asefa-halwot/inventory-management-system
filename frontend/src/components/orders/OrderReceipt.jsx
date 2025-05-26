import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import Badge from '../ui/badge';
import Button from '../ui/button';

const OrderReceipt = React.forwardRef((props, ref) => {
     const { orderId, items, totalAmount, date, type, status } = props;

     // Use the forwarded ref or create a new one if not provided
     const internalRef = useRef();
     const receiptRef = ref || internalRef;

     const handlePrint = useReactToPrint({
          content: () => receiptRef.current,
          documentTitle: `${type}_receipt_${orderId}`,
          onAfterPrint: () => console.log('Printed successfully!'),
          removeAfterPrint: true,
          pageStyle: `
      @page { size: auto; margin: 5mm; }
      @media print {
        body { visibility: hidden; }
        .print-container { visibility: visible; }
      }
    `
     });

     const printStyles = `
    @media print {
      body * { 
        visibility: hidden;
      }
      .print-container, .print-container * {
        visibility: visible;
      }
      .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
        font-size: 14px;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

     return (
          <div className="p-6 bg-white rounded-lg">
               <style>{printStyles}</style>
               <div ref={receiptRef} className="print-container">
                    {/* Receipt Header */}
                    <div className="mb-4 text-center">
                         <h2 className="text-2xl font-bold mb-2">
                              {type === 'sale' ? 'SALES RECEIPT' : 'PURCHASE ORDER'}
                         </h2>
                         <div className="flex justify-center items-center gap-2 mb-2">
                              <p className="text-sm">Order ID: {orderId}</p>
                              <Badge variant={status === 'completed' ? 'success' : 'warning'}>
                                   {status.toUpperCase()}
                              </Badge>
                         </div>
                         <p className="text-sm text-gray-600">
                              {new Date(date).toLocaleDateString('en-US', {
                                   year: 'numeric',
                                   month: 'short',
                                   day: 'numeric',
                                   hour: '2-digit',
                                   minute: '2-digit'
                              })}
                         </p>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-4">
                         <thead>
                              <tr className="border-b">
                                   <th className="text-left pb-2">Item</th>
                                   <th className="text-right pb-2">Qty</th>
                                   <th className="text-right pb-2">Price</th>
                                   <th className="text-right pb-2">Total</th>
                              </tr>
                         </thead>
                         <tbody>
                              {items.map((item, index) => (
                                   <tr key={index} className="border-b">
                                        <td className="py-2">{item.name}</td>
                                        <td className="text-right py-2">{item.quantity}</td>
                                        <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                        <td className="text-right py-2">${(item.quantity * item.price).toFixed(2)}</td>
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

                    {/* Additional receipt information */}
                    <div className="mt-8 pt-4 border-t">
                         <p className="text-sm text-gray-600">Thank you for your business!</p>
                         <p className="text-xs text-gray-500 mt-2">
                              For any inquiries, please contact support@example.com
                         </p>
                    </div>
               </div>

               {/* Print Button */}
               <div className="mt-4 flex justify-end no-print">
                    <Button
                         variant="primary"
                         onClick={() => {
                              console.log('Print button clicked, ref:', receiptRef.current);
                              setTimeout(handlePrint, 100); // Small delay to ensure ref is available
                         }}
                         icon={<Printer size={16} />}
                    >
                         Print Receipt
                    </Button>
               </div>
          </div>
     );
});

OrderReceipt.displayName = 'OrderReceipt';

export default OrderReceipt;