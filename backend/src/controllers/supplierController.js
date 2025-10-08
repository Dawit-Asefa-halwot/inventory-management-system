// src/controllers/supplierController.js
import prisma from '../prisma.js';
import { io } from '../server.js';
export const getSuppliers = async (req, res) => {
     try {
          const suppliers = await prisma.supplier.findMany();
          res.json(suppliers);
     } catch (error) {
          console.error('Error fetching suppliers:', error);
          res.status(500).json({ error: 'Internal server error' });
     }
};

export const createSupplier = async (req, res) => {
     const { name, email, phone, address } = req.body;

     try {
          const newSupplier = await prisma.supplier.create({
               data: { name, email, phone, address }
          });

          const notification = await prisma.notification.create({
               data: {
                    type: 'supplier',
                    message: `supplier "${name}" created.`,
                    created_at: new Date()
               }
          });

          // Emit real-time notification
          io.emit('new-notification', notification);


          res.status(201).json(newSupplier);
     } catch (error) {
          console.error('Error creating supplier:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }

          res.status(400).json({ error: 'Failed to create supplier' });
     }
};

export const updateSupplier = async (req, res) => {
     const { id } = req.params;
     const { name, email, phone, address } = req.body;

     try {
          const updatedSupplier = await prisma.supplier.update({
               where: { id: parseInt(id) },
               data: { name, email, phone, address }
          });
          res.json(updatedSupplier);
     } catch (error) {
          console.error('Error updating supplier:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Supplier not found' });
          }

          res.status(400).json({ error: 'Failed to update supplier' });
     }
};

export const deleteSupplier = async (req, res) => {
     const { id } = req.params;

     try {
          await prisma.supplier.delete({
               where: { id: parseInt(id) }
          });
          res.status(204).send();
     } catch (error) {
          console.error('Error deleting supplier:', error);

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Supplier not found' });
          }

          res.status(400).json({ error: 'Failed to delete supplier' });
     }
};