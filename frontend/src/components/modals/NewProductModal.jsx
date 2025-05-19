import React, { useState, useEffect } from 'react';
import { Package, Tag, DollarSign, Hash, Upload, Image } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
// import { supabase } from '../../lib/supabase';

const NewProductModal = ({ isOpen, onClose, onSuccess }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [categories, setCategories] = useState([]);
     const [formData, setFormData] = useState({
          name: '',
          description: '',
          category_id: '',
          price: '',
          quantity: '',
          image_url: '',
          qr_code: ''
     });

     useEffect(() => {
          fetchCategories();
     }, []);

     const fetchCategories = async () => {
          try {
               const { data } = await supabase
                    .from('categories')
                    .select('id, name')
                    .order('name');

               if (data) {
                    setCategories(data);
                    if (data.length > 0 && !formData.category_id) {
                         setFormData(prev => ({ ...prev, category_id: data[0].id }));
                    }
               }
          } catch (error) {
               console.error('Error fetching categories:', error);
          }
     };

     const handleImageUpload = async (file) => {
          try {
               const fileExt = file.name.split('.').pop();
               const fileName = `${Math.random()}.${fileExt}`;
               const filePath = `product-images/${fileName}`;

               const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

               if (uploadError) throw uploadError;

               const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

               setFormData(prev => ({ ...prev, image_url: publicUrl }));
          } catch (err) {
               setError('Error uploading image: ' + err.message);
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          try {
               const qrCode = `PROD-${Math.random().toString(36).substr(2, 9)}`;

               const { error: insertError } = await supabase
                    .from('products')
                    .insert([{
                         ...formData,
                         price: parseFloat(formData.price),
                         quantity: parseInt(formData.quantity),
                         qr_code: qrCode
                    }]);

               if (insertError) throw insertError;

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
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-xl font-semibold">Add New Product</h2>
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
                                   label="Price"
                                   type="number"
                                   step="0.01"
                                   icon={<DollarSign size={18} />}
                                   value={formData.price}
                                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                   required
                              />

                              <Input
                                   label="Quantity"
                                   type="number"
                                   icon={<Hash size={18} />}
                                   value={formData.quantity}
                                   onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                   required
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Product Image
                              </label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                   <div className="space-y-1 text-center">
                                        {formData.image_url ? (
                                             <div className="relative">
                                                  <img
                                                       src={formData.image_url}
                                                       alt="Product"
                                                       className="mx-auto h-32 w-32 object-cover rounded-md"
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
                                   {error}
                              </div>
                         )}

                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={onClose}>
                                   Cancel
                              </Button>
                              <Button
                                   variant="primary"
                                   type="submit"
                                   isLoading={loading}
                              >
                                   Create Product
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewProductModal;
