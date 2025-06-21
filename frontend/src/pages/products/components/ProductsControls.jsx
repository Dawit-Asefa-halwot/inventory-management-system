import React, { useState } from 'react';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { Search, Filter, ArrowUpDown, Check } from 'lucide-react';

const ProductsControls = ({
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
                         placeholder="Search products..."
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
                                             checked={filterOptions.lowStock}
                                             onChange={(e) => setFilterOptions({
                                                  ...filterOptions,
                                                  lowStock: e.target.checked
                                             })}
                                             className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Low Stock Items</span>
                                   </label>
                                   <label className="flex items-center gap-2">
                                        <input
                                             type="checkbox"
                                             checked={filterOptions.hasImage}
                                             onChange={(e) => setFilterOptions({
                                                  ...filterOptions,
                                                  hasImage: e.target.checked
                                             })}
                                             className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Has Image</span>
                                   </label>
                                   <label className="flex items-center gap-2">
                                        <input
                                             type="checkbox"
                                             checked={filterOptions.hasCategory}
                                             onChange={(e) => setFilterOptions({
                                                  ...filterOptions,
                                                  hasCategory: e.target.checked
                                             })}
                                             className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Has Category</span>
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
                              {[
                                   { field: 'name', label: 'Name' },
                                   { field: 'price', label: 'Price' },
                                   { field: 'quantity', label: 'Quantity' },
                                   { field: 'created_at', label: 'Created Date' }
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

export default ProductsControls;