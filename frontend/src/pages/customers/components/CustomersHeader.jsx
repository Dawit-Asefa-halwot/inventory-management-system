import React from 'react';
import Button from '../../../components/ui/button';
import { Plus } from 'lucide-react';

const CustomersHeader = ({ onAddNew }) => (
     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <Button
               variant="primary"
               size="md"
               icon={<Plus size={16} />}
               onClick={onAddNew}
          >
               Add New Customer
          </Button>
     </div>
);

export default CustomersHeader;