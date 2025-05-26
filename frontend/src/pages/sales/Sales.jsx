import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Eye,
     Receipt,
     Check,
     Clock,
     QrCode,
     AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge';
// import { supabase } from '../../lib/supabase';
import NewSaleModal from '../../components/orders/NewSaleModal';
import QRScannerModal from '../../components/orders/QRScannerModal';
import OrderReceipt from '../../components/orders/OrderReceipt';

const SalesPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [sales, setSales] = useState([]);
     const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
     const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
     const [isReceiptOpen, setIsReceiptOpen] = useState(false);
     const [selectedSale, setSelectedSale] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });
     const fetchSales = async () => {
          try {
               setLoading(true);
               const response = await fetch('http://localhost:5000/api/sales-orders');
               const data = await response.json();
               setSales(data);
          } catch (error) {
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
               const { error: updateError } = await supabase
                    .from('sales_orders')
                    .update({ status })
                    .eq('id', id);

               if (updateError) throw updateError;

               if (status === 'completed') {
                    const sale = sales.find(s => s.id === id);
                    if (sale?.items) {
                         for (const item of sale.items) {
                              const { error: productError } = await supabase
                                   .from('products')
                                   .update({
                                        quantity: item.product.quantity - item.quantity
                                   })
                                   .eq('id', item.product.id);

                              if (productError) throw productError;
                         }
                    }
               }

               await fetchSales();
          } catch (error) {
               console.error('Error updating sale status:', error);
               setError('Failed to update sale status. Please try again.');
          }
     };

     const handleViewReceipt = (sale) => {
          setSelectedSale(sale);
          setIsReceiptOpen(true);
     };

     const handleScanQR = async (qrCode) => {
          try {
               setError(null);
               const { data: product, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('qr_code', qrCode)
                    .single();

               if (error) throw error;

               if (product) {
                    setIsQRScannerOpen(false);
                    setIsNewSaleOpen(true);
               }
          } catch (error) {
               console.error('Error scanning QR code:', error);
               setError('Failed to scan product. Please try again.');
          }
     };

     const filteredSales = sales.filter(sale =>
          sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.status.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const formatDate = (date) => {
          return new Intl.DateTimeFormat('en-US', {
               dateStyle: 'medium',
               timeStyle: 'short'
          }).format(new Date(date));
     };

     const getStatusBadge = (status) => {
          switch (status) {
               case 'completed':
                    return <Badge variant="success" className="flex items-center gap-1"><Check size={12} /> {status}</Badge>;
               case 'pending':
                    return <Badge variant="warning" className="flex items-center gap-1"><Clock size={12} /> {status}</Badge>;
               case 'cancelled':
                    return <Badge variant="danger">{status}</Badge>;
               default:
                    return <Badge>{status}</Badge>;
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
                         <Button
                              variant="outline"
                              size="md"
                              icon={<QrCode size={16} />}
                              onClick={() => setIsQRScannerOpen(true)}
                         >
                              Scan QR Code
                         </Button>
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

               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search by sale ID, customer..."
                              icon={<Search size={18} className="text-gray-400" />}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full"
                         />
                    </div>



                    <div className="relative">
                         <Button
                              variant="outline"
                              icon={<Filter size={16} />}
                              onClick={() => setShowFilterMenu(!showFilterMenu)}
                         >
                              Filter
                         </Button>

                         {showFilterMenu && (
                              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                                   <div className="space-y-4">
                                        <label className="flex items-center gap-2">
                                             <input
                                                  type="checkbox"
                                                  checked={filterOptions.hasPhone}
                                                  onChange={(e) => setFilterOptions({
                                                       ...filterOptions,
                                                       hasPhone: e.target.checked
                                                  })}
                                                  className="rounded border-gray-300"
                                             />
                                             <span className="text-sm">Has Phone Number</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                             <input
                                                  type="checkbox"
                                                  checked={filterOptions.hasAddress}
                                                  onChange={(e) => setFilterOptions({
                                                       ...filterOptions,
                                                       hasAddress: e.target.checked
                                                  })}
                                                  className="rounded border-gray-300"
                                             />
                                             <span className="text-sm">Has Address</span>
                                        </label>
                                   </div>
                              </div>
                         )}
                    </div>




                    <div className="relative">
                         <Button
                              variant="outline"
                              icon={<ArrowUpDown size={16} />}
                              onClick={() => setShowSortMenu(!showSortMenu)}
                         >
                              Sort
                         </Button>

                         {showSortMenu && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('name')}
                                   >
                                        <span>Name</span>
                                        {sortField === 'name' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('email')}
                                   >
                                        <span>Email</span>
                                        {sortField === 'email' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                                   <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        onClick={() => handleSort('created_at')}
                                   >
                                        <span>Created Date</span>
                                        {sortField === 'created_at' && (
                                             <Check size={16} className="text-indigo-600" />
                                        )}
                                   </button>
                              </div>
                         )}
                    </div>



               </div>

               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Sale ID</TableHead>
                                   <TableHead>Date & Time</TableHead>
                                   <TableHead>Customer</TableHead>
                                   <TableHead>Total Amount</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {loading ? (
                                   <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                             Loading...
                                        </TableCell>
                                   </TableRow>
                              ) : filteredSales.length > 0 ? (
                                   filteredSales.map((sale) => (
                                        <TableRow key={sale.id}>
                                             <TableCell className="font-medium text-gray-900">{sale.id}</TableCell>
                                             <TableCell>{formatDate(sale.created_at)}</TableCell>
                                             <TableCell>Customer #{sale.customer_id}</TableCell>
                                             <TableCell className="font-medium">
                                                  ${sale.total_amount.toFixed(2)}
                                             </TableCell>
                                             <TableCell>{getStatusBadge(sale.status)}</TableCell>
                                             <TableCell className="text-right">
                                                  <div className="flex justify-end gap-2">
                                                       {sale.status === 'pending' && (
                                                            <>
                                                                 <Button
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      icon={<Check size={16} />}
                                                                      onClick={() => handleUpdateStatus(sale.id, 'completed')}
                                                                 >
                                                                      Complete
                                                                 </Button>
                                                                 <Button
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                      onClick={() => handleUpdateStatus(sale.id, 'cancelled')}
                                                                 >
                                                                      Cancel
                                                                 </Button>
                                                            </>
                                                       )}
                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Eye size={16} />}
                                                            onClick={() => handleViewReceipt(sale)}
                                                       >
                                                            View
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                             <div className="flex flex-col items-center justify-center text-gray-500">
                                                  <Receipt size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No sales found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               <NewSaleModal
                    isOpen={isNewSaleOpen}
                    onClose={() => setIsNewSaleOpen(false)}
                    onSuccess={fetchSales}
               />

               <QRScannerModal
                    isOpen={isQRScannerOpen}
                    onClose={() => setIsQRScannerOpen(false)}
                    onScan={handleScanQR}
               />

               {selectedSale && (
                    <OrderReceipt
                         orderId={selectedSale.id}
                         items={selectedSale.items?.map(item => ({
                              name: item.product.name,
                              quantity: item.quantity,
                              price: item.price
                         })) || []}
                         totalAmount={selectedSale.total_amount}
                         date={new Date(selectedSale.created_at)}
                         type="sale"
                    />
               )}
          </div>
     );
};

export default SalesPage;
