import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { Product, Category, ProductVariation, Order } from './types/index.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { SupportPage } from './pages/SupportPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.tsx';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.tsx';

function MainApp() {
  const { isAuthenticated, logout } = useAdminAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation router state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  // Active product for detail page
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(undefined);

  // Placed order for confirmation page
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Admin selected order for inspector
  const [adminInspectOrder, setAdminInspectOrder] = useState<Order | null>(null);

  // Search input query
  const [searchQuery, setSearchQuery] = useState('');

  // Initial data fetch
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error('Failed to load initial catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigateTo = (page: string, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product, variation?: ProductVariation) => {
    setSelectedProduct(product);
    setSelectedVariation(variation);
    navigateTo('product-detail', { id: product.id });
  };

  const handleOrderCompleted = (order: Order) => {
    setPlacedOrder(order);
    navigateTo('order-confirmed');
    // Refresh catalog stock
    fetchData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a0f] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        onProceedToCheckout={() => navigateTo('checkout')}
        onContinueShopping={() => navigateTo('shop')}
      />

      {/* Admin Navigation Sub-Bar when inside admin */}
      {currentPage.startsWith('admin') && isAuthenticated && (
        <div className="bg-[#0b0f17] border-b border-slate-800/80 px-4 sm:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-slate-500 font-mono hidden sm:inline">Admin Space:</span>
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  currentPage === 'admin-dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('admin-products')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  currentPage === 'admin-products'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Products & Variations
              </button>
              <button
                onClick={() => navigateTo('admin-orders')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  currentPage === 'admin-orders'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Orders Fulfillment
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="text-slate-400 hover:text-white text-xs transition-colors"
              >
                View Storefront ↗
              </button>
              <button
                onClick={() => {
                  logout();
                  navigateTo('home');
                }}
                className="text-rose-400 hover:text-rose-300 text-xs transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Routing */}
      <main className="flex-1">
        {loading ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs text-slate-400">Initializing Bin Electronics Core...</p>
          </div>
        ) : (
          <>
            {/* 1. HOMEPAGE */}
            {currentPage === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {/* 2. SHOP / ALL PRODUCTS */}
            {currentPage === 'shop' && (
              <ShopPage
                products={products}
                categories={categories}
                initialCategory={pageParams.category}
                initialSearch={pageParams.search}
                initialFilter={pageParams.filter}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {/* 2.5 CATEGORIES QUICK VIEW */}
            {currentPage === 'categories' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                    Ecosystem Architecture
                  </span>
                  <h1 className="font-display font-bold text-3xl text-white">
                    Product Categories
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => navigateTo('shop', { category: cat.name })}
                      className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {cat.description || 'Precision engineered consumer electronics hardware.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                        <span className="font-mono text-slate-500">{cat.itemCount || 0} Models</span>
                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-medium">
                          Browse Collection →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PRODUCT DETAILS */}
            {currentPage === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                initialVariation={selectedVariation}
                allProducts={products}
                onBack={() => navigateTo('shop')}
                onSelectProduct={handleSelectProduct}
                onProceedToCheckout={() => navigateTo('checkout')}
              />
            )}

            {/* 4. CART PAGE */}
            {currentPage === 'cart' && (
              <CartPage
                onContinueShopping={() => navigateTo('shop')}
                onProceedToCheckout={() => navigateTo('checkout')}
              />
            )}

            {/* 5. CHECKOUT PAGE */}
            {currentPage === 'checkout' && (
              <CheckoutPage
                onOrderCompleted={handleOrderCompleted}
                onBackToCart={() => navigateTo('cart')}
              />
            )}

            {/* 6. ORDER CONFIRMATION */}
            {currentPage === 'order-confirmed' && placedOrder && (
              <OrderConfirmationPage
                order={placedOrder}
                onContinueShopping={() => navigateTo('shop')}
                onViewAdminOrders={() => navigateTo('admin-orders')}
              />
            )}

            {/* 7. ADMIN LOGIN */}
            {currentPage === 'admin-login' && (
              <AdminLoginPage
                onSuccess={() => navigateTo('admin-dashboard')}
                onBackToStore={() => navigateTo('home')}
              />
            )}

            {/* 8. ADMIN DASHBOARD */}
            {currentPage === 'admin-dashboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!isAuthenticated ? (
                  <AdminLoginPage
                    onSuccess={() => navigateTo('admin-dashboard')}
                    onBackToStore={() => navigateTo('home')}
                  />
                ) : (
                  <AdminDashboardPage
                    onNavigateTab={(tab) => navigateTo(tab === 'products' ? 'admin-products' : 'admin-orders')}
                    onViewOrderDetails={(ord) => {
                      setAdminInspectOrder(ord);
                      navigateTo('admin-orders');
                    }}
                  />
                )}
              </div>
            )}

            {/* 9. ADMIN PRODUCT MANAGEMENT */}
            {currentPage === 'admin-products' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!isAuthenticated ? (
                  <AdminLoginPage
                    onSuccess={() => navigateTo('admin-products')}
                    onBackToStore={() => navigateTo('home')}
                  />
                ) : (
                  <AdminProductsPage
                    categories={categories}
                    onRefreshData={fetchData}
                  />
                )}
              </div>
            )}

            {/* 10. ADMIN ORDER MANAGEMENT */}
            {currentPage === 'admin-orders' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!isAuthenticated ? (
                  <AdminLoginPage
                    onSuccess={() => navigateTo('admin-orders')}
                    onBackToStore={() => navigateTo('home')}
                  />
                ) : (
                  <AdminOrdersPage
                    initialSelectedOrder={adminInspectOrder}
                    onClearSelectedOrder={() => setAdminInspectOrder(null)}
                  />
                )}
              </div>
            )}

            {/* 11. SUPPORT / TRACK ORDER */}
            {currentPage === 'support' && (
              <SupportPage
                initialTab={pageParams.tab || 'faq'}
                onNavigate={navigateTo}
              />
            )}

            {/* 12. ABOUT */}
            {currentPage === 'about' && (
              <AboutPage onNavigateToShop={() => navigateTo('shop')} />
            )}
          </>
        )}
      </main>

      {/* Global Premium Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AdminAuthProvider>
          <MainApp />
        </AdminAuthProvider>
      </CartProvider>
    </ToastProvider>
  );
}
