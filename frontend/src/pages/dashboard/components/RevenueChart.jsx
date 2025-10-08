// components/RevenueChart.jsx
import React, { useEffect, useState } from 'react';
import {
     Chart as ChartJS,
     CategoryScale,
     LinearScale,
     BarElement,
     Title,
     Tooltip,
     Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { io } from "socket.io-client";

ChartJS.register(
     CategoryScale,
     LinearScale,
     BarElement,
     Title,
     Tooltip,
     Legend
);

const RevenueChart = () => {
     const [chartData, setChartData] = useState(null);

     const fetchData = async () => {
          try {
               const response = await fetch('http://localhost:5000/api/dashboard/revenue-data');
               const revenueData = await response.json();

               const labels = revenueData.map(item => {
                    const [year, month] = item.month.split('-');
                    return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
               });

               const domainColors = {
                    background: 'rgba(79, 70, 229, 0.5)',
                    border: 'rgb(79, 70, 229)',
                    hoverBackground: 'rgba(99, 102, 241, 0.8)',
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



     const domainOptions = {
          plugins: {
               legend: {
                    position: 'top',
                    labels: {
                         color: '#4f46e5',
                         font: {
                              weight: 'bold'
                         }
                    }
               },
               title: {
                    display: true,
                    text: 'Monthly Revenue',
                    color: '#1e293b',
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
                         color: '#64748b',
                         callback: value => `$${value.toLocaleString()}`
                    },
                    grid: {
                         color: 'rgba(100, 116, 139, 0.1)'
                    }
               },
               x: {
                    ticks: {
                         color: '#64748b',
                    },
                    grid: {
                         color: 'rgba(100, 116, 139, 0.1)'
                    }
               }
          }
     };

     return chartData ? (
          <div className="h-[350px]">
               <Bar
                    data={chartData}
                    options={{
                         ...domainOptions,
                         maintainAspectRatio: false,
                    }}
               />
          </div>
     ) : (
          <div className="h-[350px] flex items-center justify-center">
               <div className="animate-pulse flex space-x-4">
                    {/* Loading animation */}
               </div>
          </div>
     );
};

export default RevenueChart;