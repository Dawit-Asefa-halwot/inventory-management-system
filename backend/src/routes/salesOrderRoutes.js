import express from 'express';
import {
     getSalesOrders,
     updateSalesOrderStatus,
     createSalesOrder,
     getSalesOrderById
} from '../controllers/salesController.js';

const router = express.Router();

router.get('/', getSalesOrders);
router.put('/:id/status', updateSalesOrderStatus);
router.post('/', createSalesOrder);
router.get('/:id', getSalesOrderById);

export default router;