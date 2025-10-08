import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import prisma from '../prisma.js';

import dotenv from 'dotenv';
dotenv.config();


const __dirname = path.resolve();


const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
// const app = express();

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'jB5X+E6DQZFxUDH6lvVfGBc9r5XOxdpC2h2UXRxqJfQ61ejU2HbWxb/2cERHsylX2G2Aj8Tvm7uMy7OWs3E1gA==';
const JWT_EXPIRES = '7d';

const profileDir = path.join(__dirname, '../../public/profile-pictures');
if (!fs.existsSync(profileDir)) {
     fs.mkdirSync(profileDir, { recursive: true });
}

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, profileDir);
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + ext);
     }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
     if (file.mimetype.startsWith('image/')) {
          cb(null, true);
     } else {
          cb(new Error('Only image files are allowed!'), false);
     }
};

// Initialize upload middleware
export const uploadProfile = multer({
     storage: profileStorage,
     fileFilter,
     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const login = async (req, res) => {
     const { email, password } = req.body;

     try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !(await bcrypt.compare(password, user.password))) {
               return res.status(401).json({ error: 'Invalid credentials' });
          }

          // Check if user is active
          if (user.status !== 'active') {
               return res.status(403).json({ error: 'Account is inactive or suspended' });
          }

          // Update last sign-in time
          await prisma.user.update({
               where: { id: user.id },
               data: { lastSignInAt: new Date() }
          });

          const token = jwt.sign(
               { id: user.id, email: user.email, role: user.role },
               JWT_SECRET,
               { expiresIn: JWT_EXPIRES }
          );

          // Set token in HTTP-only cookie
          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          res.json({
               id: user.id,
               email: user.email,
               role: user.role,
               status: user.status,
               name: user.name || email.split('@')[0],
               profilePicture: user.profilePicture,
               createdAt: user.createdAt,
               lastSignInAt: new Date()
          });
     } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Server error' });
     }
};

export const logout = (req, res) => {
     res.clearCookie('token');
     res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
     try {
          const user = await prisma.user.findUnique({
               where: { id: req.user.id },
               select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    name: true,
                    createdAt: true,
                    lastSignInAt: true,
                    profilePicture: true
               }
          });

          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }

          // add full URL if needed
          if (user?.profilePicture && !user.profilePicture.startsWith('http')) {
               user.profilePicture = `${BASE_URL}${user.profilePicture}`;
          }

          res.json(user);
     } catch (error) {
          console.error('Error getting profile:', error);
          res.status(500).json({ message: 'Server error' });
     }
};

// Upload profile picture handler
export const uploadProfilePicture = async (req, res) => {
     try {
          console.log('req.user:', req.user);
          console.log('req.file:', req.file);

          if (!req.file) {
               return res.status(400).json({ error: 'No file uploaded' });
          }

          const profilePicture = `/profile-pictures/${req.file.filename}`;

          const updatedUser = await prisma.user.update({
               where: { id: req.user.id },
               data: { profilePicture: profilePicture },
               select: {
                    id: true,
                    email: true,
                    role: true,
                    name: true,
                    createdAt: true,
                    profilePicture: true
               }
          });

          // Add full URL
          if (updatedUser.profilePicture && !updatedUser.profilePicture.startsWith('http')) {
               updatedUser.profilePicture = `${BASE_URL}${updatedUser.profilePicture}`;
          }

          console.log('Saving file to:', profileDir);
          console.log('File name:', req.file.filename);
          console.log('Profile picture path:', profilePicture);
          console.log('Updated user profile:', updatedUser);

          res.json(updatedUser);

     } catch (error) {
          console.error('Upload profile picture error:', error);
          res.status(500).json({ error: 'Server error: ' + error.message });
     }
};



export const updateProfile = async (req, res) => {
     const { profilePicture } = req.body;

     if (!profilePicture) {
          return res.status(400).json({ error: 'Missing profilePicture' });
     }

     try {
          const updatedUser = await prisma.user.update({
               where: { id: req.user.id },
               data: { profilePicture }
          });

          res.status(200).json(updatedUser);
     } catch (error) {
          console.error('Error updating profile:', error);
          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'User not found' });
          }

          res.status(500).json({ error: 'Failed to update profile' });
     }
};

console.log('Profile upload directory:', profileDir);

// Update user status
export const updateUserStatus = async (req, res) => {
     const { userId } = req.params;
     const { status } = req.body;

     try {
          if (!['active', 'inactive', 'suspended'].includes(status)) {
               return res.status(400).json({ error: 'Invalid status. Must be active, inactive, or suspended' });
          }

          const updatedUser = await prisma.user.update({
               where: { id: userId },
               data: { status },
               select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    lastSignInAt: true,
                    createdAt: true
               }
          });

          res.json(updatedUser);
     } catch (error) {
          console.error('Error updating user status:', error);
          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'User not found' });
          }
          res.status(500).json({ error: 'Server error' });
     }
};

// authController.js
export const changePassword = async (req, res) => {
     const { currentPassword, newPassword } = req.body;

     try {
          if (!currentPassword || !newPassword) {
               return res.status(400).json({ error: 'Missing fields' });
          }

          const user = await prisma.user.findUnique({ where: { id: req.user.id } });
          if (!user) return res.status(404).json({ error: 'User not found' });

          // Verify current password
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

          // Hash new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);

          await prisma.user.update({
               where: { id: req.user.id },
               data: { password: hashedPassword }
          });

          res.json({ message: 'Password updated successfully' });
     } catch (error) {
          console.error('Change password error:', error);
          res.status(500).json({ error: 'Server error' });
     }
};
