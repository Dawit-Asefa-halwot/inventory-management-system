// controllers/customerController.js
import prisma from '../prisma.js';
import { io } from '../server.js';
export const getCustomers = async (req, res) => {
     try {
          const customers = await prisma.customer.findMany();
          res.json(customers);
     } catch (error) {
          console.error('Error fetching customers:', error);
          res.status(500).json({ error: 'Internal server error' });
     }
};

export const createCustomer = async (req, res) => {
     const { name, email, phone, address } = req.body;

     try {
          const newCustomer = await prisma.customer.create({
               data: { name, email, phone, address }
          });

          const notification = await prisma.notification.create({
               data: {
                    type: 'customer',
                    message: `Customer "${name}" registered.`,
                    created_at: new Date()
               }
          });

          io.emit('new-notification', notification);

          res.status(201).json(newCustomer);
     } catch (error) {
          console.error('Error creating customer:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }



          res.status(400).json({ error: 'Failed to create customer' });
     }
};

export const updateCustomer = async (req, res) => {
     const { id } = req.params;
     const { name, email, phone, address } = req.body;

     try {
          const updatedCustomer = await prisma.customer.update({
               where: { id: parseInt(id, 10) },
               data: { name, email, phone, address }
          });
          res.json(updatedCustomer);
     } catch (error) {
          console.error('Error updating customer:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Customer not found' });
          }

          res.status(400).json({ error: 'Failed to update customer' });
     }
};

export const deleteCustomer = async (req, res) => {
     const { id } = req.params;

     try {
          await prisma.customer.delete({
               where: { id: parseInt(id, 10) }
          });
          res.status(204).send();
     } catch (error) {
          console.error('Error deleting customer:', error);

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Customer not found' });
          }

          res.status(400).json({ error: 'Failed to delete customer' });
     }
};