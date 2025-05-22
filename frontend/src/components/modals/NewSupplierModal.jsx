import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';

const API_URL = 'http://localhost:5000/api/suppliers';

const NewSupplierModal = ({ isOpen, onClose, onSuccess }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          phone: '',
          address: ''
     });

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          // Validation
          if (!formData.name.trim()) {
               setError('Company name is required');
               setLoading(false);
               return;
          }

          if (!formData.email.trim()) {
               setError('Email is required');
               setLoading(false);
               return;
          }

          if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
               setError('Please enter a valid email address');
               setLoading(false);
               return;
          }

          try {
               const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         name: formData.name.trim(),
                         email: formData.email.trim(),
                         phone: formData.phone.trim() || null,
                         address: formData.address.trim() || null
                    })
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Failed to create supplier');
               }

               // Reset form
               setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: ''
               });

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
                         <h2 className="text-xl font-semibold">Add New Supplier</h2>
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

                         <Input
                              label="Phone (Optional)"
                              type="tel"
                              icon={<Phone size={18} />}
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="Enter phone number"
                         />

                         <Input
                              label="Address (Optional)"
                              icon={<MapPin size={18} />}
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Enter physical address"
                         />

                         {error && (
                              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                   {error}
                              </div>
                         )}

                         <div className="flex justify-end gap-2 pt-2">
                              <Button
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={loading}
                                   type="button"
                              >
                                   Cancel
                              </Button>
                              <Button
                                   variant="primary"
                                   type="submit"
                                   isLoading={loading}
                                   disabled={loading}
                              >
                                   {loading ? 'Creating...' : 'Create Supplier'}
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewSupplierModal;