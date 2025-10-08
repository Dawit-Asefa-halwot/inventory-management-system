// src/server.js
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import categoryRoutes from './routes/categoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { upload, handleUpload } from './controllers/uploadController.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIXED: Go up from backend/src to project root, then to public/profile-pictures
const rootDir = path.join(__dirname, '../../'); // This goes to inventory-management-system/
const publicProfilePicturesDir = path.join(rootDir, 'public/profile-pictures');
const publicProductImagesDir = path.join(rootDir, 'public/product-images'); // ADD THIS

// Create directories if they don't exist
if (!fs.existsSync(publicProfilePicturesDir)) {
     fs.mkdirSync(publicProfilePicturesDir, { recursive: true });
     console.log(`Created profile pictures directory: ${publicProfilePicturesDir}`);
}

// ADD THIS: Create product images directory
if (!fs.existsSync(publicProductImagesDir)) {
     fs.mkdirSync(publicProductImagesDir, { recursive: true });
     console.log(`Created product images directory: ${publicProductImagesDir}`);
}

// Serve profile pictures from the root public/profile-pictures directory
app.use('/profile-pictures', express.static(publicProfilePicturesDir));

// ADD THIS: Serve product images from the root public/product-images directory
app.use('/product-images', express.static(publicProductImagesDir));

// Also serve the main public directory for fallback images
const publicDir = path.join(rootDir, 'public');
app.use(express.static(publicDir));

// Middleware
app.use(cors({
     origin: ['http://localhost:5173'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.post('/api/upload', upload.single('image'), handleUpload);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
     cors: {
          origin: 'http://localhost:5173',
          methods: ['GET', 'POST'],
          credentials: true
     }
});

app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ error: 'Internal server error' });
});

io.on('connection', (socket) => {
     console.log('A user connected:', socket.id);
});

// Start server
server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
     console.log(`Root directory: ${rootDir}`);
     console.log(`Profile pictures directory: ${publicProfilePicturesDir}`);
     console.log(`Product images directory: ${publicProductImagesDir}`); // ADD THIS
});

export { io };