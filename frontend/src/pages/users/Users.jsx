import React, { useState, useEffect } from 'react';
import NewUserModal from '../../components/modals/NewUserModal';
import UsersHeader from './components/UsersHeader';
import UsersControls from './components/UsersControls';
import UsersTable from './components/UsersTable';

const UsersPage = () => {
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');
     const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
     const [editingUser, setEditingUser] = useState(null);
     const [sortField, setSortField] = useState('createdAt');
     const [sortOrder, setSortOrder] = useState('desc');
     const [filterOptions, setFilterOptions] = useState({
          role: '',
          status: ''
     });
     const [error, setError] = useState(null);

     const fetchUsers = async () => {
          try {
               setLoading(true);
               const response = await fetch('http://localhost:5000/api/users');

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               setUsers(data);
          } catch (error) {
               console.error('Fetch error:', error);
               setError(error.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchUsers();
     }, []);

     const handleSort = (field) => {
          if (sortField === field) {
               setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
               setSortField(field);
               setSortOrder('asc');
          }
     };

     const handleDelete = async (id) => {
          try {
               const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'DELETE'
               });

               if (!response.ok) {
                    throw new Error('Failed to delete user');
               }

               fetchUsers();
          } catch (error) {
               console.error('Delete error:', error);
               setError(error.message);
          }
     };

     const filteredUsers = users
          .filter(user => {
               const matchesSearch =
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()));

               const matchesRole = !filterOptions.role || user.role === filterOptions.role;
               const matchesStatus = !filterOptions.status ||
                    (filterOptions.status === 'active' && user.lastSignInAt) ||
                    (filterOptions.status === 'inactive' && !user.lastSignInAt);

               return matchesSearch && matchesRole && matchesStatus;
          })
          .sort((a, b) => {
               let aValue, bValue;

               if (sortField === 'email') {
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
               } else if (sortField === 'role') {
                    aValue = a.role || '';
                    bValue = b.role || '';
               } else if (sortField === 'createdAt') {
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
               } else if (sortField === 'last_sign_in_at') {
                    aValue = a.lastSignInAt ? new Date(a.lastSignInAt) : new Date(0);
                    bValue = b.lastSignInAt ? new Date(b.lastSignInAt) : new Date(0);
               }

               return sortOrder === 'asc'
                    ? aValue < bValue ? -1 : 1
                    : aValue > bValue ? -1 : 1;
          });

     return (
          <div className="space-y-6">
               <UsersHeader
                    onAddNew={() => {
                         setEditingUser(null);
                         setIsNewUserModalOpen(true);
                    }}
               />

               <UsersControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortField={sortField}
                    onSort={handleSort}
               />

               <UsersTable
                    loading={loading}
                    users={filteredUsers}
                    onEdit={(user) => {
                         setEditingUser(user);
                         setIsNewUserModalOpen(true);
                    }}
                    onDelete={handleDelete}
               />

               <NewUserModal
                    isOpen={isNewUserModalOpen}
                    onClose={() => {
                         setIsNewUserModalOpen(false);
                         setEditingUser(null);
                    }}
                    onSuccess={fetchUsers}
                    editingUser={editingUser}
               />
          </div>
     );
};

export default UsersPage;