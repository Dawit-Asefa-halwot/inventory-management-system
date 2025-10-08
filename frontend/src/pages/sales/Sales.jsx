import React, { useState, useEffect } from 'react';
import { Plus, QrCode, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/button';
import NewSaleModal from '../../components/orders/NewSaleModal';
import QRScannerModal from '../../components/orders/QRScannerModal';
import OrderReceipt from '../../components/orders/OrderReceipt';
import SalesSearchFilterBar from './components/SalesSearchFilterBar';
import SalesTable from './components/SalesTable';
import PaginationControls from './components/PaginationControls';

const SalesPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [sales, setSales] = useState([]);
     const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
     const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
     const [isReceiptOpen, setIsReceiptOpen] = useState(false);
     const [selectedSale, setSelectedSale] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const [sortField, setSortField] = useState('created_at');
     const [sortOrder, setSortOrder] = useState('desc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          completed: false,
          pending: false,
          cancelled: false
     });

     // Pagination state
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(5);

     const fetchSales = async () => {
          try {
               setLoading(true);
               const response = await fetch('http://localhost:5000/api/sales-orders');

               if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch sales: ${response.status} - ${errorText}`);
               }

               const data = await response.json();
               console.log('Sales data:', data); // Log fetched data
               setSales(data);
          } catch (error) {
               console.error('Fetch error:', error);
               setError('Failed to load sales data');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchSales();
     }, [sortField, sortOrder]);

     const handleUpdateStatus = async (id, status) => {
          try {
               setError(null);
               const response = await fetch(`http://localhost:5000/api/sales-orders/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
               });

               if (!response.ok) throw new Error('Update failed');
               fetchSales();
          } catch (error) {
               console.error('Error updating sale status:', error);
               setError('Failed to update sale status. Please try again.');
          }
     };

     const handleViewReceipt = (sale) => {
          setSelectedSale(sale);
          setIsReceiptOpen(true);
     };

     // Filter and sort sales
     let filteredSales = sales.filter((sale) =>
          String(sale?.id ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(sale?.customer_id ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(sale?.status ?? '').toLowerCase().includes(searchTerm.toLowerCase())
     );

     // Apply status filters
     const statuses = [];
     if (filterOptions.completed) statuses.push('completed');
     if (filterOptions.pending) statuses.push('pending');
     if (filterOptions.cancelled) statuses.push('cancelled');

     if (statuses.length > 0) {
          filteredSales = filteredSales.filter(sale => statuses.includes(sale.status));
     }

     // Pagination calculations
     const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

     const handlePageChange = (newPage) => {
          if (newPage > 0 && newPage <= totalPages) {
               setCurrentPage(newPage);
          }
     };

     const handleSort = (field) => {
          if (sortField === field) {
               setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
               setSortField(field);
               setSortOrder('asc');
          }
          setShowSortMenu(false);
     };

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
                    <div className="flex gap-2">
                         {/* <Button
                              variant="outline"
                              size="md"
                              icon={<QrCode size={16} />}
                              onClick={() => setIsQRScannerOpen(true)}
                         >
                              Scan QR Code
                         </Button> */}
                         <Button
                              variant="primary"
                              size="md"
                              icon={<Plus size={16} />}
                              onClick={() => setIsNewSaleOpen(true)}
                         >
                              Create New Sale
                         </Button>
                    </div>
               </div>

               {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                         <AlertCircle size={16} />
                         {error}
                    </div>
               )}

               <SalesSearchFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showFilterMenu={showFilterMenu}
                    setShowFilterMenu={setShowFilterMenu}
                    showSortMenu={showSortMenu}
                    setShowSortMenu={setShowSortMenu}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortField={sortField}
                    handleSort={handleSort}
               />

               <SalesTable
                    sales={currentSales}
                    loading={loading}
                    onViewReceipt={handleViewReceipt}
                    onUpdateStatus={handleUpdateStatus}
               />

               {filteredSales.length > itemsPerPage && (
                    <PaginationControls
                         currentPage={currentPage}
                         totalPages={totalPages}
                         onPageChange={handlePageChange}
                    />
               )}

               <NewSaleModal
                    isOpen={isNewSaleOpen}
                    onClose={() => setIsNewSaleOpen(false)}
                    onSuccess={fetchSales}
               />



               {isReceiptOpen && selectedSale && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                         <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                              <OrderReceipt
                                   orderId={selectedSale.id}
                                   items={selectedSale.items?.map(item => ({
                                        name: item.product?.name || 'Unknown Product',
                                        quantity: item.quantity,
                                        price: item.price
                                   })) || []}
                                   totalAmount={selectedSale.total_amount}
                                   date={new Date(selectedSale.created_at)}
                                   type="sale"
                                   status={selectedSale.status}
                              />
                              <div className="mt-4 flex justify-end">
                                   <Button onClick={() => setIsReceiptOpen(false)}>Close</Button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default SalesPage;