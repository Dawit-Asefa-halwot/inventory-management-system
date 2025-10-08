import prisma from '../prisma.js';

export const getNotifications = async (req, res) => {
     try {
          const notifications = await prisma.notification.findMany({
               orderBy: { created_at: 'desc' }
          });
          res.json(notifications);
     } catch (error) {
          res.status(500).json({ error: 'Error fetching notifications' });
     }
};

export const markAsRead = async (req, res) => {
     try {
          const { id } = req.params;
          await prisma.notification.update({
               where: { id: parseInt(id) },
               data: { read: true }
          });
          res.status(200).send();
     } catch (error) {
          res.status(500).json({ error: 'Error marking notification as read' });
     }
};

export const markAllAsRead = async (req, res) => {
     try {
          await prisma.notification.updateMany({
               where: { read: false },
               data: { read: true }
          });
          res.status(200).send();
     } catch (error) {
          res.status(500).json({ error: 'Error marking all notifications as read' });
     }
};