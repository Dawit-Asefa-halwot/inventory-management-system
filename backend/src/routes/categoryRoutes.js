// src/routes/categoryRoutes.js
import express from 'express';
import { createCategory, getAllCategories, deleteCategory, updateCategory } from '../controllers/categoryController.js';

// ...



const router = express.Router();
router.put('/:id', updateCategory);
// Create new category
router.post('/', createCategory);

// Get all categories
router.get('/', getAllCategories);

// Delete category
router.delete('/:id', deleteCategory);

export default router;
