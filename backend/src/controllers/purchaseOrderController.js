import prisma from '../prisma.js';
import { io } from '../server.js';
export const getPurchaseOrders = async (req, res) => {
     try {
          const { sortBy = 'created_at', order = 'asc' } = req.query;

          // Validate sort parameters
          const validSortFields = ['id', 'created_at', 'total_amount', 'status'];
          const validOrders = ['asc', 'desc'];

          if (!validSortFields.includes(sortBy)) {
               return res.status(400).json({ error: 'Invalid sort field' });
          }

          if (!validOrders.includes(order)) {
               return res.status(400).json({ error: 'Invalid sort order' });
          }

          const purchaseOrders = await prisma.purchaseOrder.findMany({
               include: {
                    supplier: true,
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




          res.json(purchaseOrders);
     } catch (error) {
          console.error('Error fetching purchase orders:', error);
          res.status(500).json({ error: 'Failed to fetch purchase orders' });
     }
};

export const updatePurchaseOrderStatus = async (req, res) => {
     try {
          const { id } = req.params;
          const { status } = req.body;

          // Validate status
          const validStatuses = ['pending', 'completed', 'cancelled'];
          if (!validStatuses.includes(status)) {
               return res.status(400).json({ error: 'Invalid status value' });
          }

          // Update status
          const updatedOrder = await prisma.purchaseOrder.update({
               where: { id: parseInt(id) },
               data: { status }
          });

          // If completing order, update product quantities
          if (status === 'completed') {
               const order = await prisma.purchaseOrder.findUnique({
                    where: { id: parseInt(id) },
                    include: { items: true }
               });

               for (const item of order.items) {
                    await prisma.product.update({
                         where: { id: item.product_id },
                         data: {
                              quantity: {
                                   increment: item.quantity
                              }
                         }
                    });
               }
          }

          res.json(updatedOrder);
     } catch (error) {
          console.error('Error updating status:', error);
          res.status(500).json({ error: 'Failed to update purchase order status' });
     }
};

export const createPurchaseOrder = async (req, res) => {
     try {
          const { supplier_id, items } = req.body;

          // Validate supplier
          const supplier = await prisma.supplier.findUnique({
               where: { id: parseInt(supplier_id) }
          });

          if (!supplier) {
               return res.status(404).json({ error: 'Supplier not found' });
          }

          // Process items and calculate total
          let totalAmount = 0;
          const itemData = [];

          for (const item of items) {
               // Validate product
               const product = await prisma.product.findUnique({
                    where: { id: parseInt(item.product_id) }
               });

               if (!product) {
                    return res.status(404).json({ error: `Product not found: ${item.product_id}` });
               }

               // Calculate item total
               const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
               totalAmount += itemTotal;

               itemData.push({
                    product_id: parseInt(item.product_id),
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price)
               });
          }

          // Create purchase order
          const purchaseOrder = await prisma.purchaseOrder.create({
               data: {
                    supplier_id: parseInt(supplier_id),
                    total_amount: totalAmount,
                    status: 'pending',
                    items: {
                         create: itemData
                    }
               },
               include: {
                    supplier: true,
                    items: {
                         include: {
                              product: true
                         }
                    }
               }
          });

          const notification = await prisma.notification.create({
               data: {
                    type: 'purchase', // FIXED typo
                    message: 'A new purchase was created!',
                    created_at: new Date(),
                    // ...other fields
               }
          });


          io.emit('new-notification', notification);

          res.status(201).json(purchaseOrder);
     } catch (error) {
          console.error('Error creating purchase order:', error);
          res.status(500).json({ error: 'Failed to create purchase order' });
     }
};

export const getPurchaseOrderDetails = async (req, res) => {
     try {
          const { id } = req.params;

          const purchaseOrder = await prisma.purchaseOrder.findUnique({
               where: { id: parseInt(id) },
               include: {
                    supplier: true,
                    items: {
                         include: {
                              product: true
                         }
                    }
               }
          });

          if (!purchaseOrder) {
               return res.status(404).json({ error: 'Purchase order not found' });
          }

          res.json(purchaseOrder);
     } catch (error) {
          console.error('Error fetching purchase order details:', error);
          res.status(500).json({ error: 'Failed to fetch purchase order details' });
     }
};