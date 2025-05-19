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

const AppRoutes = () => {
     return (
          <Routes>
               <Route path="/" element={<ProtectedLayout />}>
                    <Route index element={<Dashboard />} /> {/* default route */}
                    <Route path="products" element={<Products />} />
                    <Route path="category" element={<Category />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="suppliers" element={<Suppliers />} /> {/* fixed typo */}
                    <Route path="purchase" element={<Purchase />} />
                    <Route path="sales" element={<Sales />} />
                    <Route path="users" element={<Users />} />
                    <Route path="report" element={<Report />} />
                    {/* Add more routes here as you build */}
               </Route>
          </Routes>
     );
};

export default AppRoutes;
