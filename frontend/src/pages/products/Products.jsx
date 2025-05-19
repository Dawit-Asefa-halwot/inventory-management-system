import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Edit,
     Trash,
     Package,
     AlertCircle,
     Check
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge';
// import { supabase } from '../lib/supabase';
import NewProductModal from '../../components/modals/NewProductModal';

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
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          lowStock: false,
          hasImage: false,
          hasCategory: false
     });

     const productsPerPage = 10;

     const fetchProducts = async () => {
          try {
               setLoading(true);
               setError(null);

               let query = supabase
                    .from('products')
                    .select(`
          *,
          category:categories(name)
        `)
                    .order(sortField, { ascending: sortOrder === 'asc' });

               const { data, error: fetchError } = await query;

               if (fetchError) throw fetchError;
               setProducts(data || []);
          } catch (err) {
               console.error('Error fetching products:', err);
               setError('Failed to load products. Please try again.');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchProducts();
     }, [sortField, sortOrder]);

     const handleDelete = async (productId) => {
          try {
               setError(null);
               const { error: deleteError } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productId);

               if (deleteError) throw deleteError;
               await fetchProducts();
          } catch (err) {
               console.error('Error deleting product:', err);
               setError('Failed to delete product. Please try again.');
          }
     };

     const filteredProducts = products.filter(product => {
          const matchesSearch =
               product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesFilters =
               (!filterOptions.lowStock || product.quantity <= 10) &&
               (!filterOptions.hasImage || product.image_url) &&
               (!filterOptions.hasCategory || product.category_id);

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

     const indexOfLastProduct = currentPage * productsPerPage;
     const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
     const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
     const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

     const getSellingPrice = (purchasePrice) => {
          return purchasePrice * 1.5;
     };

     const getStatusBadge = (quantity) => {
          if (quantity === 0) {
               return <Badge variant="danger">Out of Stock</Badge>;
          } else if (quantity <= 10) {
               return <Badge variant="warning">Low Stock</Badge>;
          } else {
               return <Badge variant="success">In Stock</Badge>;
          }
     };

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>

                    <Button
                         variant="primary"
                         size="md"
                         icon={<Plus size={16} />}
                         onClick={() => {
                              setEditingProduct(null);
                              setIsNewProductOpen(true);
                         }}
                    >
                         Add New Product
                    </Button>
               </div>

               {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                         <AlertCircle size={16} />
                         {error}
                    </div>
               )}

               {/* Filters and Search */}
               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search products..."
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
                                   {['name', 'price', 'quantity', 'created_at'].map((field) => (
                                        <button
                                             key={field}
                                             className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                             onClick={() => handleSort(field)}
                                        >
                                             <span>{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}</span>
                                             {sortField === field && (
                                                  <Check size={16} className="text-indigo-600" />
                                             )}
                                        </button>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

               {/* Products Table */}
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Product</TableHead>
                                   <TableHead>Category</TableHead>
                                   <TableHead>Purchase Price</TableHead>
                                   <TableHead>Selling Price</TableHead>
                                   <TableHead>Quantity</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {loading ? (
                                   <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                             Loading products...
                                        </TableCell>
                                   </TableRow>
                              ) : currentProducts.length > 0 ? (
                                   currentProducts.map((product) => (
                                        <TableRow key={product.id}>
                                             <TableCell>
                                                  <div className="flex items-center gap-3">
                                                       <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                            {product.image_url ? (
                                                                 <img
                                                                      src={product.image_url}
                                                                      alt={product.name}
                                                                      className="w-full h-full object-cover"
                                                                 />
                                                            ) : (
                                                                 <Package size={20} className="text-gray-400" />
                                                            )}
                                                       </div>
                                                       <div>
                                                            <div className="font-medium text-gray-900">{product.name}</div>
                                                            {product.description && (
                                                                 <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                                      {product.description}
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>
                                             </TableCell>

                                             <TableCell>
                                                  {product.category?.name || 'Uncategorized'}
                                             </TableCell>

                                             <TableCell className="font-medium">
                                                  ${product.price.toFixed(2)}
                                             </TableCell>

                                             <TableCell className="font-medium text-indigo-600">
                                                  ${getSellingPrice(product.price).toFixed(2)}
                                             </TableCell>

                                             <TableCell>{product.quantity}</TableCell>

                                             <TableCell>
                                                  {getStatusBadge(product.quantity)}
                                             </TableCell>

                                             <TableCell className="text-right">
                                                  <div className="flex justify-end gap-2">
                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Edit size={16} />}
                                                            onClick={() => {
                                                                 setEditingProduct(product);
                                                                 setIsNewProductOpen(true);
                                                            }}
                                                       >
                                                            Edit
                                                       </Button>

                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Trash size={16} />}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDelete(product.id)}
                                                       >
                                                            Delete
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                             <div className="flex flex-col items-center justify-center text-gray-500">
                                                  <Package size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No products found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>

                    {totalPages > 1 && (
                         <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                              <div className="text-sm text-gray-500">
                                   Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                                   <span className="font-medium">
                                        {Math.min(indexOfLastProduct, filteredProducts.length)}
                                   </span>{' '}
                                   of <span className="font-medium">{filteredProducts.length}</span> products
                              </div>

                              <div className="flex gap-1">
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                   >
                                        Previous
                                   </Button>

                                   <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                   >
                                        Next
                                   </Button>
                              </div>
                         </div>
                    )}
               </div>

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
