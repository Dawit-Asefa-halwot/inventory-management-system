import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import { Mail, Phone, Edit, Trash } from 'lucide-react';

const CustomerRow = ({ customer, onEdit, onDelete }) => {
     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              {customer.name.charAt(0).toUpperCase()}
                         </div>
                         <span className="font-medium text-gray-900">{customer.name}</span>
                    </div>
               </TableCell>

               <TableCell>
                    <div className="space-y-1">
                         <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-gray-400" />
                              <span>{customer.email}</span>
                         </div>
                         {customer.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                   <Phone size={14} className="text-gray-400" />
                                   <span>{customer.phone}</span>
                              </div>
                         )}
                    </div>
               </TableCell>

               <TableCell>{customer.address}</TableCell>

               <TableCell>
                    {new Date(customer.created_at).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                    })}
               </TableCell>

               <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => onEdit(customer)}
                         >
                              Edit
                         </Button>

                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash size={16} />}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDelete(customer.id)}
                         >
                              Delete
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
};

export default CustomerRow;