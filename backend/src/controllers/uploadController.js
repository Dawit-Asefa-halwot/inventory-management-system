// uploadController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../'); // go up to project root
const publicProfileDir = path.join(rootDir, 'public/profile-pictures');
const publicProductDir = path.join(rootDir, 'public/product-images');

// Ensure folders exist
for (const dir of [publicProfileDir, publicProductDir]) {
     if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
     }
}

// Configure multer to save in dynamic folder based on type
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          const uploadType = (req.body.type || req.query.type || 'product').toString();
          const targetDir = uploadType === 'profile' ? publicProfileDir : publicProductDir;
          cb(null, targetDir);
     },
     filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
     },
});

const fileFilter = (req, file, cb) => {
     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
     if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
     } else {
          cb(new Error('Invalid file type. Only images are allowed.'), false);
     }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// handle upload
export const handleUpload = async (req, res) => {
     try {
          if (!req.file) throw new Error('No file uploaded');

          const uploadType = (req.body.type || req.query.type || 'product').toString();
          const relativePath = uploadType === 'profile'
               ? `/profile-pictures/${req.file.filename}`
               : `/product-images/${req.file.filename}`;

          // Return both keys for compatibility
          res.json({ imageUrl: relativePath, profilePicture: relativePath });
     } catch (error) {
          console.error('Upload error:', error);
          res.status(400).json({ error: error.message });
     }
};
