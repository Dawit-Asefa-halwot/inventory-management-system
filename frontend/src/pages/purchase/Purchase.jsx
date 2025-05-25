import React, { useState, useEffect } from 'react';
import {
     Plus,
     Search,
     Filter,
     ArrowUpDown,
     Eye,
     ShoppingCart,
     CreditCard,
     Check,
     Clock,
     QrCode
} from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import Badge from '../../components/ui/badge';
// import { supabase } from '../lib/supabase';
import NewPurchaseModal from '../../components/orders/NewPurchaseModal';
import QRScannerModal from '../../components/orders/QRScannerModal';

const PurchasesPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [purchases, setPurchases] = useState([]);
     const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
     const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
     const [loading, setLoading] = useState(true);

     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });


     // Update fetchPurchases in PurchasesPage.jsx
     const fetchPurchases = async () => {
          try {
               const response = await fetch(
                    `http://localhost:5000/api/purchase-orders?sortBy=${sortField}&order=${sortOrder}`
               );

               if (!response.ok) throw new Error('Failed to fetch purchases');

               const data = await response.json();
               setPurchases(data);
          } catch (error) {
               console.error('Error fetching purchases:', error);
               alert('Failed to load purchases: ' + error.message);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchPurchases();
     }, [sortField, sortOrder]);

     const filteredPurchases = purchases.filter(purchase =>
          purchase.id.toString().includes(searchTerm.toLowerCase()) ||
          (purchase.supplier?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
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

     const handleUpdateStatus = async (id, status) => {
          try {
               const response = await fetch(`http://localhost:5000/api/purchase-orders/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
               });

               if (!response.ok) throw new Error('Update failed');
               fetchPurchases();
          } catch (error) {
               console.error('Update error:', error);
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
                    <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>

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
                              onClick={() => setIsNewPurchaseOpen(true)}
                         >
                              Create Purchase Order
                         </Button>
                    </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                         <Input
                              placeholder="Search by PO number, supplier..."
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
                                   <TableHead>Purchase Order</TableHead>
                                   <TableHead>Date & Time</TableHead>
                                   <TableHead>Supplier</TableHead>
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
                              ) : filteredPurchases.length > 0 ? (
                                   filteredPurchases.map((purchase) => (
                                        <TableRow key={purchase.id}>
                                             <TableCell className="font-medium text-gray-900">{purchase.id}</TableCell>
                                             <TableCell>{formatDate(purchase.created_at)}</TableCell>
                                             <TableCell>{purchase.supplier?.name || `Supplier #${purchase.supplier_id}`}</TableCell>
                                             <TableCell className="font-medium">${Number(purchase.total_amount).toFixed(2)}</TableCell>
                                             <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                                             <TableCell className="text-right">
                                                  <div className="flex justify-end gap-2">
                                                       {purchase.status === 'pending' && (
                                                            <>
                                                                 <Button
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      icon={<Check size={16} />}
                                                                      onClick={() => handleUpdateStatus(purchase.id, 'completed')}
                                                                 >
                                                                      Complete
                                                                 </Button>
                                                                 <Button
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                      onClick={() => handleUpdateStatus(purchase.id, 'cancelled')}
                                                                 >
                                                                      Reject
                                                                 </Button>
                                                            </>
                                                       )}
                                                       <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Eye size={16} />}
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
                                                  <ShoppingCart size={28} className="mb-2" />
                                                  <h3 className="text-lg font-medium">No purchase orders found</h3>
                                                  <p className="text-sm">Try adjusting your search or filters</p>
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               <NewPurchaseModal
                    isOpen={isNewPurchaseOpen}
                    onClose={() => setIsNewPurchaseOpen(false)}
                    onSuccess={fetchPurchases}
               />

               <QRScannerModal
                    isOpen={isQRScannerOpen}
                    onClose={() => setIsQRScannerOpen(false)}
                    onScan={(qrCode) => {
                         console.log('Scanned QR code:', qrCode);
                    }}
               />
          </div>
     );
};

export default PurchasesPage;
