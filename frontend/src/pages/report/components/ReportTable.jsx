import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Button from '../../../components/ui/button';
import { Download } from 'lucide-react';

const ReportTable = ({ currentReport, onDownload }) => {
     const getStatusBadge = (status) => {
          if (status === 'completed') {
               return 'bg-green-100 text-green-800';
          } else if (status === 'pending') {
               return 'bg-yellow-100 text-yellow-800';
          } else if (status === 'cancelled') {
               return 'bg-red-100 text-red-800';
          }
          return 'bg-gray-100 text-gray-800';
     };

     const renderTableCell = (reportType, item, column) => {
          switch (column) {
               case 'Date':
                    return item.date
                         ? new Date(item.date).toLocaleDateString()
                         : item.created_at
                              ? new Date(item.created_at).toLocaleDateString()
                              : '';
               case 'Amount':
               case 'Price':
               case 'Total Revenue':
               case 'Total Value':
               case 'Total Spent':
               case 'Total Cost':
                    return `$${Number(item[column.toLowerCase().replace(' ', '_')]).toFixed(2)}`;
               case 'Status':
                    return (
                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                              {item.status}
                         </span>
                    );
               case 'Category':
                    return item.category_name || 'Uncategorized';
               case 'Customer':
                    return item.customer?.name || item.customer_name || 'Unknown';
               case 'Supplier':
                    return item.supplier_name || 'Unknown';
               case 'Product Name':
                    return item.name || item.product_name;
               default:
                    return item[column.toLowerCase().replace(' ', '_')] || '';
          }
     };

     return (
          <Card className="mt-6">
               <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{currentReport.title}</CardTitle>
                    <Button
                         variant="outline"
                         size="sm"
                         icon={<Download size={16} />}
                         onClick={onDownload}
                    >
                         Download PDF
                    </Button>
               </CardHeader>
               <CardContent>
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                   <tr>
                                        {currentReport.columns.map((column, index) => (
                                             <th
                                                  key={index}
                                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                             >
                                                  {column}
                                             </th>
                                        ))}
                                   </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                   {currentReport.data.map((item, index) => (
                                        <tr key={index}>
                                             {currentReport.columns.map((column, colIndex) => (
                                                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                                       {renderTableCell(currentReport.title, item, column)}
                                                  </td>
                                             ))}
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </CardContent>
          </Card>
     );
};

export default ReportTable;