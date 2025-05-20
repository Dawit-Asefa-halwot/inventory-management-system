import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Truck, DollarSign } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivityCard from '../../components/dashboard/RecentActivityCard';
import ProductAlertCard from '../../components/dashboard/ProductAlertCard';
import { RevenueChart, ProductDistributionChart } from '../../components/dashboard/DashboardCharts';

// Mock data for stats
const mockStats = {
     totalProducts: 120,
     totalSales: 350,
     totalRevenue: 45230.75,
     totalCustomers: 80,
     totalSuppliers: 12,
     lowStockItems: 5
};

// Mock product data for ProductAlertCard (example)
const mockProducts = [
     { id: '1', name: 'Product A', quantity: 3, status: 'low-stock' },
     { id: '2', name: 'Product B', quantity: 0, status: 'out-of-stock' },
     { id: '3', name: 'Product C', quantity: 7, status: 'low-stock' },
];

const DashboardPage = () => {
     const [stats, setStats] = useState(mockStats);

     // Optional: simulate data loading with useEffect if you want
     // useEffect(() => {
     //     setTimeout(() => setStats(mockStats), 1000);
     // }, []);

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
                         value={`$${(stats.totalRevenue / 12).toFixed(2)}`}
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
                         <RevenueChart /> {/* Make sure RevenueChart uses mock data internally */}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                         <ProductDistributionChart /> {/* Same here */}
                    </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductAlertCard products={mockProducts} />
                    <RecentActivityCard /> {/* You may want to also pass mock data here or handle internally */}
               </div>
          </div>
     );
};

export default DashboardPage;
