import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import Badge from '../../../components/ui/badge';
import { UserCircle, Mail, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { BASE_URL } from '../../../config';

const UserRow = ({ user, onEdit, onDelete, onStatusChange }) => {
     const getStatusBadge = (status) => {
          switch (status) {
               case 'active':
                    return <Badge variant="success">Active</Badge>;
               case 'inactive':
                    return <Badge variant="warning">Inactive</Badge>;
               case 'suspended':
                    return <Badge variant="danger">Suspended</Badge>;
               default:
                    return <Badge variant="secondary">Unknown</Badge>;
          }
     };

     const handleStatusChange = async (newStatus) => {
          try {
               const response = await fetch(`${BASE_URL}/api/auth/users/${user.id}/status`, {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ status: newStatus })
               });

               if (response.ok) {
                    onStatusChange(user.id, newStatus);
               }
          } catch (error) {
               console.error('Error updating user status:', error);
          }
     };

     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserCircle size={20} className="text-gray-400" />
                         </div>
                         <div>
                              <div className="font-medium text-gray-900">{user.email}</div>
                              {user.name && (
                                   <div className="text-sm text-gray-500">{user.name}</div>
                              )}
                         </div>
                    </div>
               </TableCell>

               <TableCell>
                    <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                         {user.role || 'User'}
                    </Badge>
               </TableCell>

               <TableCell>
                    {getStatusBadge(user.status)}
               </TableCell>

               <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'short',
                         day: 'numeric'
                    })}
               </TableCell>

               <TableCell>
                    {user.lastSignInAt
                         ? new Date(user.lastSignInAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                         })
                         : 'Never'}
               </TableCell>

               <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <div className="relative">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   icon={<MoreHorizontal size={16} />}
                                   onClick={() => {
                                        const dropdown = document.getElementById(`status-dropdown-${user.id}`);
                                        dropdown.classList.toggle('hidden');
                                   }}
                              >
                                   Status
                              </Button>
                              <div id={`status-dropdown-${user.id}`} className="hidden absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                   <button
                                        onClick={() => handleStatusChange('active')}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                   >
                                        Set Active
                                   </button>
                                   <button
                                        onClick={() => handleStatusChange('inactive')}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                   >
                                        Set Inactive
                                   </button>
                                   <button
                                        onClick={() => handleStatusChange('suspended')}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                                   >
                                        Suspend
                                   </button>
                              </div>
                         </div>
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