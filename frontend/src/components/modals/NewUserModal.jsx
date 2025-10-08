import React, { useState, useEffect } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import { BASE_URL } from '../../config';
const NewUserModal = ({ isOpen, onClose, onSuccess, editingUser }) => {
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          password: '',
          role: 'staff',
     });

     useEffect(() => {
          if (editingUser) {
               setFormData({
                    name: editingUser.name || '',
                    email: editingUser.email || '',
                    password: '', // clear password on edit (optional: add change password later)
                    role: editingUser.role || 'staff',
               });
          } else {
               setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'staff',
               });
          }
     }, [editingUser]);

     const handleSubmit = async (e) => {
          e.preventDefault();

          // On edit, password is optional
          if (!formData.email || (!editingUser && !formData.password)) {
               setError('Email and password are required');
               return;
          }

          setLoading(true);
          setError(null);

          try {
               const method = editingUser ? 'PUT' : 'POST';
               const url = editingUser
                    ? `${BASE_URL}/api/users/${editingUser.id}`
                    : `${BASE_URL}/api/users`;


               // Build data to send - exclude password if empty on update
               const dataToSend = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
               };
               if (!editingUser || formData.password) {
                    dataToSend.password = formData.password;
               }

               const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(dataToSend),
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save user');
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
                              {editingUser ? 'Edit User' : 'Add New User'}
                         </h2>
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
                              label={editingUser ? "Password (leave blank to keep current)" : "Password"}
                              type="password"
                              icon={<Lock size={18} />}
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required={!editingUser} // required only if creating new user
                         />

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
                              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
                         )}

                         <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={onClose} disabled={loading}>
                                   Cancel
                              </Button>
                              <Button variant="primary" type="submit" isLoading={loading} disabled={loading}>
                                   {loading ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default NewUserModal;
