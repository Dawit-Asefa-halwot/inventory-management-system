// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     // Function to fetch user profile
     const fetchUserProfile = async () => {
          try {
               const response = await fetch('http://localhost:5000/api/auth/profile', {
                    credentials: 'include',
               });

               if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    return userData;
               }
          } catch (error) {
               console.error('Auth check error:', error);
          }
          return null;
     };

     useEffect(() => {
          fetchUserProfile().finally(() => setLoading(false));
     }, []);

     const login = async (email, password) => {
          const response = await fetch('http://localhost:5000/api/auth/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
               credentials: 'include',
          });

          if (response.ok) {
               const userData = await response.json();
               setUser(userData);
               navigate('/');
               return true;
          }
          return false;
     };

     const logout = async () => {
          await fetch('http://localhost:5000/api/auth/logout', {
               method: 'POST',
               credentials: 'include',
          });
          setUser(null);
          navigate('/login');
     };

     // Enhanced function to update profile picture
     const updateProfilePicture = async (newProfilePicture) => {
          try {
               // First update the local state immediately for better UX
               setUser(prevUser => ({
                    ...prevUser,
                    profilePicture: newProfilePicture
               }));

               // Then refetch the complete user profile to ensure consistency
               const updatedUser = await fetchUserProfile();
               if (updatedUser) {
                    setUser(updatedUser);
               }

               return true;
          } catch (error) {
               console.error('Error updating profile picture in context:', error);
               return false;
          }
     };

     const value = {
          user,
          loading,
          login,
          logout,
          updateProfilePicture,
          refreshUserProfile: fetchUserProfile, // Add this for manual refresh
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
          isStaff: user?.role === 'staff',
     };

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);