import React from 'react';
import { TableCell, TableRow } from '../../../components/ui/table';
import Button from '../../../components/ui/button';
import { Package, Edit, Trash } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const ProductRow = ({ product, getSellingPrice, getStatusBadge, onEdit, onDelete }) => {
     return (
          <TableRow>
               <TableCell>
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                              {product.image_url ? (
                                   <img
                                        src={getImageUrl(product.image_url)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                             e.target.style.display = 'none';
                                             e.target.nextSibling.style.display = 'flex';
                                        }}
                                   />
                              ) : null}
                              <div className="w-full h-full flex items-center justify-center" style={{ display: product.image_url ? 'none' : 'flex' }}>
                                   <Package size={20} className="text-gray-400" />
                              </div>
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
                    ${parseFloat(product.purchase_price || product.price).toFixed(2)}
               </TableCell>

               <TableCell className="font-medium text-indigo-600">
                    ${getSellingPrice(product).toFixed(2)}
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
                              onClick={() => onEdit(product)}
                         >
                              Edit
                         </Button>

                         <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash size={16} />}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDelete(product.id)}
                         >
                              Delete
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
};

export default ProductRow;