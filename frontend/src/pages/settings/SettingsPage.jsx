import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Shield, User, Globe, Palette } from 'lucide-react';

const SettingsPage = () => {
     const { user, logout } = useAuth();
     const { theme, language, setTheme, changeLanguage } = useTheme();

     // Change Password State
     const [currentPassword, setCurrentPassword] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [changing, setChanging] = useState(false);
     const [message, setMessage] = useState('');
     const [error, setError] = useState('');

     // Auto-dismiss success and error messages after 5 seconds
     useEffect(() => {
          if (message || error) {
               const timer = setTimeout(() => {
                    setMessage('');
                    setError('');
               }, 5000);
               return () => clearTimeout(timer);
          }
     }, [message, error]);

     const handleChangePassword = async () => {
          if (newPassword !== confirmPassword) {
               setError('New passwords do not match');
               setMessage('');
               return;
          }

          if (newPassword.length < 6) {
               setError('New password must be at least 6 characters long');
               setMessage('');
               return;
          }

          setChanging(true);
          setError('');
          setMessage('');

          try {
               const res = await fetch('http://localhost:5000/api/auth/change-password', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword }),
               });

               const data = await res.json();
               if (!res.ok) throw new Error(data.error || 'Failed to change password');

               setMessage('Password changed successfully');
               setError('');
               setCurrentPassword('');
               setNewPassword('');
               setConfirmPassword('');
          } catch (error) {
               console.error('Change password error:', error);
               setError(error.message);
               setMessage('');
          } finally {
               setChanging(false);
          }
     };

     const handleLogout = () => {
          logout();
     };

     return (
          <div className="p-6 max-w-4xl mx-auto">
               <h1 className="text-2xl font-bold mb-6">System Settings</h1>

               {message && (
                    <div className="mb-4 text-green-600 bg-green-50 border border-green-200 rounded p-2">
                         {message}
                    </div>
               )}
               {error && (
                    <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">
                         {error}
                    </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Account Information */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <div className="flex items-center gap-2 mb-4">
                              <User size={20} className="text-indigo-600" />
                              <h2 className="text-lg font-semibold">Account Information</h2>
                         </div>
                         <div className="space-y-4">
                              <div>
                                   <p className="text-sm text-gray-500">Name</p>
                                   <p className="font-medium">{user?.name || 'Not set'}</p>
                              </div>
                              <div>
                                   <p className="text-sm text-gray-500">Email</p>
                                   <p className="font-medium">{user?.email}</p>
                              </div>
                              <div>
                                   <p className="text-sm text-gray-500">Role</p>
                                   <p className="font-medium capitalize">{user?.role}</p>
                              </div>
                         </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <div className="flex items-center gap-2 mb-4">
                              <Shield size={20} className="text-indigo-600" />
                              <h2 className="text-lg font-semibold">Change Password</h2>
                         </div>
                         <div className="space-y-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                   </label>
                                   <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter current password"
                                   />
                              </div>

                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                   </label>
                                   <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter new password"
                                   />
                              </div>

                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                   </label>
                                   <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Confirm new password"
                                   />
                              </div>

                              <button
                                   onClick={handleChangePassword}
                                   disabled={changing || !currentPassword || !newPassword || !confirmPassword}
                                   className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                   {changing ? 'Changing Password...' : 'Change Password'}
                              </button>
                         </div>
                    </div>

                    {/* System Preferences */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <div className="flex items-center gap-2 mb-4">
                              <Globe size={20} className="text-indigo-600" />
                              <h2 className="text-lg font-semibold">System Preferences</h2>
                         </div>
                         <div className="space-y-4">
                              {/* <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                   </label>
                                   <select 
                                        value={language}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                   >
                                        <option value="en">English</option>
                                        <option value="am">አማርኛ</option>
                                        <option value="om">Oromiffa</option>
                                   </select>
                              </div> */}

                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Theme
                                   </label>
                                   <select
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                   >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                   </select>
                              </div>
                         </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <div className="flex items-center gap-2 mb-4">
                              <LogOut size={20} className="text-red-600" />
                              <h2 className="text-lg font-semibold">Account Actions</h2>
                         </div>
                         <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                   Sign out of your account. You will need to log in again to access the system.
                              </p>
                              <button
                                   onClick={handleLogout}
                                   className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                              >
                                   <div className="flex items-center justify-center gap-2">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                   </div>
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default SettingsPage;