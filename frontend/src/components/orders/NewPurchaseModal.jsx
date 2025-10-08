import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import { Upload, Plus, X } from 'lucide-react';
import { BASE_URL } from '../../config';

const NewPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
     const [categories, setCategories] = useState([]);
     const [suppliers, setSuppliers] = useState([]);
     const [selectedProducts, setSelectedProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     const [supplierId, setSupplierId] = useState('');
     const [error, setError] = useState(null);
     const fileInputRef = useRef(null);

     useEffect(() => {
          if (isOpen) {
               fetchCategories();
               fetchSuppliers();
          }
     }, [isOpen]);

     const fetchCategories = async () => {
          try {
               const response = await fetch(`${BASE_URL}/api/categories`);
               if (!response.ok) throw new Error('Failed to fetch categories');
               const data = await response.json();
               setCategories(data);
          } catch (error) {
               console.error('Error fetching categories:', error);
               setError('Failed to load categories');
          }
     };

     const fetchSuppliers = async () => {
          try {
               const response = await fetch(`${BASE_URL}/api/suppliers`);
               if (!response.ok) throw new Error('Failed to fetch suppliers');
               const data = await response.json();
               setSuppliers(data);
          } catch (error) {
               console.error('Error fetching suppliers:', error);
               setError('Failed to load suppliers');
          }
     };

     const handleAddProduct = () => {
          setSelectedProducts(prev => [...prev, {
               name: '',
               description: '',
               categoryId: categories[0]?.id || '',
               price: '',
               quantity: '',
               imageUrl: '',
               imageFile: null
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

     const uploadImage = async (file) => {
          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch(`${BASE_URL}/api/upload`, {
               method: 'POST',
               body: formData,
          });

          if (!response.ok) {
               throw new Error('Failed to upload image');
          }

          const data = await response.json();
          return data.imageUrl;
     };

     const calculateTotal = () => {
          return selectedProducts.reduce((sum, item) => {
               const price = parseFloat(item.price) || 0;
               const quantity = parseInt(item.quantity) || 0;
               return sum + (price * quantity);
          }, 0);
     };

     const handleSubmit = async () => {
          try {
               setLoading(true);
               setError(null);

               // Validate inputs
               if (!supplierId) {
                    throw new Error('Please select a supplier');
               }

               if (selectedProducts.length === 0) {
                    throw new Error('Please add at least one product');
               }

               for (const product of selectedProducts) {
                    if (!product.name || !product.price || !product.quantity) {
                         throw new Error('Please fill in all required fields for all products');
                    }
               }

               // First create products
               const products = await Promise.all(
                    selectedProducts.map(async (product) => {
                         let imageUrl = product.imageUrl;

                         // Upload image if exists
                         if (product.imageFile) {
                              imageUrl = await uploadImage(product.imageFile);
                         }

                         const productPayload = {
                              name: product.name,
                              description: product.description,
                              category_id: product.categoryId ? parseInt(product.categoryId) : null,
                              purchase_price: parseFloat(product.price),
                              selling_price: parseFloat(product.price) * 1.1, // 10% higher
                              quantity: parseInt(product.quantity),
                              image_url: imageUrl || ''
                         };

                         const response = await fetch(`${BASE_URL}/api/products`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(productPayload)
                         });

                         if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(errorData.error || `Failed to create product: ${product.name}`);
                         }

                         const data = await response.json();
                         return data;
                    })
               );

               // Create purchase order
               const payload = {
                    supplier_id: parseInt(supplierId),
                    items: products.map((createdProduct, index) => ({
                         product_id: createdProduct.id,
                         quantity: parseInt(selectedProducts[index].quantity),
                         price: parseFloat(selectedProducts[index].price)
                    }))
               };

               const response = await fetch(`${BASE_URL}/api/purchase-orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create purchase order');
               }

               await response.json();
               onSuccess();
               onClose();

               // Reset form
               setSelectedProducts([]);
               setSupplierId('');

          } catch (error) {
               console.error('Error in handleSubmit:', error);
               setError(error.message);
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
                         {/* Error Display */}
                         {error && (
                              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                   {error}
                              </div>
                         )}

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
                                                       label="Product Name *"
                                                       value={product.name}
                                                       onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                                       required
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
                                                            <option value="">Select a category</option>
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
                                                            label="Price *"
                                                            value={product.price}
                                                            onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                            min="0"
                                                            step="0.01"
                                                            required
                                                       />
                                                       <Input
                                                            type="number"
                                                            label="Quantity *"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                            min="1"
                                                            required
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
                                                                           alt="Product preview"
                                                                           className="w-full h-48 object-cover rounded"
                                                                      />
                                                                      <Button
                                                                           variant="ghost"
                                                                           size="sm"
                                                                           className="absolute top-2 right-2 bg-white"
                                                                           onClick={() => {
                                                                                handleProductChange(index, 'imageUrl', '');
                                                                                handleProductChange(index, 'imageFile', null);
                                                                           }}
                                                                      >
                                                                           <X size={14} />
                                                                      </Button>
                                                                 </div>
                                                            ) : (
                                                                 <div
                                                                      className="cursor-pointer"
                                                                      onClick={() => {
                                                                           const input = document.createElement('input');
                                                                           input.type = 'file';
                                                                           input.accept = 'image/*';
                                                                           input.onchange = (e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) handleImageUpload(index, file);
                                                                           };
                                                                           input.click();
                                                                      }}
                                                                 >
                                                                      <Upload size={24} className="mx-auto text-gray-400" />
                                                                      <p className="mt-1 text-sm text-gray-500">
                                                                           Click to upload image
                                                                      </p>
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
                                   <Button variant="outline" onClick={onClose} disabled={loading}>
                                        Cancel
                                   </Button>
                                   <Button
                                        variant="primary"
                                        onClick={handleSubmit}
                                        isLoading={loading}
                                        disabled={selectedProducts.length === 0 || !supplierId || loading}
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