import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import UserRow from './UserRow';
import { UserCircle } from 'lucide-react';

const UsersTable = ({ loading, users, onEdit, onDelete }) => {
     const renderTableHeader = () => (
          <TableHeader>
               <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Sign In</TableHead>
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
                                   <TableCell colSpan={6} className="text-center py-8">
                                        Loading users...
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     if (users.length === 0) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <UserCircle size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No users found</h3>
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
                         {users.map((user) => (
                              <UserRow
                                   key={user.id}
                                   user={user}
                                   onEdit={onEdit}
                                   onDelete={onDelete}
                              />
                         ))}
                    </TableBody>
               </Table>
          </div>
     );
};

export default UsersTable;