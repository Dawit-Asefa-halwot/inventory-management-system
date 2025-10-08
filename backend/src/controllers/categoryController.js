// src/controllers/categoryController.js
import prisma from '../prisma.js';
import { io } from '../server.js';
// Create new category
export const createCategory = async (req, res) => {
     try {
          const { name, description } = req.body;

          const newCategory = await prisma.category.create({
               data: {
                    name,
                    description: description || null
               }
          });

          const notification = await prisma.notification.create({
               data: {
                    type: 'category',
                    message: `Category "${name}" created.`,
                    created_at: new Date()
               }
          });

          // Emit real-time notification
          io.emit('new-notification', notification);

          res.status(201).json(newCategory);
     } catch (error) {
          console.error('Category creation error:', error);
          res.status(400).json({ error: 'Failed to create category' });
     }
};

// Get all categories
export const getAllCategories = async (req, res) => {
     try {
          const categories = await prisma.category.findMany({
               orderBy: { name: 'asc' }
          });
          res.json(categories);
     } catch (error) {
          console.error('Fetch categories error:', error);
          res.status(500).json({ error: 'Failed to fetch categories' });
     }
};

// Delete category
export const deleteCategory = async (req, res) => {
     try {
          const { id } = req.params;

          const category = await prisma.category.findUnique({
               where: { id: parseInt(id) }
          });

          if (!category) {
               return res.status(404).json({ error: 'Category not found' });
          }

          await prisma.category.delete({
               where: { id: parseInt(id) }
          });

          res.status(204).send();
     } catch (error) {
          console.error('Delete category error:', error);

          if (error.code === 'P2003') {
               return res.status(400).json({
                    error: 'Cannot delete category with associated products'
               });
          }

          res.status(500).json({ error: 'Failed to delete category' });
     }
};

// Update category
export const updateCategory = async (req, res) => {
     try {
          const { id } = req.params;
          const { name, description } = req.body;

          const updatedCategory = await prisma.category.update({
               where: { id: parseInt(id) },
               data: { name, description: description || null }
          });

          res.json(updatedCategory);
     } catch (error) {
          console.error('Update category error:', error);

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Category not found' });
          }

          res.status(500).json({ error: 'Failed to update category' });
     }
};
