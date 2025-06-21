import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { Search, Filter, ArrowUpDown, Check } from 'lucide-react';

const SuppliersControls = ({
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
                         placeholder="Search suppliers..."
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
                                             className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                                             className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                         onClick={() => {
                              setShowSortMenu(!showSortMenu);
                              setShowFilterMenu(false);
                         }}
                    >
                         Sort
                    </Button>

                    {showSortMenu && (
                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                              <button
                                   className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                   onClick={() => onSort('name')}
                              >
                                   <span>Name</span>
                                   {sortField === 'name' && <Check size={16} className="text-indigo-600" />}
                              </button>
                              <button
                                   className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                   onClick={() => onSort('email')}
                              >
                                   <span>Email</span>
                                   {sortField === 'email' && <Check size={16} className="text-indigo-600" />}
                              </button>
                              <button
                                   className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                   onClick={() => onSort('created_at')}
                              >
                                   <span>Created Date</span>
                                   {sortField === 'created_at' && <Check size={16} className="text-indigo-600" />}
                              </button>
                         </div>
                    )}
               </div>
          </div>
     );
};

export default SuppliersControls;