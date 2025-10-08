import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { Search, Filter, ArrowUpDown, Check } from 'lucide-react';

const UsersControls = ({
     searchTerm,
     onSearchChange,
     filterOptions,
     setFilterOptions,
     sortField,
     onSort
}) => {
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);

     return (
          <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                    <Input
                         placeholder="Search users..."
                         icon={<Search size={18} className="text-gray-400" />}
                         value={searchTerm}
                         onChange={(e) => onSearchChange(e.target.value)}
                         className="w-full"
                    />
               </div>

               <div className="relative">
                    <Button
                         variant="outline"
                         icon={<Filter size={16} />}
                         onClick={() => {
                              setShowFilterMenu(!showFilterMenu);
                              setShowSortMenu(false);
                         }}
                    >
                         Filter
                    </Button>

                    {showFilterMenu && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Role
                                        </label>
                                        <select
                                             value={filterOptions.role}
                                             onChange={(e) => setFilterOptions(prev => ({
                                                  ...prev,
                                                  role: e.target.value
                                             }))}
                                             className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                                        >
                                             <option value="">All Roles</option>
                                             <option value="admin">Admin</option>
                                             <option value="staff">Staff</option>
                                        </select>
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Status
                                        </label>
                                        <select
                                             value={filterOptions.status}
                                             onChange={(e) => setFilterOptions(prev => ({
                                                  ...prev,
                                                  status: e.target.value
                                             }))}
                                             className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                                        >
                                             <option value="">All Status</option>
                                             <option value="active">Active</option>
                                             <option value="inactive">Inactive</option>
                                             <option value="suspended">Suspended</option>
                                        </select>
                                   </div>
                              </div>
                         </div>
                    )}
               </div>

               <div className="relative">
                    <Button
                         variant="outline"
                         icon={<ArrowUpDown size={16} />}
                         onClick={() => {
                              setShowSortMenu(!showSortMenu);
                              setShowFilterMenu(false);
                         }}
                    >
                         Sort
                    </Button>

                    {showSortMenu && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                              {[
                                   { field: 'email', label: 'Email' },
                                   { field: 'role', label: 'Role' },
                                   { field: 'createdAt', label: 'Created Date' },
                                   { field: 'last_sign_in_at', label: 'Last Sign In' }
                              ].map(({ field, label }) => (
                                   <button
                                        key={field}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => onSort(field)}
                                   >
                                        <span>{label}</span>
                                        {sortField === field && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
};

export default UsersControls;