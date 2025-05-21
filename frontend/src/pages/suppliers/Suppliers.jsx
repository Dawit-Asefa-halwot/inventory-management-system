import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Edit,
     Trash,
     Truck,
     Mail,
     Phone,
     Check
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

import NewSupplierModal from '../../components/modals/NewSupplierModal';

const SuppliersPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [suppliers, setSuppliers] = useState([]);
     const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
     const [loading, setLoading] = useState(true);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });

     const fetchSuppliers = async () => {
          try {
               let query = supabase
                    .from('suppliers')
                    .select('*')
                    .order(sortField, { ascending: sortOrder === 'asc' });

               const { data } = await query;

               if (data) {
                    setSuppliers(data);
               }
          } catch (error) {
               console.error('Error fetching suppliers:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchSuppliers();
     }, [sortField, sortOrder]);

     const filteredSuppliers = suppliers.filter(supplier => {
          const matchesSearch =
               supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               supplier.address?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilters =
               (!filterOptions.hasPhone || (supplier.phone && supplier.phone.trim() !== '')) &&
               (!filterOptions.hasAddress || (supplier.address && supplier.address.trim() !== ''));

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

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>

                    <Button
                         variant="primary"
                         size="md"
                         icon={<Plus size={16} />}
                         onClick={() => setIsNewSupplierOpen(true)}
                    >
                         Add New Supplier
                    </Button>
               </div>

               {/* Filters and Search */}
               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search suppliers..."
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

               {/* Suppliers Table */}
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Supplier</TableHead>
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
                                             Loading suppliers...
                                        </TableCell>
                                   </TableRow>
                              ) : filteredSuppliers.length > 0 ? (
                                   filteredSuppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
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

                                             <TableCell>{supplier.address}</TableCell>

                                             <TableCell>
                                                  {new Date(supplier.created_at).toLocaleDateString('en-US', {
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
                                                       >
                                                            Edit
                                                       </Button>

                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Trash size={16} />}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                                  <Truck size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No suppliers found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               <NewSupplierModal
                    isOpen={isNewSupplierOpen}
                    onClose={() => setIsNewSupplierOpen(false)}
                    onSuccess={fetchSuppliers}
               />
          </div>
     );
};

export default SuppliersPage;
