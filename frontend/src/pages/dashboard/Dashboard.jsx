import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Truck, DollarSign } from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import RecentActivityCard from '../../components/dashboard/RecentActivityCard';
import ProductAlertCard from '../../components/dashboard/ProductAlertCard';

import { RevenueChart, ProductDistributionChart } from '../../components/dashboard/DashboardCharts';
import { io } from 'socket.io-client';

const DashboardPage = () => {
     const [stats, setStats] = useState({
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalSuppliers: 0,
          lowStockItems: 0
     });
     const [activities, setActivities] = useState([]);
     const [lowStockProducts, setLowStockProducts] = useState([]);

     const fetchData = async () => {
          try {
               const [statsRes, activitiesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/dashboard/stats'),
                    fetch('http://localhost:5000/api/dashboard/activities')
               ]);

               const statsData = await statsRes.json();
               const activitiesData = await activitiesRes.json();

               setStats(prev => ({
                    ...prev,
                    ...statsData,
                    lowStockItems: statsData.lowStockItems.length
               }));

               setLowStockProducts(statsData.lowStockItems);
               setActivities(activitiesData);
          } catch (error) {
               console.error('Error fetching data:', error);
          }
     };

     useEffect(() => {
          // Initial fetch
          fetchData();

          // Set up polling
          const interval = setInterval(fetchData, 10000);

          // Set up WebSocket
          const socket = io('http://localhost:5000');
          socket.on('dashboard-update', ({ type }) => {
               if (type === 'sale-created' || type === 'purchase-created') {
                    fetchRevenueData();
               }
               if (type === 'product-updated') {
                    fetchProductData();
               }
               setLowStockProducts(data.stats.lowStockItems);
               setActivities(data.activities);
          });

          return () => {
               clearInterval(interval);
               socket.disconnect();
          };
     }, []);

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                         title="Total Products"
                         value={stats.totalProducts.toString()}
                         icon={<Package size={24} />}
                    />
                    <StatCard
                         title="Total Sales"
                         value={stats.totalSales.toString()}
                         icon={<ShoppingBag size={24} />}
                    />
                    <StatCard
                         title="Customers"
                         value={stats.totalCustomers.toString()}
                         icon={<Users size={24} />}
                    />
                    <StatCard
                         title="Suppliers"
                         value={stats.totalSuppliers.toString()}
                         icon={<Truck size={24} />}
                    />
                    <StatCard
                         title="Revenue (Monthly)"
                         value={`$${(stats.totalRevenue / 12).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                         })}`}
                         icon={<DollarSign size={24} />}
                    />

                    <StatCard
                         title="Low Stock Items"
                         value={stats.lowStockItems.toString()}
                         icon={<Package size={24} />}
                    />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                         <RevenueChart />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                         <ProductDistributionChart />
                    </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductAlertCard products={lowStockProducts} />
                    <RecentActivityCard activities={activities} />
               </div>
          </div>
     );
};

export default DashboardPage;