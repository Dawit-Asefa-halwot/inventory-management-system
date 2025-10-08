import express from 'express';
import {
     getNotifications,
     markAsRead,
     markAllAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/mark-read/:id', markAsRead);
router.post('/mark-all-read', markAllAsRead);

export default router;