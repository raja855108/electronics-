import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Persistent uploads storage directory
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media statically
app.use('/uploads', express.static(UPLOADS_DIR));

app.use(express.json({ limit: '50mb' }));

// Authentication middleware helper for admin routes
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || !db.verifyAdmin(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin credentials' });
  }
  next();
}

// ---------------- API ENDPOINTS ---------------- //

// Image Upload Endpoint (Saves to persistent uploads directory)
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename, data, contentType } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Match base64 payload
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      else if (mime.includes('gif')) ext = 'gif';
      else ext = 'jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      // Direct raw base64 string
      buffer = Buffer.from(data, 'base64');
      if (filename && filename.includes('.')) {
        ext = filename.split('.').pop() || 'jpg';
      }
    }

    // Generate clean unique filename
    const cleanBase = (filename || 'product_image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueName = `bin_${cleanBase}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Upload processing error:', err);
    return res.status(500).json({ error: 'Failed to save uploaded image: ' + err.message });
  }
});

// Image Deletion Endpoint (Removes from persistent disk)
app.delete('/api/upload/:filename', requireAdmin, (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Image deleted from disk' });
    }
    return res.json({ success: true, message: 'File not found or already deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete file: ' + err.message });
  }
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Demo secure admin credentials
  if (email === 'admin@binelectronics.com' && password === 'BinAdmin2026!') {
    return res.json({
      success: true,
      token: 'bin_admin_secret_token_2026',
      user: {
        email: 'admin@binelectronics.com',
        role: 'SUPER_ADMIN',
        name: 'Bin Operations Admin'
      }
    });
  }
  return res.status(401).json({ error: 'Invalid admin email or password' });
});

// Admin Metrics
app.get('/api/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
  const metrics = db.getMetrics();
  res.json(metrics);
});

// Products: List with filters
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, featured } = req.query;
  const products = db.getProducts({
    category: category ? String(category) : undefined,
    search: search ? String(search) : undefined,
    sort: sort ? String(sort) : undefined,
    featured: featured === 'true'
  });
  res.json(products);
});

// Products: Get Single
app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Products: Create
app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const productData = req.body;
  if (!productData.name || !productData.price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }
  const id = productData.id || `bin-${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
  const slug = productData.slug || id;
  const newProduct = {
    ...productData,
    id,
    slug
  };
  const saved = db.saveProduct(newProduct);
  res.status(201).json(saved);
});

// Products: Update
app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const existing = db.getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const updated = db.saveProduct({ ...existing, ...req.body, id: existing.id });
  res.json(updated);
});

// Products: Delete
app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Categories: List
app.get('/api/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json(categories);
});

// Categories: Add
app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  const category = db.addCategory({ name, description });
  res.status(201).json(category);
});

// Categories: Delete
app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteCategory(req.params.id);
  res.json({ success: deleted });
});

// Orders: Customer Create Order (Atomic stock deduction)
app.post('/api/orders', (req: Request, res: Response) => {
  const orderData = req.body;
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }
  if (!orderData.customer || !orderData.customer.fullName || !orderData.customer.address) {
    return res.status(400).json({ error: 'Shipping details are incomplete' });
  }

  const result = db.createOrder(orderData);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.order);
});

// Orders: Get All (Admin)
app.get('/api/orders', requireAdmin, (req: Request, res: Response) => {
  const { search, status } = req.query;
  const orders = db.getOrders(search ? String(search) : undefined, status ? String(status) : undefined);
  res.json(orders);
});

// Orders: Get By ID (Customer or Admin)
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Orders: Update Status (Admin)
app.patch('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', brand: 'Bin Electronics', timestamp: new Date().toISOString() });
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ---------------- //
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bin Electronics] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
