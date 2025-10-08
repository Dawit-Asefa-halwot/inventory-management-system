import express from 'express';
import {
     getPurchaseOrders,
     updatePurchaseOrderStatus,
     createPurchaseOrder,
     getPurchaseOrderDetails
} from '../controllers/purchaseOrderController.js';

const router = express.Router();

// GET all purchase orders
router.get('/', getPurchaseOrders);

// GET specific purchase order details
router.get('/:id', getPurchaseOrderDetails);

// UPDATE purchase order status
router.put('/:id/status', updatePurchaseOrderStatus);

// CREATE new purchase order
router.post('/', createPurchaseOrder);

export default router;