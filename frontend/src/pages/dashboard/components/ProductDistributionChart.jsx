// components/ProductDistributionChart.jsx
import React, { useEffect, useState } from 'react';
import {
     Chart as ChartJS,
     ArcElement,
     Tooltip,
     Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
     ArcElement,
     Tooltip,
     Legend
);

const ProductDistributionChart = () => {
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
          <div className="h-[350px]">
               <Pie
                    data={chartData}
                    options={{
                         responsive: true,
                         maintainAspectRatio: false,
                         plugins: {
                              legend: { position: 'right' },
                              title: {
                                   display: true,
                                   text: 'Product Distribution',
                                   color: '#1e293b',
                                   font: {
                                        size: 16,
                                        weight: 'bold'
                                   }
                              },
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

export default ProductDistributionChart;