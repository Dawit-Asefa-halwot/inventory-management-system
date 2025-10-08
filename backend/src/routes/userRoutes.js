// src/routes/userRoutes.js
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
     getUsers,
     createUser,
     updateUser,
     deleteUser
} from '../controllers/userController.js';


const router = express.Router();

router.use(protect);
router.use(authorize(['admin']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;