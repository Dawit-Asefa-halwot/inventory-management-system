import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';

const ProfilePage = () => {
     const { user, updateProfilePicture } = useAuth();
     const [profile, setProfile] = useState(null);
     const [loading, setLoading] = useState(true);
     const [selectedFile, setSelectedFile] = useState(null);
     const [previewUrl, setPreviewUrl] = useState('');
     const [uploading, setUploading] = useState(false);
     const fileInputRef = useRef(null);

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

     // Fetch profile data
     useEffect(() => {
          const fetchProfile = async () => {
               try {
                    const response = await fetch('http://localhost:5000/api/auth/profile', {
                         credentials: 'include',
                    });

                    if (response.ok) {
                         const data = await response.json();
                         setProfile(data);
                    }
               } catch (error) {
                    console.error('Profile fetch error:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchProfile();
     }, []);

     // Function to get current profile picture URL
     const getCurrentProfilePicture = () => {
          // If we have a preview (newly selected image), show that
          if (previewUrl) return previewUrl;

          // If we have a profile picture from the current user context, use that
          if (user?.profilePicture) {
               return user.profilePicture.startsWith('http')
                    ? user.profilePicture
                    : `http://localhost:5000${user.profilePicture}`;
          }

          // If we have a profile picture from the fetched profile data, use that
          if (profile?.profilePicture) {
               return profile.profilePicture.startsWith('http')
                    ? profile.profilePicture
                    : `http://localhost:5000${profile.profilePicture}`;
          }

          // No profile picture available
          return null;
     };

     const handleFileChange = (e) => {
          const file = e.target.files[0];
          if (file) {
               setSelectedFile(file);
               const reader = new FileReader();
               reader.onloadend = () => {
                    setPreviewUrl(reader.result);
               };
               reader.readAsDataURL(file);
          }
     };

     const handleUpload = async () => {
          if (!selectedFile) return;

          setUploading(true);
          setError('');

          try {
               const formData = new FormData();
               formData.append('profilePicture', selectedFile);

               const response = await fetch('http://localhost:5000/api/auth/upload-profile-picture', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
               });

               if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server error: ${response.status} - ${errorText}`);
               }

               const result = await response.json();
               console.log('Upload response:', result);

               // Update profile picture in context
               if (result.profilePicture) {
                    updateProfilePicture(result.profilePicture);
                    setMessage('Profile picture updated successfully!');
               }

               // Clear the file input and preview
               setPreviewUrl('');
               setSelectedFile(null);
               if (fileInputRef.current) {
                    fileInputRef.current.value = '';
               }

          } catch (error) {
               console.error('Upload error:', error);
               setError('Failed to upload profile picture: ' + error.message);
          } finally {
               setUploading(false);
          }
     };

     if (loading) return <div className="p-4">Loading...</div>;
     if (!profile) return <div className="p-4">Profile not found</div>;

     const currentProfilePicture = getCurrentProfilePicture();

     return (
          <div className="p-6 max-w-4xl mx-auto">
               <h1 className="text-2xl font-bold mb-6">My Profile</h1>

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

               <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {/* Profile Picture Section */}
                         <div className="md:col-span-1 flex flex-col items-center">
                              <div className="relative">
                                   {currentProfilePicture ? (
                                        <img
                                             src={currentProfilePicture}
                                             alt="Profile"
                                             className="w-40 h-40 rounded-full object-cover border-4 border-white shadow"
                                             onError={(e) => {
                                                  console.error('Failed to load profile image:', e.target.src);
                                                  e.target.src = 'http://localhost:5000/fallback-profile.png';
                                             }}
                                        />
                                   ) : (
                                        <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-4xl font-bold border-4 border-white shadow">
                                             {profile?.name
                                                  ? profile.name.split(' ').map(n => n[0]).join('')
                                                  : '?'}
                                        </div>
                                   )}
                              </div>

                              <div className="mt-4 w-full max-w-xs">
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Change Profile Picture
                                   </label>
                                   <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
                                   />
                                   {selectedFile && (
                                        <button
                                             onClick={handleUpload}
                                             disabled={uploading}
                                             className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                             {uploading ? 'Uploading...' : 'Upload New Picture'}
                                        </button>
                                   )}
                              </div>
                         </div>

                         <div className="md:col-span-2">
                              <div className="grid grid-cols-1 gap-6">
                                   <div>
                                        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                                        <div className="space-y-4">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                       <p className="text-sm text-gray-500">Name</p>
                                                       <p className="font-medium text-lg">{profile.name || 'Not set'}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-500">Email</p>
                                                       <p className="font-medium text-lg">{profile.email}</p>
                                                  </div>
                                             </div>
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                       <p className="text-sm text-gray-500">Role</p>
                                                       <p className="font-medium text-lg capitalize">{profile.role}</p>
                                                  </div>
                                                  <div>
                                                       <p className="text-sm text-gray-500">Member Since</p>
                                                       <p className="font-medium text-lg">
                                                            {new Date(profile.createdAt).toLocaleDateString()}
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default ProfilePage;