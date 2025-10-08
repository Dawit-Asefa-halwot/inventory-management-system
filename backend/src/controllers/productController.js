// controllers/productController.js
import prisma from '../prisma.js';

// Helper function to ensure consistent image URL format
const normalizeImageUrl = (imageUrl) => {
     if (!imageUrl) return null;

     // If it's already a full URL, return as is
     if (imageUrl.startsWith('http')) {
          return imageUrl;
     }

     // If it's a filename, convert to consistent path
     if (imageUrl && !imageUrl.startsWith('/')) {
          return `/product-images/${imageUrl}`;
     }

     return imageUrl;
};

export const getProducts = async (req, res) => {
     try {
          const products = await prisma.product.findMany({
               include: {
                    category: true
               }
          });

          // Normalize image URLs before sending response
          const productsWithNormalizedUrls = products.map(product => ({
               ...product,
               image_url: normalizeImageUrl(product.image_url)
          }));

          res.json(productsWithNormalizedUrls);
     } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ error: 'Internal server error' });
     }
};

export const createProduct = async (req, res) => {
     const { name, description, category_id, purchase_price, selling_price, quantity, image_url } = req.body;

     try {
          const normalizedImageUrl = normalizeImageUrl(image_url);

          const newProduct = await prisma.product.create({
               data: {
                    name,
                    description: description || null,
                    purchase_price: parseFloat(purchase_price),
                    selling_price: selling_price ? parseFloat(selling_price) : parseFloat(purchase_price) * 1.1,
                    quantity: parseInt(quantity),
                    image_url: normalizedImageUrl,
                    category_id: category_id ? parseInt(category_id) : null
               },
               include: {
                    category: true
               }
          });

          res.status(201).json(newProduct);
     } catch (error) {
          console.error('Error creating product:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Product name already exists' });
          }

          res.status(400).json({ error: 'Failed to create product: ' + error.message });
     }
};

export const updateProduct = async (req, res) => {
     const { id } = req.params;
     const { name, description, category_id, purchase_price, selling_price, quantity, image_url } = req.body;

     try {
          const normalizedImageUrl = normalizeImageUrl(image_url);

          const updatedProduct = await prisma.product.update({
               where: { id: parseInt(id) },
               data: {
                    name,
                    description: description || null,
                    purchase_price: parseFloat(purchase_price),
                    selling_price: parseFloat(selling_price),
                    quantity: parseInt(quantity),
                    image_url: normalizedImageUrl,
                    category_id: parseInt(category_id)
               },
               include: {
                    category: true
               }
          });

          res.json(updatedProduct);
     } catch (error) {
          console.error('Error updating product:', error);

          if (error.code === 'P2002') {
               return res.status(400).json({ error: 'Product name or QR code already exists' });
          }

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Product not found' });
          }

          res.status(400).json({ error: 'Failed to update product' });
     }
};

export const deleteProduct = async (req, res) => {
     const { id } = req.params;

     try {
          await prisma.product.delete({
               where: { id: parseInt(id) }
          });
          res.status(204).send();
     } catch (error) {
          console.error('Error deleting product:', error);

          if (error.code === 'P2025') {
               return res.status(404).json({ error: 'Product not found' });
          }

          res.status(400).json({ error: 'Failed to delete product' });
     }
};