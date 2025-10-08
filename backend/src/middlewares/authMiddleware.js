import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jB5X+E6DQZFxUDH6lvVfGBc9r5XOxdpC2h2UXRxqJfQ61ejU2HbWxb/2cERHsylX2G2Aj8Tvm7uMy7OWs3E1gA==';

export const protect = async (req, res, next) => {
     const token = req.cookies.token;
     console.log('Token from cookies:', token);

     if (!token) {
          return res.status(401).json({ error: 'Not authorized, no token' });
     }

     try {
          const decoded = jwt.verify(token, JWT_SECRET);
          console.log('Decoded user:', decoded);

          // Fetch the user from database
          const user = await prisma.user.findUnique({
               where: { id: decoded.id },
               select: { id: true, email: true, role: true }
          });

          if (!user) {
               return res.status(401).json({ error: 'User not found' });
          }

          req.user = user;
          next();
     } catch (error) {
          console.error('Token error:', error);
          res.status(401).json({ error: 'Not authorized, token failed' });
     }
};

export const authorize = (roles) => {
     return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
               return res.status(403).json({ error: 'Forbidden, insufficient permissions' });
          }
          next();
     };
};