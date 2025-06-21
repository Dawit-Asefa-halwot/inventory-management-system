import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import SupplierRow from './SupplierRow';
import { Truck, Loader2 } from 'lucide-react';

const SuppliersTable = ({ loading, suppliers, onEdit, onDelete }) => {
     const renderTableHeader = () => (
          <TableHeader>
               <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
               </TableRow>
          </TableHeader>
     );

     if (loading) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                             <Loader2 className="h-4 w-4 animate-spin" />
                                             <span>Loading suppliers...</span>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     if (suppliers.length === 0) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <Truck size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No suppliers found</h3>
                                             <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <Table>
                    {renderTableHeader()}
                    <TableBody>
                         {suppliers.map((supplier) => (
                              <SupplierRow
                                   key={supplier.id}
                                   supplier={supplier}
                                   onEdit={onEdit}
                                   onDelete={onDelete}
                              />
                         ))}
                    </TableBody>
               </Table>
          </div>
     );
};

export default SuppliersTable;