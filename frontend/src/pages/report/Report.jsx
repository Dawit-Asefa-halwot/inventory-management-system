import React from 'react';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/button';
import ExportButton from '../../components/ui/ExportButton';
import { BarChart3, TrendingUp, Package, Users, ShoppingCart, DollarSign, Calendar, PieChart, Activity } from 'lucide-react';

const ReportsPage = () => {
     const reports = [
          {
               title: 'Sales Overview',
               description: 'View detailed sales metrics and trends',
               icon: <BarChart3 className="w-6 h-6" />,
               onClick: () => console.log('Sales Overview clicked')
          },
          {
               title: 'Revenue Analysis',
               description: 'Track revenue growth and patterns',
               icon: <TrendingUp className="w-6 h-6" />,
               onClick: () => console.log('Revenue Analysis clicked')
          },
          {
               title: 'Inventory Status',
               description: 'Monitor stock levels and movements',
               icon: <Package className="w-6 h-6" />,
               onClick: () => console.log('Inventory Status clicked')
          },
          {
               title: 'Customer Analytics',
               description: 'Analyze customer behavior and demographics',
               icon: <Users className="w-6 h-6" />,
               onClick: () => console.log('Customer Analytics clicked')
          },
          {
               title: 'Purchase Orders',
               description: 'Track purchase order statistics',
               icon: <ShoppingCart className="w-6 h-6" />,
               onClick: () => console.log('Purchase Orders clicked')
          },
          {
               title: 'Financial Summary',
               description: 'View financial performance metrics',
               icon: <DollarSign className="w-6 h-6" />,
               onClick: () => console.log('Financial Summary clicked')
          },
          {
               title: 'Seasonal Trends',
               description: 'Analyze seasonal patterns and trends',
               icon: <Calendar className="w-6 h-6" />,
               onClick: () => console.log('Seasonal Trends clicked')
          },
          {
               title: 'Category Performance',
               description: 'Evaluate product category metrics',
               icon: <PieChart className="w-6 h-6" />,
               onClick: () => console.log('Category Performance clicked')
          },
          {
               title: 'System Activity',
               description: 'Monitor system usage and events',
               icon: <Activity className="w-6 h-6" />,
               onClick: () => console.log('System Activity clicked')
          }
     ];

     return (
          <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <ExportButton />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report, index) => (
                         <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={report.onClick}>
                              <div className="flex items-center gap-4">
                                   <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        {report.icon}
                                   </div>
                                   <div>
                                        <h3 className="font-semibold text-lg">{report.title}</h3>
                                        <p className="text-muted-foreground text-sm">{report.description}</p>
                                   </div>
                              </div>
                              <Button variant="ghost" className="w-full mt-4">
                                   View Report
                              </Button>
                         </Card>
                    ))}
               </div>
          </div>
     );
};

export default ReportsPage;