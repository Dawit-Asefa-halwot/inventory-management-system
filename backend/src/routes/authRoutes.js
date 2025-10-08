import express from 'express';
import {
     login,
     logout,
     getProfile,
     uploadProfilePicture,
     uploadProfile,
     updateProfile,
     changePassword,
     updateUserStatus
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.post(
     '/upload-profile-picture',
     protect,
     uploadProfile.single('profilePicture'),
     uploadProfilePicture
);
router.post('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.put('/users/:userId/status', protect, updateUserStatus);

export default router;