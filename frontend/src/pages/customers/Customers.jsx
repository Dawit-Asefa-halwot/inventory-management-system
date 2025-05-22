import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Edit,
     Trash,
     Users,
     Mail,
     Phone,
     Check
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
// import { supabase } from '../lib/supabase';
import NewCustomerModal from '../../components/modals/NewCustomerModal';

const CustomersPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [customers, setCustomers] = useState([]);
     const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
     const [loading, setLoading] = useState(true);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });

     const fetchCustomers = async () => {
          try {
               setLoading(true);
               const response = await fetch(`http://localhost:5000/api/customers?sortBy=${sortField}&order=${sortOrder}`);

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
     }, [sortField, sortOrder]);

     const filteredCustomers = customers.filter(customer => {
          const matchesSearch =
               customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               customer.address?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilters =
               (!filterOptions.hasPhone || (customer.phone && customer.phone.trim() !== '')) &&
               (!filterOptions.hasAddress || (customer.address && customer.address.trim() !== ''));

          return matchesSearch && matchesFilters;
     });

     const handleSort = (field) => {
          if (sortField === field) {
               setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
               setSortField(field);
               setSortOrder('asc');
          }
          setShowSortMenu(false);
     };


     const handleEditCustomer = (categories) => {
          // Implement your edit modal logic here
          console.log('Edit category:', category);
     };


     // Add this in your CustomersPage component
     const handleDeleteCustomer = async (id) => {
          try {
               const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                    method: 'DELETE'
               });

               if (!response.ok) {
                    throw new Error('Failed to delete customer');
               }

               fetchCustomers();
          } catch (error) {
               console.error('Delete error:', error);
               setError(error.message);
          }
     };







     <TableRow key={customers.id}>
          {/* ... other cells ... */}
          <TableCell className="text-right">
               <div className="flex justify-end gap-2">
                    <Button
                         variant="ghost"
                         size="sm"
                         icon={<Edit size={16} />}
                         onClick={() => handleEditCustomer(customers)}
                    >
                         Edit
                    </Button>
                    <Button
                         variant="ghost"
                         size="sm"
                         icon={<Trash size={16} />}
                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
                         onClick={() => handleDeleteCustomer(customers.id)}
                    >
                         Delete
                    </Button>
               </div>
          </TableCell>
     </TableRow>



     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

                    <Button
                         variant="primary"
                         size="md"
                         icon={<Plus size={16} />}
                         onClick={() => setIsNewCustomerOpen(true)}
                    >
                         Add New Customer
                    </Button>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search customers..."
                              icon={<Search size={18} className="text-gray-400" />}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full"
                         />
                    </div>

                    <div className="relative">
                         <Button
                              variant="outline"
                              icon={<Filter size={16} />}
                              onClick={() => setShowFilterMenu(!showFilterMenu)}
                         >
                              Filter
                         </Button>

                         {showFilterMenu && (
                              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                                   <div className="space-y-4">
                                        <label className="flex items-center gap-2">
                                             <input
                                                  type="checkbox"
                                                  checked={filterOptions.hasPhone}
                                                  onChange={(e) => setFilterOptions({
                                                       ...filterOptions,
                                                       hasPhone: e.target.checked
                                                  })}
                                                  className="rounded border-gray-300"
                                             />
                                             <span className="text-sm">Has Phone Number</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                             <input
                                                  type="checkbox"
                                                  checked={filterOptions.hasAddress}
                                                  onChange={(e) => setFilterOptions({
                                                       ...filterOptions,
                                                       hasAddress: e.target.checked
                                                  })}
                                                  className="rounded border-gray-300"
                                             />
                                             <span className="text-sm">Has Address</span>
                                        </label>
                                   </div>
                              </div>
                         )}
                    </div>

                    <div className="relative">
                         <Button
                              variant="outline"
                              icon={<ArrowUpDown size={16} />}
                              onClick={() => setShowSortMenu(!showSortMenu)}
                         >
                              Sort
                         </Button>

                         {showSortMenu && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('name')}
                                   >
                                        <span>Name</span>
                                        {sortField === 'name' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('email')}
                                   >
                                        <span>Email</span>
                                        {sortField === 'email' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('created_at')}
                                   >
                                        <span>Created Date</span>
                                        {sortField === 'created_at' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                              </div>
                         )}
                    </div>
               </div>





               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Customer</TableHead>
                                   <TableHead>Contact</TableHead>
                                   <TableHead>Address</TableHead>
                                   <TableHead>Created At</TableHead>
                                   <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {loading ? (
                                   <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                             Loading customers...
                                        </TableCell>
                                   </TableRow>
                              ) : filteredCustomers.length > 0 ? (
                                   filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id}>
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
                                                            onClick={() => handleEditCustomer(customers)}
                                                       >
                                                            Edit
                                                       </Button>

                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Trash size={16} />}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteCustomer(customers.id)}
                                                       >
                                                            Delete
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                             <div className="flex flex-col items-center justify-center text-gray-500">
                                                  <Users size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No customers found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               <NewCustomerModal
                    isOpen={isNewCustomerOpen}
                    onClose={() => setIsNewCustomerOpen(false)}
                    onSuccess={fetchCustomers}
               />
          </div>
     );
};

export default CustomersPage;
