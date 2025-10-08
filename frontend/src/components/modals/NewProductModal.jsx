// components/modals/NewProductModal.jsx
import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, Hash, Upload, Image, Calculator } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import { getImageUrl } from '../../utils/imageUtils';
import { BASE_URL } from '../../config';

const NewProductModal = ({ isOpen, onClose, onSuccess, editingProduct }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [categories, setCategories] = useState([]);
     const [formData, setFormData] = useState({
          name: '',
          description: '',
          category_id: '',
          purchase_price: '',
          selling_price: '',
          quantity: '',
          image_url: '',
          qr_code: ''
     });

     // Calculate selling price automatically when purchase price changes
     useEffect(() => {
          if (formData.purchase_price && !editingProduct) {
               const purchasePrice = parseFloat(formData.purchase_price);
               if (!isNaN(purchasePrice)) {
                    const sellingPrice = (purchasePrice * 1.1).toFixed(2); // 10% higher
                    setFormData(prev => ({
                         ...prev,
                         selling_price: sellingPrice
                    }));
               }
          }
     }, [formData.purchase_price, editingProduct]);

     useEffect(() => {
          fetchCategories();
     }, []);

     useEffect(() => {
          if (editingProduct) {
               setFormData({
                    name: editingProduct.name || '',
                    description: editingProduct.description || '',
                    category_id: editingProduct.category_id || '',
                    purchase_price: editingProduct.purchase_price || editingProduct.price || '',
                    selling_price: editingProduct.selling_price || '',
                    quantity: editingProduct.quantity || '',
                    image_url: editingProduct.image_url || '',
                    qr_code: editingProduct.qr_code || ''
               });
          } else {
               setFormData({
                    name: '',
                    description: '',
                    category_id: '',
                    purchase_price: '',
                    selling_price: '',
                    quantity: '',
                    image_url: '',
                    qr_code: ''
               });
          }
     }, [editingProduct]);

     const fetchCategories = async () => {
          try {
               const response = await fetch(`${BASE_URL}/api/categories`);
               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }
               const data = await response.json();
               setCategories(data);
               setError(null);
          } catch (error) {
               console.error('Fetch error:', error);
               setError(error.message);
          }
     };

     const handleImageUpload = async (file) => {
          try {
               const formData = new FormData();
               formData.append('image', file);
               formData.append('type', 'product');

               const response = await fetch(`${BASE_URL}/api/upload`, {
                    method: 'POST',
                    body: formData
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Image upload failed');
               }

               const { imageUrl } = await response.json();
               setFormData(prev => ({ ...prev, image_url: imageUrl }));

          } catch (err) {
               setError('Error uploading image: ' + err.message);
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          try {
               const method = editingProduct ? 'PUT' : 'POST';
               const url = editingProduct
                    ? `${BASE_URL}/api/products/${editingProduct.id}`
                    : `${BASE_URL}/api/products`;

               const payload = {
                    name: formData.name,
                    description: formData.description,
                    category_id: parseInt(formData.category_id),
                    purchase_price: parseFloat(formData.purchase_price),
                    selling_price: parseFloat(formData.selling_price),
                    quantity: parseInt(formData.quantity),
                    image_url: formData.image_url
               };

               const response = await fetch(url, {
                    method,
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
               });

               const data = await response.json();

               if (!response.ok) {
                    setError(data.error || 'Failed to save product');
                    return;
               }

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-xl font-semibold">
                              {editingProduct ? 'Edit Product' : 'Add New Product'}
                         </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                         <Input
                              label="Product Name"
                              icon={<Package size={18} />}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                         />

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Description
                              </label>
                              <textarea
                                   value={formData.description}
                                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                   className="w-full rounded-md border border-gray-300 shadow-sm p-2 min-h-[100px]"
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Category
                              </label>
                              <select
                                   value={formData.category_id}
                                   onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                   className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                                   required
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
                                   label="Purchase Price"
                                   type="number"
                                   step="0.01"
                                   icon={<DollarSign size={18} />}
                                   value={formData.purchase_price}
                                   onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                                   required
                              />

                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <Calculator size={16} />
                                        Selling Price (10% higher)
                                   </label>
                                   <input
                                        type="number"
                                        step="0.01"
                                        value={formData.selling_price}
                                        onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                                        required
                                   />
                                   <p className="text-xs text-gray-500 mt-1">Automatically calculated from purchase price</p>
                              </div>
                         </div>

                         <Input
                              label="Quantity"
                              type="number"
                              icon={<Hash size={18} />}
                              value={formData.quantity}
                              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                              required
                         />

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Product Image
                              </label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                   <div className="space-y-1 text-center">
                                        {formData.image_url ? (
                                             <div className="relative">
                                                  <img
                                                       src={getImageUrl(formData.image_url)}
                                                       alt="Product"
                                                       className="mx-auto h-32 w-32 object-cover rounded-md"
                                                       onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                       }}
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() => setFormData({ ...formData, image_url: '' })}
                                                       className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 rounded-full p-1"
                                                  >
                                                       ×
                                                  </button>
                                             </div>
                                        ) : (
                                             <div className="flex flex-col items-center">
                                                  <Image size={24} className="text-gray-400" />
                                                  <div className="flex text-sm text-gray-600">
                                                       <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                            <span>Upload a file</span>
                                                            <input
                                                                 type="file"
                                                                 className="sr-only"
                                                                 accept="image/*"
                                                                 onChange={(e) => {
                                                                      const file = e.target.files?.[0];
                                                                      if (file) handleImageUpload(file);
                                                                 }}
                                                            />
                                                       </label>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </div>

                         {error && (
                              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                   <strong>Error:</strong> {error}
                              </div>
                         )}

                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={onClose} type="button">
                                   Cancel
                              </Button>
                              <Button
                                   variant="primary"
                                   type="submit"
                                   isLoading={loading}
                              >
                                   {editingProduct ? 'Update Product' : 'Create Product'}
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewProductModal;