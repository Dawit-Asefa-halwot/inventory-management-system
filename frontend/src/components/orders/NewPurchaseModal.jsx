import React, { useState, useEffect, useRef } from 'react';
// import { supabase } from '../../lib/supabase';
import Button from '../ui/button';
import Input from '../ui/input';
import { Package, Upload, Plus, Minus, X } from 'lucide-react';

const NewPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
     const [categories, setCategories] = useState([]);
     const [suppliers, setSuppliers] = useState([]);
     const [selectedProducts, setSelectedProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     const [supplierId, setSupplierId] = useState('');
     const fileInputRef = useRef(null);

     useEffect(() => {
          fetchCategories();
          fetchSuppliers();
     }, []);

     const fetchCategories = async () => {
          const { data } = await supabase
               .from('categories')
               .select('id, name');
          if (data) setCategories(data);
     };

     const fetchSuppliers = async () => {
          setSuppliers([
               { id: 'SUP-001', name: 'Tech Solutions Inc.' },
               { id: 'SUP-002', name: 'Global Electronics Ltd.' },
               { id: 'SUP-003', name: 'Quality Parts Co.' }
          ]);
     };

     const handleAddProduct = () => {
          setSelectedProducts(prev => [...prev, {
               name: '',
               description: '',
               categoryId: categories[0]?.id || '',
               price: 0,
               quantity: 1
          }]);
     };

     const handleRemoveProduct = (index) => {
          setSelectedProducts(prev => prev.filter((_, i) => i !== index));
     };

     const handleProductChange = (index, field, value) => {
          setSelectedProducts(prev => prev.map((product, i) => {
               if (i === index) {
                    return { ...product, [field]: value };
               }
               return product;
          }));
     };

     const handleImageUpload = async (index, file) => {
          handleProductChange(index, 'imageFile', file);
          handleProductChange(index, 'imageUrl', URL.createObjectURL(file));
     };

     const calculateTotal = () => {
          return selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     };

     const handleSubmit = async () => {
          try {
               setLoading(true);

               const { data: purchaseOrder, error: purchaseError } = await supabase
                    .from('purchase_orders')
                    .insert({
                         supplier_id: supplierId,
                         total_amount: calculateTotal(),
                         status: 'completed'
                    })
                    .select()
                    .single();

               if (purchaseError) throw purchaseError;

               for (const item of selectedProducts) {
                    const { data: product, error: productError } = await supabase
                         .from('products')
                         .insert({
                              name: item.name,
                              description: item.description,
                              category_id: item.categoryId,
                              price: item.price,
                              quantity: item.quantity,
                              image_url: item.imageUrl,
                              qr_code: `PROD-${Math.random().toString(36).substr(2, 9)}`
                         })
                         .select()
                         .single();

                    if (productError) throw productError;

                    if (product) {
                         await supabase
                              .from('purchase_items')
                              .insert({
                                   purchase_id: purchaseOrder.id,
                                   product_id: product.id,
                                   quantity: item.quantity,
                                   price: item.price
                              });
                    }
               }

               onSuccess();
               onClose();
          } catch (error) {
               console.error('Error creating purchase:', error);
          } finally {
               setLoading(false);
          }
     };

     if (!isOpen) return null;

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-xl font-semibold">New Purchase Order</h2>
                    </div>

                    <div className="p-6 space-y-6">
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Select Supplier
                              </label>
                              <select
                                   value={supplierId}
                                   onChange={(e) => setSupplierId(e.target.value)}
                                   className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                              >
                                   <option value="">Select a supplier</option>
                                   {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                             {supplier.name}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="space-y-4">
                              {selectedProducts.map((product, index) => (
                                   <div key={index} className="border rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div className="space-y-4">
                                                  <Input
                                                       label="Product Name"
                                                       value={product.name}
                                                       onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                  />

                                                  <Input
                                                       label="Description"
                                                       value={product.description}
                                                       onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                                                       placeholder="Enter product description"
                                                  />

                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Category
                                                       </label>
                                                       <select
                                                            value={product.categoryId}
                                                            onChange={(e) => handleProductChange(index, 'categoryId', e.target.value)}
                                                            className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                                                       >
                                                            {categories.map((category) => (
                                                                 <option key={category.id} value={category.id}>
                                                                      {category.name}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                  </div>

                                                  <div className="grid grid-cols-2 gap-4">
                                                       <Input
                                                            type="number"
                                                            label="Price"
                                                            value={product.price}
                                                            onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
                                                       />
                                                       <Input
                                                            type="number"
                                                            label="Quantity"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-4">
                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Product Image
                                                       </label>
                                                       <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                                            {product.imageUrl ? (
                                                                 <div className="relative">
                                                                      <img
                                                                           src={product.imageUrl}
                                                                           alt="Product"
                                                                           className="w-full h-48 object-cover rounded"
                                                                      />
                                                                      <Button
                                                                           variant="ghost"
                                                                           size="sm"
                                                                           className="absolute top-2 right-2 bg-white"
                                                                           onClick={() => {
                                                                                handleProductChange(index, 'imageUrl', undefined);
                                                                                handleProductChange(index, 'imageFile', undefined);
                                                                           }}
                                                                      >
                                                                           <X size={14} />
                                                                      </Button>
                                                                 </div>
                                                            ) : (
                                                                 <div
                                                                      className="cursor-pointer"
                                                                      onClick={() => fileInputRef.current?.click()}
                                                                 >
                                                                      <Upload size={24} className="mx-auto text-gray-400" />
                                                                      <p className="mt-1 text-sm text-gray-500">
                                                                           Click to upload image
                                                                      </p>
                                                                      <input
                                                                           type="file"
                                                                           ref={fileInputRef}
                                                                           className="hidden"
                                                                           accept="image/*"
                                                                           onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) handleImageUpload(index, file);
                                                                           }}
                                                                      />
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>

                                                  <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       className="text-red-600 w-full"
                                                       onClick={() => handleRemoveProduct(index)}
                                                  >
                                                       Remove Product
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              ))}

                              <Button
                                   variant="outline"
                                   onClick={handleAddProduct}
                                   icon={<Plus size={16} />}
                              >
                                   Add Product
                              </Button>
                         </div>

                         <div className="border-t pt-4 mt-6 flex items-center justify-between">
                              <div className="text-lg font-semibold">
                                   Total: ${calculateTotal().toFixed(2)}
                              </div>
                              <div className="flex gap-2">
                                   <Button variant="outline" onClick={onClose}>
                                        Cancel
                                   </Button>
                                   <Button
                                        variant="primary"
                                        onClick={handleSubmit}
                                        isLoading={loading}
                                        disabled={selectedProducts.length === 0 || !supplierId}
                                   >
                                        Complete Purchase
                                   </Button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default NewPurchaseModal;
