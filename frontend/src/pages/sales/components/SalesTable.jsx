import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import { Eye, Check, Receipt } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../../utils/dateUtils';

const SalesTable = ({
     sales,
     loading,
     onViewReceipt,
     onUpdateStatus
}) => {
     return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <Table>
                    <TableHeader>
                         <TableRow>
                              <TableHead>Sale ID</TableHead>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Total Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                    </TableHeader>

                    <TableBody>
                         {loading ? (
                              <TableRow>
                                   <TableCell colSpan={6} className="text-center py-8">
                                        Loading...
                                   </TableCell>
                              </TableRow>
                         ) : sales.length > 0 ? (
                              sales.map((sale) => (
                                   <TableRow key={sale.id}>
                                        <TableCell className="font-medium text-gray-900">{sale.id}</TableCell>
                                        <TableCell>{formatDate(sale.created_at)}</TableCell>
                                        <TableCell>Customer #{sale.customer_id}</TableCell>
                                        <TableCell className="font-medium">
                                             ${Number(sale.total_amount).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                             <StatusBadge status={sale.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <div className="flex justify-end gap-2">
                                                  {sale.status === 'pending' && (
                                                       <>
                                                            <Button
                                                                 variant="ghost"
                                                                 size="sm"
                                                                 icon={<Check size={16} />}
                                                                 onClick={() => onUpdateStatus(sale.id, 'completed')}
                                                            >
                                                                 Complete
                                                            </Button>
                                                            <Button
                                                                 variant="ghost"
                                                                 size="sm"
                                                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                 onClick={() => onUpdateStatus(sale.id, 'cancelled')}
                                                            >
                                                                 Cancel
                                                            </Button>
                                                       </>
                                                  )}
                                                  <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       icon={<Eye size={16} />}
                                                       onClick={() => onViewReceipt(sale)}
                                                  >
                                                       View
                                                  </Button>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              ))
                         ) : (
                              <TableRow>
                                   <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <Receipt size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No sales found</h3>
                                             <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         )}
                    </TableBody>
               </Table>
          </div>
     );
};

export default SalesTable;