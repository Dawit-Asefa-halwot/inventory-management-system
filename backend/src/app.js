import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import categoryRoutes from './routes/categoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import { upload, handleUpload } from './controllers/uploadController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');
const publicProfilePicturesDir = path.join(rootDir, 'public/profile-pictures');
const publicProductImagesDir = path.join(rootDir, 'public/product-images');

const app = express();

// Ensure static folders exist
for (const dir of [publicProfilePicturesDir, publicProductImagesDir]) {
     if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
     }
}

// Middleware
app.use(cors({
     origin: ['http://localhost:5173'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static images from project root public folder
app.use('/profile-pictures', express.static(publicProfilePicturesDir));
app.use('/product-images', express.static(publicProductImagesDir));
app.use(express.static(path.join(rootDir, 'public')));
// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes); // Add this

app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.post('/api/upload', upload.single('image'), handleUpload);
app.use('/api/sales-orders', salesOrderRoutes);
// Health check endpoint
app.use('/api/reports', reportRoutes);
app.get('/api/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
});

// Serve legacy uploads route if present
app.use('/uploads', express.static('uploads'));
// If you serve a built frontend, adjust path as needed
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API 404 Handler
app.use('/api/*', (req, res) => {
     res.status(404).json({ error: 'API endpoint not found' });
});

// Handle React routing
app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

export default app;