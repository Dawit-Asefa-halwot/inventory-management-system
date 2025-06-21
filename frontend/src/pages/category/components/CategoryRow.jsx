import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import { Tag, Edit, Trash } from 'lucide-react';

const CategoryRow = ({ category, onEdit, onDelete }) => {
     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Tag size={16} />
                         </div>
                         <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
               </TableCell>
               <TableCell>{category.description}</TableCell>
               <TableCell>
                    {new Date(category.created_at).toLocaleDateString('en-US', {
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
                              onClick={() => onEdit(category)}
                         >
                              Edit
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash size={16} />}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDelete(category.id)}
                         >
                              Delete
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
};

export default CategoryRow;