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
import { io } from "socket.io-client";

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

     const fetchData = async () => {
          try {
               const response = await fetch('http://localhost:5000/api/dashboard/revenue-data');
               const revenueData = await response.json();

               const labels = revenueData.map(item => {
                    const [year, month] = item.month.split('-');
                    return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
               });

               // Using domain colors from your StatCard component
               const domainColors = {
                    background: 'rgba(79, 70, 229, 0.5)',  // indigo-500 with 50% opacity
                    border: 'rgb(79, 70, 229)',             // indigo-600
                    hoverBackground: 'rgba(99, 102, 241, 0.8)', // indigo-600 with 80% opacity
               };

               const data = {
                    labels,
                    datasets: [
                         {
                              label: 'Revenue ($)',
                              data: revenueData.map(item => item.revenue),
                              backgroundColor: domainColors.background,
                              borderColor: domainColors.border,
                              borderWidth: 1,
                              hoverBackgroundColor: domainColors.hoverBackground,
                         },
                    ],
               };

               setChartData(data);
          } catch (error) {
               console.error('Error fetching revenue data:', error);
          }
     };

     useEffect(() => {
          fetchData();

          const socket = io('http://localhost:5000');
          socket.on('dashboard-update', () => {
               fetchData();
          });

          return () => socket.disconnect();
     }, []);

     // Domain color options for consistency
     const domainOptions = {
          plugins: {
               legend: {
                    position: 'top',
                    labels: {
                         color: '#4f46e5', // indigo-600
                         font: {
                              weight: 'bold'
                         }
                    }
               },
               title: {
                    display: true,
                    text: 'Monthly Revenue',
                    color: '#1e293b', // slate-800
                    font: {
                         size: 16,
                         weight: 'bold'
                    }
               },
          },
          scales: {
               y: {
                    beginAtZero: true,
                    ticks: {
                         color: '#64748b', // slate-500
                         callback: value => `$${value.toLocaleString()}`
                    },
                    grid: {
                         color: 'rgba(100, 116, 139, 0.1)' // slate-500 with 10% opacity
                    }
               },
               x: {
                    ticks: {
                         color: '#64748b', // slate-500
                    },
                    grid: {
                         color: 'rgba(100, 116, 139, 0.1)' // slate-500 with 10% opacity
                    }
               }
          }
     };

     return chartData ? (
          <div className="h-[350px]"> {/* Increased height container */}
               <Bar
                    data={chartData}
                    options={{
                         ...domainOptions, // Keep your existing options
                         maintainAspectRatio: false, // Crucial for custom sizing
                    }}
               />
          </div>
     ) : (
          <div className="h-[350px] flex items-center justify-center"> {/* Match height */}
               <div className="animate-pulse flex space-x-4">
                    {/* ... existing loading animation ... */}
               </div>
          </div>
     );
};

export const ProductDistributionChart = () => {
     const [chartData, setChartData] = useState(null);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await fetch('http://localhost:5000/api/products');
                    const products = await response.json();

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
               } catch (error) {
                    console.error('Error fetching product data:', error);
               }
          };

          fetchData();
          const interval = setInterval(fetchData, 10000);
          return () => clearInterval(interval);
     }, []);

     return chartData ? (
          <div className="h-[350px]"> {/* Same height as revenue chart */}
               <Pie
                    data={chartData}
                    options={{
                         responsive: true,
                         maintainAspectRatio: false, // Add this
                         plugins: {
                              legend: { position: 'right' },
                              title: { display: true, text: 'Product Distribution' },
                         },
                    }}
               />
          </div>
     ) : (
          <div className="h-[350px] flex items-center justify-center">
               <p>Loading product distribution...</p>
          </div>
     );
};