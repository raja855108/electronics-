import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { Product, Category, ProductVariation } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ProductImage } from '../components/ProductImage.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product, variation?: ProductVariation) => void;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onSelectProduct,
  onNavigate,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Hero flagship product colorway toggle demo
  const flagshipProduct = products.find(p => p.id === 'bin-sonic-pro') || products[0];
  const [heroVariation, setHeroVariation] = useState<ProductVariation>(
    flagshipProduct?.variations?.[2] || flagshipProduct?.variations?.[0] || {
      id: 'default',
      productId: 'bin-sonic-pro',
      colorName: 'Electric Blue',
      colorCode: '#2563eb',
      mainImage: '',
      galleryImages: [],
      stock: 14,
      price: 349
    }
  );

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setSubscribed(true);
      showToast('Welcome to the Bin Electronics Insider club. 10% discount code sent!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-24 md:space-y-32">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Ambient Radial Lighting Effects */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[450px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${heroVariation.colorCode || '#3b82f6'} 0%, #7c3aed 40%, transparent 80%)`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Unboxed natural kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Bin Electronics · Flagship Series 2026</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08] text-balance">
                Power Your World With Better Technology.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Engineered with titanium metallurgy, custom neural silicon, and audiophile-grade acoustic drivers. Experience devices crafted for peak human potential.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <span>Shop Flagship Range</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('shop', { filter: 'featured' })}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Innovations</span>
                </button>
              </div>

              {/* Quick Spec Highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="font-display font-bold text-xl text-white">45 dB</div>
                  <div className="text-xs text-slate-500">Hybrid ANC Depth</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-white">60 Hrs</div>
                  <div className="text-xs text-slate-500">Ultra-Long Playback</div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-white">Lossless</div>
                  <div className="text-xs text-slate-500">LDAC 24-Bit / 96kHz</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Interactive Device Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-slate-900/90 to-[#0b0e17] border border-slate-800/90 p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl group">
                {/* Glowing ambient ring */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none transition-all duration-500"
                  style={{
                    boxShadow: `inset 0 0 60px ${heroVariation.colorCode || '#3b82f6'}`
                  }}
                />

                {/* Top Badge */}
                <div className="flex items-center justify-between text-xs z-10">
                  <span className="font-mono text-slate-400">Model: Sonic Pro ANC</span>
                  <span className="text-blue-400 font-mono font-semibold">${heroVariation.price || 349}</span>
                </div>

                {/* Hero Main Graphic with dynamic colorway update */}
                <div className="relative w-full flex-1 flex items-center justify-center py-4 z-10">
                  <ProductImage
                    category="Audio"
                    colorCode={heroVariation.colorCode}
                    colorName={heroVariation.colorName}
                    productName={flagshipProduct.name}
                    src={heroVariation.mainImage}
                    alt={`${flagshipProduct.name} in ${heroVariation.colorName}`}
                    className="w-full h-full max-h-72 object-contain filter drop-shadow-2xl transition-all duration-300"
                  />
                </div>

                {/* Interactive Color Switcher on Hero */}
                <div className="z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Finish:</span>
                    <span className="text-xs font-semibold text-white">{heroVariation.colorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {flagshipProduct.variations?.map((v) => {
                      const isActive = v.id === heroVariation.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setHeroVariation(v)}
                          title={v.colorName}
                          className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                            isActive
                              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-110'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: v.colorCode }}
                        >
                          {isActive && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                v.colorName.toLowerCase().includes('white') ? 'bg-black' : 'bg-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => onSelectProduct(flagshipProduct, heroVariation)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. FEATURED CATEGORIES ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              Ecosystem
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
              Browse Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 group self-start md:self-auto"
          >
            <span>View All Hardware</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.name })}
              className="p-4 rounded-2xl bg-[#0b0f17] border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between group h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-xs sm:text-sm text-slate-200 group-hover:text-white truncate">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {cat.itemCount ? `${cat.itemCount} items` : 'Explore'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- 3. FEATURED PRODUCTS GRID ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              Hand-Selected
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
              Featured Flagships
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', { filter: 'featured' })}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 group self-start md:self-auto"
          >
            <span>Explore All Flagships</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ---------------- 4. PROMOTIONAL SPOTLIGHT BANNER ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1322] via-[#10172d] to-[#120f26] border border-blue-500/30 p-8 sm:p-12 md:p-16">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Limited Edition Engineering
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Grade 5 Titanium Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every Bin flagship begins as an aerospace ingot. CNC milled with micron tolerances, bead-blasted to an ultra-matte satin finish, and bonded with custom silicon for unrivaled thermal efficiency.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('shop', { search: 'Titanium' })}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Shop Titanium Hardware</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
              >
                Learn Our Craftsmanship
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. NEW ARRIVALS GRID ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">
              Fresh Release
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop', { filter: 'new' })}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 group self-start md:self-auto"
          >
            <span>See All New Gear</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ---------------- 6. WHY CHOOSE BIN ELECTRONICS ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Integrity & Precision
          </span>
          <h2 className="font-display font-bold text-3xl text-white">
            Why Choose Bin Electronics
          </h2>
          <p className="text-sm text-slate-400">
            We reject planned obsolescence. Every product is backed by uncompromised components and dedicated engineering support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Proprietary Silicon</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Custom neural coprocessors tuned specifically for lossless acoustic equalization, sub-millisecond wireless sync, and battery longevity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Direct 2-Year Warranty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every unit includes our international warranty with direct hardware swap coverage and dedicated customer support lines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Sustainable Metallurgy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% recycled rare earth magnets, conflict-free gold plating, and plastic-free unboxing experiences manufactured with clean hydro power.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 7. NEWSLETTER SECTION ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0a0e16] border border-slate-800 p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Join the Bin Electronics Insider
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Receive confidential release schedules, early beta access, and an immediate 10% promotional code for your next order.
            </p>
          </div>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>You're subscribed! Use promo code <strong className="font-mono">BIN10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500">
            Zero spam. Unsubscribe at any time. Respecting your inbox privacy.
          </p>
        </div>
      </section>
    </div>
  );
};
