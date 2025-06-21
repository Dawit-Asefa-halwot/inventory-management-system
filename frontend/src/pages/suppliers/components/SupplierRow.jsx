import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import { Mail, Phone, Edit, Trash } from 'lucide-react';

const SupplierRow = ({ supplier, onEdit, onDelete }) => {
     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              {supplier.name.charAt(0).toUpperCase()}
                         </div>
                         <span className="font-medium text-gray-900">{supplier.name}</span>
                    </div>
               </TableCell>

               <TableCell>
                    <div className="space-y-1">
                         <div className="flex items-center gap-2 text-sm">
                              <Mail size={14} className="text-gray-400" />
                              <span>{supplier.email}</span>
                         </div>
                         {supplier.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                   <Phone size={14} className="text-gray-400" />
                                   <span>{supplier.phone}</span>
                              </div>
                         )}
                    </div>
               </TableCell>

               <TableCell>
                    {supplier.address || '-'}
               </TableCell>

               <TableCell>
                    {new Date(supplier.created_at).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'short',
                         day: 'numeric'
                    })}
               </TableCell>

               <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => onEdit(supplier)}
                         >
                              Edit
                         </Button>

                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash size={16} />}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDelete(supplier.id)}
                         >
                              Delete
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
};

export default SupplierRow;