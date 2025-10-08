import React, { useState, useEffect } from 'react';
import NewCustomerModal from '../../components/modals/NewCustomerModal';
import CustomersHeader from './components/CustomersHeader';
import CustomersControls from './components/CustomersControls';
import CustomersTable from './components/CustomersTable';
import { BASE_URL } from '../../config';

const CustomersPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [customers, setCustomers] = useState([]);
     const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
     const [editingCustomer, setEditingCustomer] = useState(null);
     const [loading, setLoading] = useState(true);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });
     const [error, setError] = useState(null);
     const [notification, setNotification] = useState(null);

     const showNotification = (msg) => {
          setNotification(msg);
          setTimeout(() => setNotification(null), 4000);
     };

     const fetchCustomers = async () => {
          try {
               setLoading(true);
               const response = await fetch(`${BASE_URL}/api/customers`);


               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               setCustomers(data);
          } catch (error) {
               console.error('Fetch error:', error);
               setError(error.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchCustomers();
     }, []);

     const handleDeleteCustomer = async (id) => {
          try {
               const response = await fetch(`${BASE_URL}/api/customers/${id}`, {
                    method: 'DELETE'
               });


               if (!response.ok) {
                    throw new Error('Failed to delete customer');
               }

               fetchCustomers();
               showNotification('Customer deleted successfully');
          } catch (error) {
               console.error('Delete error:', error);
               setError(error.message);
          }
     };

     const handleSort = (field) => {
          if (sortField === field) {
               setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
               setSortField(field);
               setSortOrder('asc');
          }
     };

     const filteredCustomers = customers
          .filter(customer => {
               const matchesSearch =
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()));

               const matchesFilters =
                    (!filterOptions.hasPhone || (customer.phone && customer.phone.trim() !== '')) &&
                    (!filterOptions.hasAddress || (customer.address && customer.address.trim() !== ''));

               return matchesSearch && matchesFilters;
          })
          .sort((a, b) => {
               if (sortField === 'name') {
                    return sortOrder === 'asc'
                         ? a.name.localeCompare(b.name)
                         : b.name.localeCompare(a.name);
               } else if (sortField === 'email') {
                    return sortOrder === 'asc'
                         ? a.email.localeCompare(b.email)
                         : b.email.localeCompare(a.email);
               } else {
                    return sortOrder === 'asc'
                         ? new Date(a.created_at) - new Date(b.created_at)
                         : new Date(b.created_at) - new Date(a.created_at);
               }
          });

     // Pass showNotification to NewCustomerModal for add/edit
     const handleModalSuccess = (action) => {
          fetchCustomers();
          showNotification(
               action === 'edit'
                    ? 'Customer updated successfully'
                    : 'Customer added successfully'
          );
     };

     return (
          <div className="space-y-6">
               <CustomersHeader
                    onAddNew={() => {
                         setEditingCustomer(null);
                         setIsNewCustomerOpen(true);
                    }}
               />

               <CustomersControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortField={sortField}
                    onSort={handleSort}
               />

               {/* Notification message */}
               {notification && (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-2 text-center font-medium transition-all duration-300">
                         {notification}
                    </div>
               )}

               <CustomersTable
                    loading={loading}
                    customers={filteredCustomers}
                    onEdit={(customer) => {
                         setEditingCustomer(customer);
                         setIsNewCustomerOpen(true);
                    }}
                    onDelete={handleDeleteCustomer}
               />

               <NewCustomerModal
                    isOpen={isNewCustomerOpen}
                    onClose={() => {
                         setIsNewCustomerOpen(false);
                         setEditingCustomer(null);
                    }}
                    onSuccess={() => handleModalSuccess(editingCustomer ? 'edit' : 'add')}
                    editingCustomer={editingCustomer}
               />
          </div>
     );
};

export default CustomersPage;