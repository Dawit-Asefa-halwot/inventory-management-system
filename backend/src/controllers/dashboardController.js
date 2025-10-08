import prisma from '../prisma.js';
import { io } from '../server.js';

export const getDashboardStats = async (req, res) => {
     try {
          const [
               totalProducts,
               totalSales,
               totalRevenue,
               totalCustomers,
               totalSuppliers,
               lowStockItems
          ] = await Promise.all([
               prisma.product.count(),
               prisma.salesOrder.count(),
               prisma.salesOrder.aggregate({
                    _sum: { total_amount: true }
               }),
               prisma.customer.count(),
               prisma.supplier.count(),
               prisma.product.findMany({
                    where: { quantity: { lt: 10 } },
                    include: { category: true }
               })
          ]);

          // Create low stock notifications for products with quantity <= 5
          const criticalStockItems = lowStockItems.filter(item => item.quantity <= 5);

          for (const item of criticalStockItems) {
               // Check if notification already exists for this product
               const existingNotification = await prisma.notification.findFirst({
                    where: {
                         type: 'low_stock',
                         related_id: item.id.toString(),
                         created_at: {
                              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                         }
                    }
               });

               if (!existingNotification) {
                    const notification = await prisma.notification.create({
                         data: {
                              type: 'low_stock',
                              message: `Low stock alert: ${item.name} has only ${item.quantity} units left`,
                              related_id: item.id.toString(),
                              created_at: new Date()
                         }
                    });

                    // Emit real-time notification
                    io.emit('new-notification', notification);
               }
          }

          res.json({
               totalProducts,
               totalSales,
               totalRevenue: totalRevenue._sum.total_amount || 0,
               totalCustomers,
               totalSuppliers,
               lowStockItems
          });
     } catch (error) {
          res.status(500).json({ error: 'Error fetching dashboard stats' });
     }
};

export const getRecentActivities = async (req, res) => {
     try {
          const [sales, purchases] = await Promise.all([
               prisma.salesOrder.findMany({
                    take: 10,
                    orderBy: { created_at: 'desc' },
                    include: {
                         customer: true,
                         items: {
                              include: { product: true }
                         }
                    }
               }),
               prisma.purchaseOrder.findMany({
                    take: 10,
                    orderBy: { created_at: 'desc' },
                    include: {
                         supplier: true,
                         items: {
                              include: { product: true }
                         }
                    }
               })
          ]);

          const activities = [
               ...sales.map(sale => ({
                    id: sale.id,
                    type: 'sale',
                    date: sale.created_at,
                    amount: parseFloat(sale.total_amount),
                    relatedEntity: sale.customer
               })),
               ...purchases.map(purchase => ({
                    id: purchase.id,
                    type: 'purchase',
                    date: purchase.created_at,
                    amount: parseFloat(purchase.total_amount),
                    relatedEntity: purchase.supplier
               }))
          ];

          activities.sort((a, b) => new Date(b.date) - new Date(a.date));

          res.json(activities.slice(0, 10));
     } catch (error) {
          res.status(500).json({ error: 'Error fetching recent activities' });
     }
};

export const getRevenueData = async (req, res) => {
     try {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

          const sales = await prisma.salesOrder.findMany({
               where: {
                    created_at: { gte: twelveMonthsAgo }
               },
               select: {
                    total_amount: true,
                    created_at: true
               }
          });

          const revenueByMonth = sales.reduce((acc, sale) => {
               const month = `${sale.created_at.getFullYear()}-${sale.created_at.getMonth() + 1}`;
               acc[month] = (acc[month] || 0) + parseFloat(sale.total_amount);
               return acc;
          }, {});

          const revenueData = Object.entries(revenueByMonth)
               .map(([month, revenue]) => ({ month, revenue }))
               .sort((a, b) => a.month.localeCompare(b.month));

          res.json(revenueData);
     } catch (error) {
          res.status(500).json({ error: 'Error fetching revenue data' });
     }
};