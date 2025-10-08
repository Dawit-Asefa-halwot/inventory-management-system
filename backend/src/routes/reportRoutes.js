import express from 'express';
import {
     getDailySalesReport,
     getMonthlyRevenueReport,
     getTopProductsReport,
     getInventoryReport,
     getLowStockReport,
     getInventoryValueReport,
     getSupplierAnalysisReport,
     getCostAnalysisReport
} from '../controllers/reportController.js';
import { getPurchaseOrdersReport } from '../controllers/reportController.js';
const router = express.Router();

router.get('/daily-sales', getDailySalesReport);
router.get('/monthly-revenue', getMonthlyRevenueReport);
router.get('/top-products', getTopProductsReport);
router.get('/inventory', getInventoryReport);
router.get('/low-stock', getLowStockReport);
router.get('/inventory-value', getInventoryValueReport);
router.get('/supplier-analysis', getSupplierAnalysisReport);
router.get('/cost-analysis', getCostAnalysisReport);
router.get('/purchases', getPurchaseOrdersReport);
export default router;