import React, { useState } from 'react';
import ReportCategoryCard from './components/ReportCategoryCard';
import ReportTable from './components/ReportTable';
import ReportGenerator from './components/ReportGenerator';

const ReportsPage = () => {
     const [currentReport, setCurrentReport] = useState(null);
     const [loading, setLoading] = useState(null);

     const reports = [
          {
               title: 'Sales Reports',
               description: 'View detailed sales analytics and trends',
               icon: 'TrendingUp',
               color: 'indigo',
               options: [
                    { name: 'Daily Sales', id: 'daily-sales' },
                    { name: 'Monthly Revenue', id: 'monthly-revenue' },
                    { name: 'Top Selling Products', id: 'top-products' }
               ]
          },
          {
               title: 'Inventory Reports',
               description: 'Monitor stock levels and product movement',
               icon: 'Package',
               color: 'blue',
               options: [
                    { name: 'Stock Status', id: 'inventory' },
                    { name: 'Low Stock Items', id: 'low-stock' },
                    { name: 'Inventory Valuation', id: 'inventory-value' }
               ]
          },
          {
               title: 'Purchase Reports',
               description: 'Track purchase orders and supplier performance',
               icon: 'ShoppingCart',
               color: 'orange',
               options: [
                    { name: 'Purchase Orders', id: 'purchase-orders' },
                    { name: 'Supplier Analysis', id: 'supplier-analysis' },
                    { name: 'Cost Analysis', id: 'cost-analysis' }
               ]
          }
     ];

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report, index) => (
                         <ReportCategoryCard
                              key={index}
                              report={report}
                              loading={loading}
                              onGenerate={(reportId) => ReportGenerator.generateReport(
                                   reportId,
                                   setCurrentReport,
                                   setLoading
                              )}
                         />
                    ))}
               </div>

               {currentReport && (
                    <ReportTable
                         currentReport={currentReport}
                         onDownload={() => ReportGenerator.downloadPDF(currentReport)}
                    />
               )}
          </div>
     );
};

export default ReportsPage;