// src/controllers/userController.js
import prisma from '../prisma.js';
import { io } from '../server.js';
import bcrypt from 'bcryptjs';
export const getUsers = async (req, res) => {
     try {
          const users = await prisma.user.findMany();
          res.json(users);
     } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
     }
};

export const createUser = async (req, res) => {
     const { name, email, password, role } = req.body;
     try {
          // Validate required fields
          if (!email || !password || !role) {
               return res.status(400).json({ error: 'Missing required fields' });
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await prisma.user.create({
               data: {
                    name,
                    email,
                    role,
                    password: hashedPassword // Add hashed password
               }
          });


          const notification = await prisma.notification.create({
               data: {
                    type: 'user',
                    message: `user "${email}" created.`,
                    created_at: new Date()
               }
          });

          // Emit real-time notification
          io.emit('new-notification', notification);

          res.status(201).json(newUser);
     } catch (error) {
          console.error('Error creating user:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }

          res.status(400).json({ error: 'Failed to create user' });
     }
};
export const updateUser = async (req, res) => {
     const { id } = req.params;
     const { name, email, role, password } = req.body;

     try {
          const dataToUpdate = { name, email, role };

          if (password) {
               // hash password only if provided
               const hashedPassword = await bcrypt.hash(password, 10);
               dataToUpdate.password = hashedPassword;
          }

          const updatedUser = await prisma.user.update({
               where: { id },
               data: dataToUpdate,
          });

          res.json(updatedUser);
     } catch (error) {
          console.error('Error updating user:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Email already exists' });
          }

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'User not found' });
          }

          res.status(400).json({ error: 'Failed to update user' });
     }
};


export const deleteUser = async (req, res) => {
     const { id } = req.params;

     try {
          // First delete associated notifications
          await prisma.notification.deleteMany({
               where: { user_id: id }
          });

          // Then delete the user
          await prisma.user.delete({
               where: { id }
          });

          res.status(204).send();
     } catch (error) {
          console.error('Error deleting user:', error);

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'User not found' });
          }

          res.status(400).json({ error: 'Failed to delete user' });
     }
};

