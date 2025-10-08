import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SettingsPage from '../pages/settings/SettingsPage';
import { useAuth } from '../auth/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import Products from '../pages/products/Products';
import Category from '../pages/category/Category';
import Customers from '../pages/customers/Customers';
import Suppliers from '../pages/suppliers/Suppliers';
import Purchase from '../pages/purchase/Purchase';
import Sales from '../pages/sales/Sales';
import Users from '../pages/users/Users';
import Report from '../pages/report/Report';
import ProfilePage from '../pages/profile/ProfilePage';
import { ThemeProvider } from '../components/ThemeProvider';

const AppRoutes = () => {
     const { isAuthenticated, user } = useAuth();

     return (
          <ThemeProvider>
               <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />}>
                         <Route path="/" element={<Dashboard />} />
                         <Route path="/settings" element={<SettingsPage />} />
                         <Route path="/products" element={<Products />} />


                         {/* Admin-only routes */}
                         {user?.role === 'admin' && (
                              <>
                                   <Route path="/categories" element={<Category />} />
                                   <Route path="/suppliers" element={<Suppliers />} />
                                   <Route path="/purchases" element={<Purchase />} />
                                   <Route path="/users" element={<Users />} />
                                   <Route path="/reports" element={<Report />} />
                              </>
                         )}


                         {/* Staff-only routes */}
                         <Route path="/customers" element={<Customers />} />
                         <Route path="/sales" element={<Sales />} />
                         <Route path="/profile" element={<ProfilePage />} />

                         <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
               </Routes>
          </ThemeProvider>
     );
};

export default AppRoutes;