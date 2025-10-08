import React, { useState, useEffect } from 'react';
import NewSupplierModal from '../../components/modals/NewSupplierModal';
import SuppliersHeader from './components/SuppliersHeader';
import SuppliersControls from './components/SuppliersControls';
import SuppliersTable from './components/SuppliersTable';
import { BASE_URL } from '../../config';

const SuppliersPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [suppliers, setSuppliers] = useState([]);
     const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
     const [loading, setLoading] = useState(true);
     const [editingSupplier, setEditingSupplier] = useState(null);
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

     const fetchSuppliers = async () => {
          try {
               setLoading(true);
               const response = await fetch(`${BASE_URL}/api/suppliers`);

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               setSuppliers(data);
          } catch (error) {
               console.error('Fetch error:', error);
               setError(error.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchSuppliers();
     }, []);

     const handleDeleteSupplier = async (id) => {
          try {
               const response = await fetch(`${BASE_URL}/api/suppliers/${id}`, {
                    method: 'DELETE'
               });


               if (!response.ok) {
                    throw new Error('Failed to delete supplier');
               }

               fetchSuppliers();
               showNotification('Supplier deleted successfully');
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

     const filteredSuppliers = suppliers
          .filter(supplier => {
               const matchesSearch =
                    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (supplier.phone && supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (supplier.address && supplier.address.toLowerCase().includes(searchTerm.toLowerCase()));

               const matchesFilters =
                    (!filterOptions.hasPhone || (supplier.phone && supplier.phone.trim() !== '')) &&
                    (!filterOptions.hasAddress || (supplier.address && supplier.address.trim() !== ''));

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

     // Pass showNotification to NewSupplierModal for add/edit
     const handleModalSuccess = (action) => {
          fetchSuppliers();
          showNotification(
               action === 'edit'
                    ? 'Supplier updated successfully'
                    : 'Supplier added successfully'
          );
     };

     return (
          <div className="space-y-6">
               <SuppliersHeader
                    onAddNew={() => {
                         setEditingSupplier(null);
                         setIsNewSupplierOpen(true);
                    }}
               />

               <SuppliersControls
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

               <SuppliersTable
                    loading={loading}
                    suppliers={filteredSuppliers}
                    onEdit={(supplier) => {
                         setEditingSupplier(supplier);
                         setIsNewSupplierOpen(true);
                    }}
                    onDelete={handleDeleteSupplier}
               />

               <NewSupplierModal
                    isOpen={isNewSupplierOpen}
                    onClose={() => {
                         setIsNewSupplierOpen(false);
                         setEditingSupplier(null);
                    }}
                    onSuccess={() => handleModalSuccess(editingSupplier ? 'edit' : 'add')}
                    editingSupplier={editingSupplier}
               />
          </div>
     );
};

export default SuppliersPage;