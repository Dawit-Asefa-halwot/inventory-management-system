import React, { useState, useEffect } from 'react';
import NewProductModal from '../../components/modals/NewProductModal';
import ProductsHeader from './components/ProductsHeader';
import ProductsControls from './components/ProductsControls';
import ProductsTable from './components/ProductsTable';
// Add AlertCircle to the import from lucide-react
import {
     // ... other imports
     AlertCircle // Add this
} from 'lucide-react';

const ProductsPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [currentPage, setCurrentPage] = useState(1);
     const [isNewProductOpen, setIsNewProductOpen] = useState(false);
     const [editingProduct, setEditingProduct] = useState(null);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [filterOptions, setFilterOptions] = useState({
          lowStock: false,
          hasImage: false,
          hasCategory: false
     });

     const productsPerPage = 10;

     const fetchProducts = async () => {
          try {
               setLoading(true);
               const response = await fetch('http://localhost:5000/api/products');

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch products');
               }

               const data = await response.json();
               setProducts(data);
          } catch (err) {
               setError(err.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchProducts();
     }, []);

     const handleDelete = async (productId) => {
          try {
               setError(null);
               const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                    method: 'DELETE'
               });

               if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete product');
               }

               fetchProducts();
          } catch (err) {
               console.error('Error deleting product:', err);
               setError('Failed to delete product. Please try again.');
          }
     };

     const filteredProducts = products
          .filter(product => {
               const matchesSearch =
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

               const matchesFilters =
                    (!filterOptions.lowStock || product.quantity <= 10) &&
                    (!filterOptions.hasImage || product.image_url) &&
                    (!filterOptions.hasCategory || product.category_id);

               return matchesSearch && matchesFilters;
          })
          .sort((a, b) => {
               let aValue, bValue;

               if (sortField === 'name') {
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
               } else if (sortField === 'price') {
                    aValue = a.price;
                    bValue = b.price;
               } else if (sortField === 'quantity') {
                    aValue = a.quantity;
                    bValue = b.quantity;
               } else {
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
               }

               return sortOrder === 'asc'
                    ? aValue < bValue ? -1 : 1
                    : aValue > bValue ? -1 : 1;
          });

     const indexOfLastProduct = currentPage * productsPerPage;
     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
     const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

     return (
          <div className="space-y-6">
               <ProductsHeader
                    onAddNew={() => {
                         setEditingProduct(null);
                         setIsNewProductOpen(true);
                    }}
               />

               {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                         <AlertCircle size={16} />
                         {error}
                    </div>
               )}

               <ProductsControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortField={sortField}
                    onSort={(field) => {
                         if (sortField === field) {
                              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                         } else {
                              setSortField(field);
                              setSortOrder('asc');
                         }
                    }}
               />

               <ProductsTable
                    loading={loading}
                    products={currentProducts}
                    totalProducts={filteredProducts.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    indexOfFirstProduct={indexOfFirstProduct}
                    indexOfLastProduct={indexOfLastProduct}
                    onEdit={(product) => {
                         setEditingProduct(product);
                         setIsNewProductOpen(true);
                    }}
                    onDelete={handleDelete}
                    onPageChange={setCurrentPage}
               />

               <NewProductModal
                    isOpen={isNewProductOpen}
                    onClose={() => {
                         setIsNewProductOpen(false);
                         setEditingProduct(null);
                    }}
                    onSuccess={fetchProducts}
                    editingProduct={editingProduct}
               />
          </div>
     );
};

export default ProductsPage;