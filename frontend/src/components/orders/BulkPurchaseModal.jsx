import React, { useState } from 'react';
import Button from '../ui/button';
import * as XLSX from 'xlsx';
import { BASE_URL } from '../../config';

const BulkPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     const handleFileUpload = async (e) => {
          setError(null);
          const file = e.target.files[0];
          if (!file) return;

          setLoading(true);
          try {
               const data = await file.arrayBuffer();
               const workbook = XLSX.read(data, { type: 'array' });
               const sheet = workbook.Sheets[workbook.SheetNames[0]];
               const rows = XLSX.utils.sheet_to_json(sheet);

               // Validate columns
               const requiredColumns = ['name', 'description', 'category_id', 'purchase_price', 'selling_price', 'quantity', 'image_url'];
               for (const col of requiredColumns) {
                    if (!Object.keys(rows[0]).includes(col)) {
                         throw new Error(`Missing column: ${col}`);
                    }
               }

               // Create products
               const createdProducts = [];
               for (const row of rows) {
                    const response = await fetch(`${BASE_URL}/api/products`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                              name: row.name,
                              description: row.description,
                              category_id: parseInt(row.category_id),
                              purchase_price: parseFloat(row.purchase_price),
                              selling_price: parseFloat(row.selling_price),
                              quantity: parseInt(row.quantity),
                              image_url: row.image_url
                         })
                    });
                    const product = await response.json();
                    if (!response.ok) throw new Error(product.error || 'Failed to create product');
                    createdProducts.push(product);
               }

               // Create purchase order
               const supplierId = prompt('Enter Supplier ID for this bulk purchase:');
               if (!supplierId) throw new Error('Supplier ID is required.');

               const items = createdProducts.map(prod => ({
                    product_id: prod.id,
                    quantity: prod.quantity,
                    price: prod.purchase_price
               }));

               const purchaseRes = await fetch(`${BASE_URL}/api/purchase-orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                         supplier_id: parseInt(supplierId),
                         items
                    })
               });
               const purchaseOrder = await purchaseRes.json();
               if (!purchaseRes.ok) throw new Error(purchaseOrder.error || 'Failed to create purchase order');

               onSuccess();
               onClose();
          } catch (err) {
               setError(err.message);
          } finally {
               setLoading(false);
          }
     };

     if (!isOpen) return null;

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-xl font-semibold">Bulk Purchase Upload</h2>
                    </div>
                    <div className="p-6 space-y-4">
                         <input
                              type="file"
                              accept=".xlsx,.xls"
                              onChange={handleFileUpload}
                              disabled={loading}
                         />
                         <p className="text-sm text-gray-500">
                              Upload an Excel file with columns: <br />
                              <strong>name, description, category_id, purchase_price, selling_price, quantity, image_url</strong>
                         </p>
                         {error && (
                              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
                         )}
                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={onClose} disabled={loading}>
                                   Cancel
                              </Button>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default BulkPurchaseModal;