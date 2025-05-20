import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import { ThemeProvider } from '../components/ThemeProvider';

const AppRoutes = () => {
     return (
          <ThemeProvider>

               <Routes>


                    <Route element={

                         <ProtectedLayout />

                    }>
                         <Route path="/" element={<Dashboard />} />
                         <Route path="/products" element={<Products />} />
                         <Route path="/categories" element={<Category />} />
                         <Route path="/customers" element={<Customers />} />
                         <Route path="/suppliers" element={<Suppliers />} />
                         <Route path="/purchases" element={<Purchase />} />
                         <Route path="/sales" element={<Sales />} />
                         <Route path="/users" element={<Users />} />
                         <Route path="/reports" element={<Report />} />
                         <Route path="/profile" element={<div className="p-4">Profile Page (Coming Soon)</div>} />

                         {/* Redirect any unknown routes to the dashboard */}

                    </Route>
               </Routes>


          </ThemeProvider>
     );
}

export default AppRoutes;