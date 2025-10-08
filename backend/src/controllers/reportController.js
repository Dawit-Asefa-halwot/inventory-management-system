import prisma from '../prisma.js';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export const getDailySalesReport = async (req, res) => {
     try {
          const today = new Date();
          const startOfDay = new Date(today.setHours(0, 0, 0, 0));
          const endOfDay = new Date(today.setHours(23, 59, 59, 999));

          const sales = await prisma.salesOrder.findMany({
               where: {
                    created_at: {
                         gte: startOfDay,
                         lte: endOfDay
                    }
               },
               include: {
                    customer: true,
                    items: true
               }
          });

          const report = sales.map(sale => ({
               date: sale.created_at ? new Date(sale.created_at).toISOString() : '',
               order_id: sale.id,
               customer_name: sale.customer?.name || `Customer #${sale.customer_id}`,
               amount: sale.total_amount ? Number(sale.total_amount) : 0,
               // total_amount: sale.total_amount ? Number(sale.total_amount) : 0,
               status: sale.status
          }));

          res.json(report);
     } catch (error) {
          console.error('Error generating daily sales report:', error);
          res.status(500).json({ error: 'Failed to generate daily sales report' });
     }
};

export const getMonthlyRevenueReport = async (req, res) => {
     try {
          const months = [];
          const now = new Date();

          // Get data for last 6 months
          for (let i = 0; i < 6; i++) {
               const monthDate = subMonths(now, i);
               const monthStart = startOfMonth(monthDate);
               const monthEnd = endOfMonth(monthDate);

               const monthData = await prisma.salesOrder.aggregate({
                    _sum: {
                         total_amount: true
                    },
                    where: {
                         created_at: {
                              gte: monthStart,
                              lte: monthEnd
                         }
                    }
               });

               months.push({
                    month: format(monthDate, 'yyyy-MM'),
                    total_revenue: Number(monthData._sum.total_amount) || 0
               });
          }

          res.json(months.reverse());
     } catch (error) {
          console.error('Error generating monthly revenue report:', error);
          res.status(500).json({ error: 'Failed to generate monthly revenue report' });
     }
};

export const getTopProductsReport = async (req, res) => {
     try {
          const topProducts = await prisma.salesItem.groupBy({
               by: ['product_id'],
               _sum: {
                    quantity: true
               },
               orderBy: {
                    _sum: {
                         quantity: 'desc'
                    }
               },
               take: 10
          });

          // Get product details
          const productIds = topProducts.map(item => item.product_id);
          const products = await prisma.product.findMany({
               where: {
                    id: { in: productIds }
               }
          });

          const report = topProducts.map(item => {
               const product = products.find(p => p.id === item.product_id);
               return {
                    product_name: product?.name || `Product #${item.product_id}`,
                    units_sold: item._sum.quantity
               };
          });

          res.json(report);
     } catch (error) {
          console.error('Error generating top products report:', error);
          res.status(500).json({ error: 'Failed to generate top products report' });
     }
};

export const getInventoryReport = async (req, res) => {
     try {
          const products = await prisma.product.findMany({
               include: {
                    category: true
               }
          });

          const report = products.map(product => {
               let status;
               if (product.quantity > 10) status = 'In Stock';
               else if (product.quantity > 0) status = 'Low Stock';
               else status = 'Out of Stock';

               return {
                    product_name: product.name,
                    category_name: product.category?.name || 'Uncategorized',
                    quantity: product.quantity,
                    price: product.purchase_price, // FIXED: use purchase_price
                    status
               };
          });

          res.json(report);
     } catch (error) {
          console.error('Error generating inventory report:', error);
          res.status(500).json({ error: 'Failed to generate inventory report' });
     }
};

export const getLowStockReport = async (req, res) => {
     try {
          const lowStockProducts = await prisma.product.findMany({
               where: {
                    quantity: {
                         lte: 10
                    }
               },
               include: {
                    category: true
               }
          });

          const report = lowStockProducts.map(product => ({
               product_name: product.name,
               category_name: product.category?.name || 'Uncategorized',
               quantity: product.quantity,
               status: product.quantity > 0 ? 'Low Stock' : 'Out of Stock'
          }));

          res.json(report);
     } catch (error) {
          console.error('Error generating low stock report:', error);
          res.status(500).json({ error: 'Failed to generate low stock report' });
     }
};

export const getInventoryValueReport = async (req, res) => {
     try {
          const products = await prisma.product.findMany({
               include: {
                    category: true
               }
          });

          const report = products.map(product => ({
               product_name: product.name,
               category_name: product.category?.name || 'Uncategorized',
               quantity: product.quantity,
               price: product.purchase_price, // FIXED
               total_value: product.quantity * Number(product.purchase_price) // FIXED
          }));

          res.json(report);
     } catch (error) {
          console.error('Error generating inventory value report:', error);
          res.status(500).json({ error: 'Failed to generate inventory value report' });
     }
};

export const getSupplierAnalysisReport = async (req, res) => {
     try {
          const suppliers = await prisma.supplier.findMany({
               include: {
                    purchase_orders: true
               }
          });

          const report = suppliers.map(supplier => {
               const totalOrders = supplier.purchase_orders.length;
               const totalSpent = supplier.purchase_orders.reduce(
                    (sum, order) => sum + (order.total_amount ? Number(order.total_amount) : 0), 0
               );

               return {
                    supplier_name: supplier.name,
                    total_orders: totalOrders,
                    total_spent: totalSpent
               };
          });

          res.json(report);
     } catch (error) {
          console.error('Error generating supplier analysis report:', error);
          res.status(500).json({ error: 'Failed to generate supplier analysis report' });
     }
};




export const getPurchaseOrdersReport = async (req, res) => {
     try {
          const purchaseOrders = await prisma.purchaseOrder.findMany({
               include: {
                    supplier: true
               }
          });

          const report = purchaseOrders.map(order => ({
               date: order.created_at ? new Date(order.created_at).toISOString() : '',
               order_id: order.id,
               supplier_name: order.supplier?.name || 'Unknown',
               amount: order.total_amount ? Number(order.total_amount) : 0,
               status: order.status
          }));

          res.json(report);
     } catch (error) {
          console.error('Error generating purchase orders report:', error);
          res.status(500).json({ error: 'Failed to generate purchase orders report' });
     }
};



export const getCostAnalysisReport = async (req, res) => {
     try {
          const products = await prisma.product.findMany({
               include: {
                    purchaseItems: true // FIXED: use purchaseItems
               }
          });

          const report = products.map(product => {
               const totalPurchased = product.purchaseItems.reduce(
                    (sum, item) => sum + item.quantity, 0
               );

               const totalCost = product.purchaseItems.reduce(
                    (sum, item) => sum + (item.quantity * Number(item.price)), 0
               );

               return {
                    product_name: product.name,
                    total_purchased: totalPurchased,
                    total_cost: totalCost
               };
          });

          res.json(report);
     } catch (error) {
          console.error('Error generating cost analysis report:', error);
          res.status(500).json({ error: 'Failed to generate cost analysis report' });
     }
};