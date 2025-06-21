import React from 'react';
import Button from '../../../components/ui/button';
import { Plus } from 'lucide-react';

const ProductsHeader = ({ onAddNew }) => (
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Button
               variant="primary"
               size="md"
               icon={<Plus size={16} />}
               onClick={onAddNew}
          >
               Add New Product
          </Button>
     </div>
);

export default ProductsHeader;