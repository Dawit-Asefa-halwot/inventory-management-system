import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import Badge from '../../../components/ui/badge';
import { UserCircle, Mail, Edit, Trash } from 'lucide-react';

const UserRow = ({ user, onEdit, onDelete }) => {
     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserCircle size={20} className="text-gray-400" />
                         </div>
                         <div>
                              <div className="font-medium text-gray-900">{user.email}</div>
                         </div>
                    </div>
               </TableCell>

               <TableCell>
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                         {user.role || 'User'}
                    </Badge>
               </TableCell>

               <TableCell>
                    <Badge variant={user.lastSignInAt ? 'success' : 'warning'}>
                         {user.lastSignInAt ? 'Active' : 'Inactive'}
                    </Badge>
               </TableCell>

               <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                    })}
               </TableCell>

               <TableCell>
                    {user.lastSignInAt
                         ? new Date(user.lastSignInAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                         })
                         : 'Never'}
               </TableCell>

               <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => onEdit(user)}
                         >
                              Edit
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash size={16} />}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDelete(user.id)}
                         >
                              Delete
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
};

export default UserRow;