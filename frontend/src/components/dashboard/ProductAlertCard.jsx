import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge';

const ProductAlertCard = () => {
     const [products, setProducts] = useState([]);

     useEffect(() => {
          fetchLowStockProducts();
     }, []);

     const fetchLowStockProducts = async () => {
          // Dummy static data simulating low stock and out-of-stock products
          const data = [
               { id: 1, name: 'Wireless Mouse', quantity: 5 },
               { id: 2, name: 'USB-C Cable', quantity: 0 },
               { id: 3, name: 'Laptop Stand', quantity: 8 },
               { id: 4, name: 'Bluetooth Speaker', quantity: 2 },
          ];

          setProducts(
               data.map(product => ({
                    ...product,
                    status: product.quantity === 0 ? 'out-of-stock' : 'low-stock'
               }))
          );
     };

     return (
          <Card className="h-full">
               <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <Badge variant="danger">{products.length} products</Badge>
               </CardHeader>

               <CardContent>
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Product</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead>Quantity</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {products.length > 0 ? (
                                   products.map((product) => (
                                        <TableRow key={product.id}>
                                             <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                                             <TableCell>
                                                  <Badge
                                                       variant={product.status === 'out-of-stock' ? 'danger' : 'warning'}
                                                  >
                                                       {product.status}
                                                  </Badge>
                                             </TableCell>
                                             <TableCell className="font-medium">{product.quantity}</TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                                             No low stock products found
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
