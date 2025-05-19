import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
     LayoutDashboard,
     Package,
     Users,
     Tag,
     Truck,
     ShoppingCart,
     Receipt,
     UserCircle,
     BarChart3,
     Menu,
     X,
     LogOut
} from 'lucide-react';

const SidebarItem = ({ title, icon, path, isActive }) => {
     return (
          <Link
               to={path}
               className={`
        flex items-center gap-x-3 px-3 py-2 rounded-md text-sm
        transition-colors duration-200
        ${isActive
                         ? 'bg-indigo-50 text-indigo-700 font-medium'
                         : 'text-gray-600 hover:bg-gray-100'
                    }
      `}
          >
               <span className="flex-shrink-0">{icon}</span>
               <span>{title}</span>
          </Link>
     );
};

const Sidebar = () => {
     const location = useLocation();
     const [isMobileOpen, setIsMobileOpen] = useState(false);

     const sidebarItems = [
          { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
          { title: 'Products', icon: <Package size={18} />, path: '/products' },
          { title: 'Category', icon: <Tag size={18} />, path: '/category' },
          { title: 'Customers', icon: <Users size={18} />, path: '/customers' },
          { title: 'Suppliers', icon: <Truck size={18} />, path: '/suppliers' },
          { title: 'Purchase', icon: <ShoppingCart size={18} />, path: '/purchase' },
          { title: 'Sales', icon: <Receipt size={18} />, path: '/sales' },
          { title: 'Users', icon: <UserCircle size={18} />, path: '/users' },
          { title: 'Report', icon: <BarChart3 size={18} />, path: '/report' },
     ];

     const toggleMobileSidebar = () => {
          setIsMobileOpen(!isMobileOpen);
     };

     return (
          <>
               {/* Mobile Toggle Button */}
               <button
                    className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
                    onClick={toggleMobileSidebar}
               >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
               </button>

               {/* Sidebar Container */}
               <aside
                    className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex md:flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
               >
                    {/* Logo */}
                    <div className="p-4 border-b border-gray-200">
                         <div className="flex items-center gap-2">
                              <Package size={24} className="text-indigo-600" />
                              <h1 className="text-xl font-bold text-gray-900">Inventory System</h1>
                         </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                         {sidebarItems.map(item => (
                              <SidebarItem
                                   key={item.path}
                                   title={item.title}
                                   icon={item.icon}
                                   path={item.path}
                                   isActive={location.pathname === item.path}
                              />
                         ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                         <Link
                              to="/profile"
                              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                         >
                              <UserCircle size={18} />
                              <span>My Profile</span>
                         </Link>
                         <button
                              className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                         >
                              <LogOut size={18} />
                              <span>Logout</span>
                         </button>
                    </div>
               </aside>
          </>
     );
};

export default Sidebar;
