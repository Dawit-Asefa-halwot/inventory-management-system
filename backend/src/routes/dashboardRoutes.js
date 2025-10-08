import express from 'express';
import {
     getDashboardStats,
     getRecentActivities,
     getRevenueData
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/activities', getRecentActivities);
router.get('/revenue-data', getRevenueData);

export default router;