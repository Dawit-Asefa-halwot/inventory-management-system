import React from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow
} from '../../../components/ui/table';
import CategoryRow from './CategoryRow';
import { Tag } from 'lucide-react';

const CategoriesTable = ({ loading, categories, onEdit, onDelete }) => {
     // Always render the table headers
     const renderTableHeader = () => (
          <TableHeader>
               <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
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
                                   <TableCell colSpan={4} className="text-center py-8">
                                        Loading categories...
                                   </TableCell>
                              </TableRow>
                         </TableBody>
                    </Table>
               </div>
          );
     }

     if (categories.length === 0) {
          return (
               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         {renderTableHeader()}
                         <TableBody>
                              <TableRow>
                                   <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                             <Tag size={28} className="mb-2" />
                                             <h3 className="text-lg font-medium">No categories found</h3>
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
                         {categories.map((category) => (
                              <CategoryRow
                                   key={category.id}
                                   category={category}
                                   onEdit={onEdit}
                                   onDelete={onDelete}
                              />
                         ))}
                    </TableBody>
               </Table>
          </div>
     );
};

export default CategoriesTable;