import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import ProductRow from './ProductRow';
import { Package } from 'lucide-react';
import Button from '../../../components/ui/button';
import Badge from '../../../components/ui/badge';

const ProductsTable = ({
     loading,
     products,
     totalProducts,
     currentPage,
     totalPages,
     indexOfFirstProduct,
     indexOfLastProduct,
     onEdit,
     onDelete,
     onPageChange
}) => {
     // components/ProductsTable.jsx - Update the getSellingPrice function
     const getSellingPrice = (product) => {
          // Use selling_price if available, otherwise calculate 10% higher than purchase price
          if (product.selling_price) {
               return parseFloat(product.selling_price);
          }
          const purchasePrice = parseFloat(product.purchase_price || product.price);
          return purchasePrice * 1.1;
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

     const renderTableHeader = () => (
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
     );

     if (loading) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={7} className="text-center py-8">
                                        Loading products...
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     if (products.length === 0) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <Package size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No products found</h3>
                                             <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               <Table>
                    {renderTableHeader()}
                    <TableBody>
                         {products.map((product) => (
                              <ProductRow
                                   key={product.id}
                                   product={product}
                                   getSellingPrice={getSellingPrice}
                                   getStatusBadge={getStatusBadge}
                                   onEdit={onEdit}
                                   onDelete={onDelete}
                              />
                         ))}
                    </TableBody>
               </Table>

               {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                         <div className="text-sm text-gray-500">
                              Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                              <span className="font-medium">
                                   {Math.min(indexOfLastProduct, totalProducts)}
                              </span>{' '}
                              of <span className="font-medium">{totalProducts}</span> products
                         </div>

                         <div className="flex gap-1">
                              <Button
                                   variant="outline"
                                   size="sm"
                                   disabled={currentPage === 1}
                                   onClick={() => onPageChange(currentPage - 1)}
                              >
                                   Previous
                              </Button>

                              <Button
                                   variant="outline"
                                   size="sm"
                                   disabled={currentPage === totalPages}
                                   onClick={() => onPageChange(currentPage + 1)}
                              >
                                   Next
                              </Button>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default ProductsTable;