import React, { useEffect, useState } from 'react';
import {
     Chart as ChartJS,
     CategoryScale,
     LinearScale,
     BarElement,
     Title,
     Tooltip,
     Legend,
     ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
     CategoryScale,
     LinearScale,
     BarElement,
     Title,
     Tooltip,
     Legend,
     ArcElement
);

export const RevenueChart = () => {
     const [chartData, setChartData] = useState(null);

     useEffect(() => {
          fetchRevenueData();
     }, []);

     const fetchRevenueData = async () => {
          // Dummy static data for demo
          const salesData = [
               { created_at: '2024-01-15', total_amount: 500 },
               { created_at: '2024-02-20', total_amount: 300 },
               { created_at: '2024-02-25', total_amount: 200 },
               { created_at: '2024-03-10', total_amount: 700 },
               { created_at: '2024-04-05', total_amount: 400 },
          ];

          const monthlyRevenue = salesData.reduce((acc, sale) => {
               const month = format(new Date(sale.created_at), 'MMMM');
               acc[month] = (acc[month] || 0) + sale.total_amount;
               return acc;
          }, {});

          setChartData({
               labels: Object.keys(monthlyRevenue),
               datasets: [{
                    label: 'Revenue',
                    data: Object.values(monthlyRevenue),
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
               }]
          });
     };

     if (!chartData) return null;

     return (
          <Bar
               data={chartData}
               options={{
                    responsive: true,
                    plugins: {
                         legend: { position: 'top' },
                         title: { display: true, text: 'Monthly Revenue' },
                    },
               }}
          />
     );
};

export const ProductDistributionChart = () => {
     const [chartData, setChartData] = useState(null);

     useEffect(() => {
          fetchProductData();
     }, []);

     const fetchProductData = async () => {
          // Dummy static data for demo
          const products = [
               { category: { name: 'Electronics' } },
               { category: { name: 'Books' } },
               { category: { name: 'Books' } },
               { category: { name: 'Clothing' } },
               { category: { name: 'Electronics' } },
               { category: null },  // Uncategorized
          ];

          const categoryDistribution = products.reduce((acc, product) => {
               const category = product.category?.name || 'Uncategorized';
               acc[category] = (acc[category] || 0) + 1;
               return acc;
          }, {});

          setChartData({
               labels: Object.keys(categoryDistribution),
               datasets: [{
                    data: Object.values(categoryDistribution),
                    backgroundColor: [
                         'rgba(99, 102, 241, 0.8)',
                         'rgba(16, 185, 129, 0.8)',
                         'rgba(245, 158, 11, 0.8)',
                         'rgba(239, 68, 68, 0.8)',
                         'rgba(139, 92, 246, 0.8)',
                    ],
               }]
          });
     };

     if (!chartData) return null;

     return (
          <Pie
               data={chartData}
               options={{
                    responsive: true,
                    plugins: {
                         legend: { position: 'right' },
                         title: { display: true, text: 'Product Distribution' },
                    },
               }}
          />
     );
};
