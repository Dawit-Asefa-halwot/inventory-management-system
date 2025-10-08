import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import { BASE_URL } from '../../config';
const NewSupplierModal = ({ isOpen, onClose, onSuccess, editingSupplier }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          phone: '',
          address: '',
     });

     // Populate form when editingSupplier changes
     useEffect(() => {
          if (editingSupplier) {
               setFormData({
                    name: editingSupplier.name || '',
                    email: editingSupplier.email || '',
                    phone: editingSupplier.phone || '',
                    address: editingSupplier.address || '',
               });
          } else {
               setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
               });
          }
     }, [editingSupplier]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          // Phone validation
          if (formData.phone) {
               const phoneRegex = /^\+251\d{8,}$/;
               if (!phoneRegex.test(formData.phone)) {
                    setError('Phone number must start with +251 and contain 8 or more digits after.');
                    setLoading(false);
                    return;
               }
          }

          try {
               const method = editingSupplier ? 'PUT' : 'POST';
               const url = editingSupplier
                    ? `${BASE_URL}/api/suppliers/${editingSupplier.id}`
                    : `${BASE_URL}/api/suppliers`;


               const response = await fetch(url, {
                    method,
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save supplier');
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
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-xl font-semibold">
                              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                         </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                         <Input
                              label="Company Name"
                              icon={<Building2 size={18} />}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Enter company name"
                              required
                         />

                         <Input
                              label="Email"
                              type="email"
                              icon={<Mail size={18} />}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="Enter email address"
                              required
                         />

                         <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 select-none">+251</span>
                              <input
                                   type="tel"
                                   className="flex-1 border rounded px-3 py-2"
                                   value={formData.phone.replace(/^\+251/, '')}
                                   maxLength={9}
                                   pattern="\d{9}"
                                   onChange={(e) => {
                                        // Only allow numbers, max 9 digits
                                        const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                                        setFormData({ ...formData, phone: '+251' + digits });
                                   }}
                                   placeholder="9XXXXXXXX"
                                   required={false}
                              />
                         </div>

                         <Input
                              label="Address (Optional)"
                              icon={<MapPin size={18} />}
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Enter physical address"
                         />

                         {error && (
                              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
                         )}

                         <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" onClick={onClose} disabled={loading} type="button">
                                   Cancel
                              </Button>
                              <Button variant="primary" type="submit" isLoading={loading} disabled={loading}>
                                   {loading ? (editingSupplier ? 'Updating...' : 'Creating...') : (editingSupplier ? 'Update Supplier' : 'Create Supplier')}
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewSupplierModal;
