import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Edit,
     Trash,
     Tag,
     Check
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../components/ui/table';
import Badge from '../../components/ui/badge';
// import { supabase } from '../lib/supabase';
import NewCategoryModal from '../../components/modals/NewCategoryModal';

const CategoriesPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [categories, setCategories] = useState([]);
     const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
     const [loading, setLoading] = useState(true);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasDescription: false
     });
     const [error, setError] = useState(null);
     const fetchCategories = async () => {
          try {
               setLoading(true);
               const response = await fetch('http://localhost:5000/api/categories');

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               setCategories(data);
               setError(null);
          } catch (error) {
               console.error('Fetch error:', error);
               setError(error.message);
          } finally {
               setLoading(false);
          }
     };


     useEffect(() => {
          fetchCategories();
     }, [sortField, sortOrder]);

     const filteredCategories = categories.filter((category) => {
          const matchesSearch =
               category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               category.description?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilters =
               !filterOptions.hasDescription ||
               (category.description && category.description.trim() !== '');

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

     const handleEditCategory = (category) => {
          // Implement your edit modal logic here
          console.log('Edit category:', category);
     };




     const handleDeleteCategory = async (id) => {
          try {
               const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                    method: 'DELETE'
               });

               if (!response.ok) {
                    throw new Error('Failed to delete category');
               }

               // Refresh the category list
               fetchCategories();
          } catch (error) {
               console.error('Delete error:', error);
               setError(error.message);
          }
     };





     <TableRow key={categories.id}>
          {/* ... other cells ... */}
          <TableCell className="text-right">
               <div className="flex justify-end gap-2">
                    <Button
                         variant="ghost"
                         size="sm"
                         icon={<Edit size={16} />}
                         onClick={() => handleEditCategory(categories)}
                    >
                         Edit
                    </Button>
                    <Button
                         variant="ghost"
                         size="sm"
                         icon={<Trash size={16} />}
                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
                         onClick={() => handleDeleteCategory(categories.id)}
                    >
                         Delete
                    </Button>
               </div>
          </TableCell>
     </TableRow>

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

                    <Button
                         variant="primary"
                         size="md"
                         icon={<Plus size={16} />}
                         onClick={() => setIsNewCategoryOpen(true)}
                    >
                         Add New Category
                    </Button>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search categories..."
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
                                   <label className="flex items-center gap-2">
                                        <input
                                             type="checkbox"
                                             checked={filterOptions.hasDescription}
                                             onChange={(e) =>
                                                  setFilterOptions({
                                                       ...filterOptions,
                                                       hasDescription: e.target.checked
                                                  })
                                             }
                                             className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">Has Description</span>
                                   </label>
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
                                   <TableHead>Category</TableHead>
                                   <TableHead>Description</TableHead>
                                   <TableHead>Created At</TableHead>
                                   <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                         </TableHeader>


                         <TableBody>
                              {loading ? (
                                   <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">
                                             Loading categories...
                                        </TableCell>
                                   </TableRow>
                              ) : filteredCategories.length > 0 ? (
                                   filteredCategories.map((categories) => ( // This is where category is defined
                                        <TableRow key={categories.id}>
                                             <TableCell>
                                                  <div className="flex items-center gap-3">
                                                       <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                            <Tag size={16} />
                                                       </div>
                                                       <span className="font-medium text-gray-900">
                                                            {categories.name}
                                                       </span>
                                                  </div>
                                             </TableCell>
                                             <TableCell>{categories.description}</TableCell>
                                             <TableCell>
                                                  {new Date(categories.created_at).toLocaleDateString('en-US', {
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
                                                            onClick={() => handleEditCategory(categories)}
                                                       >
                                                            Edit
                                                       </Button>
                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Trash size={16} />}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteCategory(categories.id)}
                                                       >
                                                            Delete
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                             <div className="flex flex-col items-center justify-center text-gray-500">
                                                  <Tag size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No categories found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               <NewCategoryModal
                    isOpen={isNewCategoryOpen}
                    onClose={() => setIsNewCategoryOpen(false)}
                    onSuccess={fetchCategories}
               />
          </div>
     );
};

export default CategoriesPage;
