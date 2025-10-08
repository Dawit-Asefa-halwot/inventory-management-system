import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import Badge from '../../../components/ui/badge';
import { Package } from 'lucide-react';

const ProductAlertCard = ({ products }) => {
     const getStatusBadge = (quantity) => {
          if (quantity === 0) {
               return <Badge variant="danger">Out of Stock</Badge>;
          } else if (quantity <= 5) {
               return <Badge variant="danger">Critical</Badge>;
          } else if (quantity <= 10) {
               return <Badge variant="warning">Low Stock</Badge>;
          } else {
               return <Badge variant="success">In Stock</Badge>;
          }
     };

     const getStatusColor = (quantity) => {
          if (quantity === 0) return 'text-red-600';
          if (quantity <= 5) return 'text-red-500';
          if (quantity <= 10) return 'text-yellow-500';
          return 'text-green-600';
     };

     return (
          <Card className="h-full">
               <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <Badge variant={products.length > 0 ? "danger" : "success"}>
                         {products.length} products
                    </Badge>
               </CardHeader>

               <CardContent>
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Product</TableHead>
                                   <TableHead>Category</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead>Quantity</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {products.length > 0 ? (
                                   products.map((product) => (
                                        <TableRow key={product.id}>
                                             <TableCell className="font-medium text-gray-900">
                                                  {product.name}
                                             </TableCell>
                                             <TableCell className="text-sm text-gray-500">
                                                  {product.category?.name || 'Uncategorized'}
                                             </TableCell>
                                             <TableCell>
                                                  {getStatusBadge(product.quantity)}
                                             </TableCell>
                                             <TableCell className={`font-medium ${getStatusColor(product.quantity)}`}>
                                                  {product.quantity}
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                             <div className="flex flex-col items-center">
                                                  <Package size={24} className="mb-2 text-gray-400" />
                                                  <p>No low stock products found</p>
                                                  <p className="text-sm">All products are well stocked</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </CardContent>
          </Card>
     );
};

export default ProductAlertCard;