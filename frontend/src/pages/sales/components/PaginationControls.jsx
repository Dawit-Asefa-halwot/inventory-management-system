import React from 'react';
import Button from '../../../components/ui/button';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
     return (
          <div className="flex justify-between items-center mt-4">
               <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
               >
                    Previous
               </Button>
               <span className="text-sm">Page {currentPage} of {totalPages}</span>
               <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
               >
                    Next
               </Button>
          </div>
     );
};

export default PaginationControls;