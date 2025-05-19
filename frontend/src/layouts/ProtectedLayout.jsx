import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../components/header/header';

const ProtectedLayout = () => {
     return (
          <div className="flex min-h-screen bg-gray-100 text-gray-900">
               <Sidebar />

               <div className="flex-1">
                    <Header />
                    <main className="p-6">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
};

export default ProtectedLayout;
