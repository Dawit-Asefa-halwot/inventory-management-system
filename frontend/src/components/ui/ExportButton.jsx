import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from './button';

const ExportButton = ({ data, filename, className }) => {
     const handleExport = () => {
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, `${filename}.xlsx`);
     };

     return (
          <Button
               variant="outline"
               size="sm"
               icon={<Download size={16} />}
               onClick={handleExport}
               className={className}
          >
               Export to Excel
          </Button>
     );
};

export default ExportButton;
