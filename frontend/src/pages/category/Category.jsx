import React, { useState, useEffect } from 'react';
import NewCategoryModal from '../../components/modals/NewCategoryModal';
import CategoriesHeader from "./components/CategoriesHeader.jsx";

import CategoriesControls from './components/CategoriesControls';
import CategoriesTable from './components/CategoriesTable';
import { BASE_URL } from '../../config';

const CategoriesPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [categories, setCategories] = useState([]);
     const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
     const [loading, setLoading] = useState(true);
     const [editingCategory, setEditingCategory] = useState(null);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [filterOptions, setFilterOptions] = useState({ hasDescription: false });
     const [error, setError] = useState(null);

     const fetchCategories = async () => {
          try {
               setLoading(true);
               const response = await fetch(`${BASE_URL}/api/categories`);

               if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
     }, []);

     const handleDeleteCategory = async (id) => {
          try {
               const response = await fetch(`${BASE_URL}/api/categories/${id}`, { method: 'DELETE' });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete category');
               }
               fetchCategories();
          } catch (error) {
               console.error('Delete error:', error);
               setError(error.message);
               alert(error.message); // optional: replace with toast or UI error
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

     const filteredCategories = categories
          .filter(category => {
               const matchesSearch =
                    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    category.description?.toLowerCase().includes(searchTerm.toLowerCase());
               const matchesFilters =
                    !filterOptions.hasDescription ||
                    (category.description && category.description.trim() !== '');
               return matchesSearch && matchesFilters;
          })
          .sort((a, b) => {
               if (sortField === 'name') {
                    return sortOrder === 'asc'
                         ? a.name.localeCompare(b.name)
                         : b.name.localeCompare(a.name);
               } else {
                    return sortOrder === 'asc'
                         ? new Date(a.created_at) - new Date(b.created_at)
                         : new Date(b.created_at) - new Date(a.created_at);
               }
          });

     return (
          <div className="space-y-6">
               <CategoriesHeader
                    onAddNew={() => {
                         setEditingCategory(null);
                         setIsNewCategoryOpen(true);
                    }}
               />

               <CategoriesControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortField={sortField}
                    onSort={handleSort}
               />

               <CategoriesTable
                    loading={loading}
                    categories={filteredCategories}
                    onEdit={(category) => {
                         setEditingCategory(category);
                         setIsNewCategoryOpen(true);
                    }}
                    onDelete={handleDeleteCategory}
               />

               <NewCategoryModal
                    isOpen={isNewCategoryOpen}
                    onClose={() => {
                         setIsNewCategoryOpen(false);
                         setEditingCategory(null);
                    }}
                    onSuccess={fetchCategories}
                    editingCategory={editingCategory}
               />
          </div>
     );
};

export default CategoriesPage;