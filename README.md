# Bin Electronics — Modern Premium E-Commerce Platform

A futuristic, high-performance electronics e-commerce store with real-time inventory tracking, multi-angle gallery image uploads, dynamic color variation switching, atomic order fulfillment, and a complete administrative dashboard.

---

## 🚀 How to Publish & Make Live on GitHub

### Option 1: Automatic 1-Click GitHub Pages (Recommended)
This repository already includes an automated GitHub Actions deployment workflow in `.github/workflows/deploy.yml`.

1. Push or export this repository to **GitHub**.
2. Go to your repository on GitHub and click **Settings**.
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
5. Push any commit to `main` (or click **Actions** -> **Deploy to GitHub Pages** -> **Run workflow**).
6. Your site will automatically build and be live at `https://<your-username>.github.io/<your-repo>/`!

> **Note on Base Paths**: `vite.config.ts` has been configured with `base: './'` so that all assets, styles, and scripts load flawlessly on any GitHub Pages subpath as well as custom domains.

---

### Option 2: Full-Stack Cloud Deployment (Cloud Run / Render / Railway / VPS)
For the full Express backend with persistent server filesystem uploads and live atomic stock database:

```bash
# 1. Install dependencies
npm install

# 2. Build frontend assets
npm run build

# 3. Start production server
npm start
```
The server will start on port `3000` (or `PORT` environment variable) and serve both the API routes (`/api/*`) and the frontend single-page application.

---

### Option 3: Deploying on Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The client will automatically operate in high-performance resilient mode with bundled seed hardware catalog and persistent offline storage.

---

## 🔐 Default Admin Credentials

- **Admin Portal URL**: Click the **Admin/User** icon in the header or visit `/admin-login`
- **Email**: `admin@binelectronics.com`
- **Password**: `BinAdmin2026!`
- A quick **"Use Demo Admin Credentials"** button is also available on the login page.

---

## 🛠 Local Development

```bash
# Start full-stack development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## ✨ Key Features
- **Dynamic Colorway System**: Selecting a color immediately updates the active product photo and dedicated angle gallery.
- **Persistent Media Uploads**: Admin panel supports uploading cover images and multiple gallery shots with reordering controls.
- **Atomic Order Processing**: Validates real-time stock levels and automatically adjusts inventory when orders are placed or cancelled.
- **Responsive Dark Cyber Aesthetic**: Built with Tailwind CSS, subtle electric blue & violet highlights, and zero-pill typographic discipline.
