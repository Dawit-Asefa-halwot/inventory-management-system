import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import CustomerRow from './CustomerRow';
import { Users } from 'lucide-react';

const CustomersTable = ({ loading, customers, onEdit, onDelete }) => {
     const renderTableHeader = () => (
          <TableHeader>
               <TableRow>
                    <TableHead>Customer</TableHead>
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
                                        Loading customers...
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     if (customers.length === 0) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <Users size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No customers found</h3>
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
                         {customers.map((customer) => (
                              <CustomerRow
                                   key={customer.id}
                                   customer={customer}
                                   onEdit={onEdit}
                                   onDelete={onDelete}
                              />
                         ))}
                    </TableBody>
               </Table>
          </div>
     );
};

export default CustomersTable;