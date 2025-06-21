import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import Button from '../../components/ui/button';
import NewPurchaseModal from '../../components/orders/NewPurchaseModal';
import QRScannerModal from '../../components/orders/QRScannerModal';
import QRDisplayModal from '../../components/orders/QRDisplayModal';
import PurchaseDetailModal from '../../components/orders/PurchaseDetailModal';
import SearchFilterBar from './components/SearchFilterBar';
import PurchasesTable from './components/PurchaseTable';
const PurchasesPage = () => {
     const [isDetailOpen, setIsDetailOpen] = useState(false);
     const [selectedPurchase, setSelectedPurchase] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [purchases, setPurchases] = useState([]);
     const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
     const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
     const [isQRDisplayOpen, setIsQRDisplayOpen] = useState(false);
     const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
     const [loading, setLoading] = useState(true);

     const [sortField, setSortField] = useState('name');
     const [sortOrder, setSortOrder] = useState('asc');
     const [showFilterMenu, setShowFilterMenu] = useState(false);
     const [showSortMenu, setShowSortMenu] = useState(false);
     const [filterOptions, setFilterOptions] = useState({
          hasPhone: false,
          hasAddress: false
     });

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
                              variant="primary"
                              size="md"
                              icon={<Plus size={16} />}
                              onClick={() => setIsNewPurchaseOpen(true)}
                         >
                              Create Purchase Order
                         </Button>
                    </div>
               </div>

               <SearchFilterBar
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

               <PurchasesTable
                    purchases={filteredPurchases}
                    loading={loading}
                    onViewDetails={(purchase) => {
                         setSelectedPurchase(purchase);
                         setIsDetailOpen(true);
                    }}
                    onUpdateStatus={handleUpdateStatus}
               />

               <NewPurchaseModal
                    isOpen={isNewPurchaseOpen}
                    onClose={() => setIsNewPurchaseOpen(false)}
                    onSuccess={fetchPurchases}
               />

               <QRScannerModal
                    isOpen={isQRScannerOpen}
                    onClose={() => setIsQRScannerOpen(false)}
                    onScan={(qrCode) => setSearchTerm(qrCode.toString())}
               />

               <QRDisplayModal
                    isOpen={isQRDisplayOpen}
                    onClose={() => setIsQRDisplayOpen(false)}
                    purchaseOrderId={selectedPurchaseId}
               />

               <PurchaseDetailModal
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    purchase={selectedPurchase}
               />
          </div>
     );
};

export default PurchasesPage;