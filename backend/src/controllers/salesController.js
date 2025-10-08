import prisma from '../prisma.js';
import { io } from '../server.js';
export const getSalesOrders = async (req, res) => {
     try {
          const { sortBy = 'created_at', order = 'desc' } = req.query;

          const validSortFields = ['id', 'created_at', 'total_amount', 'status'];
          const validOrders = ['asc', 'desc'];

          if (!validSortFields.includes(sortBy)) {
               return res.status(400).json({ error: 'Invalid sort field' });
          }

          if (!validOrders.includes(order)) {
               return res.status(400).json({ error: 'Invalid sort order' });
          }

          const sales = await prisma.salesOrder.findMany({
               include: {
                    customer: true,
                    items: {
                         include: {
                              product: true
                         }
                    }
               },
               orderBy: {
                    [sortBy]: order
               }
          });

          res.json(sales);
     } catch (error) {
          console.error('Error fetching sales orders:', error);
          res.status(500).json({ error: 'Failed to fetch sales orders' });
     }
};



export const updateSalesOrderStatus = async (req, res) => {
     try {
          const { id } = req.params;
          const { status } = req.body;

          const validStatuses = ['pending', 'completed', 'cancelled'];
          if (!validStatuses.includes(status)) {
               return res.status(400).json({ error: 'Invalid status value' });
          }

          const updatedOrder = await prisma.salesOrder.update({
               where: { id: parseInt(id) }, // FIXED
               data: { status }
          });

          // If completing order, update inventory
          if (status === 'completed') {
               const order = await prisma.salesOrder.findUnique({
                    where: { id: parseInt(id) }, // FIXED
                    include: { items: true }
               });

               for (const item of order.items) {
                    await prisma.product.update({
                         where: { id: item.product_id },
                         data: {
                              quantity: {
                                   decrement: item.quantity
                              }
                         }
                    });
               }
          }

          res.json(updatedOrder);
     } catch (error) {
          console.error('Error updating sales order status:', error);
          res.status(500).json({ error: 'Failed to update sales order status' });
     }
};

export const createSalesOrder = async (req, res) => {
     try {
          const { customer_id, items, total_amount } = req.body;

          // Validate items and check stock
          for (const item of items) {
               const product = await prisma.product.findUnique({
                    where: { id: parseInt(item.product_id) }
               });

               if (!product) {
                    return res.status(404).json({ error: `Product not found: ${item.product_id}` });
               }

               if (product.quantity < parseInt(item.quantity)) {
                    return res.status(400).json({
                         error: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
                    });
               }
          }


          const notification = await prisma.notification.create({
               data: {
                    type: 'sale',
                    message: 'A new sale was created!',
                    created_at: new Date(),
                    // ...other fields
               }
          });


          io.emit('new-notification', notification);


          // Create sales order
          const salesOrder = await prisma.salesOrder.create({
               data: {
                    customer_id: customer_id ? parseInt(customer_id) : null,
                    total_amount: parseFloat(total_amount),
                    status: 'pending',
                    items: {
                         create: items.map(item => ({
                              product_id: parseInt(item.product_id),
                              quantity: parseInt(item.quantity),
                              price: parseFloat(item.price)
                         }))
                    }
               },
               include: {
                    customer: true,
                    items: {
                         include: {
                              product: true
                         }
                    }
               }
          });

          res.status(201).json(salesOrder);
     } catch (error) {
          console.error('Error creating sales order:', error);
          res.status(500).json({ error: 'Failed to create sales order' });
     }
};

export const getSalesOrderById = async (req, res) => {
     try {
          const { id } = req.params;

          const salesOrder = await prisma.salesOrder.findUnique({
               where: { id },
               include: {
                    customer: true,
                    items: {
                         include: {
                              product: true
                         }
                    }
               }
          });

          if (!salesOrder) {
               return res.status(404).json({ error: 'Sales order not found' });
          }

          res.json(salesOrder);
     } catch (error) {
          console.error('Error creating sales order:', error);
          res.status(500).json({ error: error.message || 'Failed to create sales order' });
     }
};

