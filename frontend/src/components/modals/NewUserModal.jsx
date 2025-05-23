import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
// import { supabase } from '../../lib/supabase';

const NewUserModal = ({ isOpen, onClose, onSuccess }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          password: '',
          role: 'staff'
     });

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          try {
               const response = await fetch('http://localhost:5000/api/users', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create customer');
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
                         <h2 className="text-xl font-semibold">Add New User</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                         <Input
                              label="Full Name"
                              icon={<User size={18} />}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                         />

                         <Input
                              label="Email"
                              type="email"
                              icon={<Mail size={18} />}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                         />

                         <Input
                              label="Password"
                              type="password"
                              icon={<Lock size={18} />}
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                         />

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                   Role
                              </label>
                              <select
                                   value={formData.role}
                                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                   className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                              >
                                   <option value="staff">Staff</option>
                                   <option value="admin">Admin</option>
                              </select>
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
                                   Create User
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewUserModal;
