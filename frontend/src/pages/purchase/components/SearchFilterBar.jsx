import React from 'react';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import { Search, Filter, ArrowUpDown, Check } from 'lucide-react';

const SearchFilterBar = ({
     searchTerm,
     setSearchTerm,
     showFilterMenu,
     setShowFilterMenu,
     showSortMenu,
     setShowSortMenu,
     filterOptions,
     setFilterOptions,
     sortField,
     handleSort
}) => {
     return (
          <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                    <Input
                         placeholder="Search by PO number, supplier..."
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
     );
};

export default SearchFilterBar;