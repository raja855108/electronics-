import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Product, ProductVariation } from '../types/index.ts';
import { ProductImage } from '../components/ProductImage.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface ProductDetailPageProps {
  product: Product;
  initialVariation?: ProductVariation;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product, variation?: ProductVariation) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialVariation,
  allProducts,
  onBack,
  onSelectProduct,
  onProceedToCheckout
}) => {
  const { addToCart, openCartDrawer } = useCart();
  const { showToast } = useToast();

  // Active variation state
  const [activeVariation, setActiveVariation] = useState<ProductVariation>(() => {
    if (initialVariation) return initialVariation;
    if (product.variations && product.variations.length > 0) return product.variations[0];
    return {
      id: 'default',
      productId: product.id,
      colorName: 'Standard',
      colorCode: '#2563eb',
      mainImage: product.mainImage,
      galleryImages: product.galleryImages || [],
      stock: product.stock,
      price: product.price
    };
  });

  // Active gallery image index for the currently selected color
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'shipping'>('specs');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Sync if product prop changes
  useEffect(() => {
    if (initialVariation) {
      setActiveVariation(initialVariation);
    } else if (product.variations && product.variations.length > 0) {
      setActiveVariation(product.variations[0]);
    }
    setSelectedImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, initialVariation]);

  // Compute the full active image gallery for this specific color variation
  const activeColorImages = useMemo(() => {
    const list: string[] = [];

    // Variation's main image first
    if (activeVariation.mainImage && activeVariation.mainImage.trim()) {
      list.push(activeVariation.mainImage);
    } else if (product.mainImage && product.mainImage.trim()) {
      list.push(product.mainImage);
    }

    // Variation's specific gallery images
    if (activeVariation.galleryImages && activeVariation.galleryImages.length > 0) {
      activeVariation.galleryImages.forEach((img) => {
        if (img && img.trim() && !list.includes(img)) list.push(img);
      });
    } else if (product.galleryImages && product.galleryImages.length > 0) {
      // Fallback to general product gallery if variation has no custom gallery
      product.galleryImages.forEach((img) => {
        if (img && img.trim() && !list.includes(img)) list.push(img);
      });
    }

    return list;
  }, [activeVariation, product]);

  const activePrice = activeVariation.price !== undefined ? activeVariation.price : product.price;
  const isOutOfStock = activeVariation.stock <= 0;
  const isLowStock = activeVariation.stock > 0 && activeVariation.stock <= 6;

  // When customer switches color: automatically switch active images!
  const handleVariationChange = (v: ProductVariation) => {
    setActiveVariation(v);
    setSelectedImageIndex(0); // Reset gallery index to main image of new color
    if (quantity > v.stock && v.stock > 0) {
      setQuantity(v.stock);
    }
    showToast(`Switched finish to ${v.colorName}. Displaying assigned gallery.`, 'info');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast(`${product.name} in ${activeVariation.colorName} is out of stock.`, 'error');
      return;
    }
    const success = addToCart(product, activeVariation, quantity);
    if (success) {
      openCartDrawer();
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast(`${product.name} in ${activeVariation.colorName} is out of stock.`, 'error');
      return;
    }
    addToCart(product, activeVariation, quantity);
    onProceedToCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.', 'success');
    }
  };

  const currentDisplayedImageSrc = activeColorImages[selectedImageIndex] || activeVariation.mainImage || product.mainImage || '';

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category.toLowerCase() === product.category.toLowerCase())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isWishlisted
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Product Section: Gallery & Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Multi-Angle Interactive Gallery for the Selected Finish */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
          {/* Vertical/Horizontal Thumbnails Stack for This Active Finish */}
          {activeColorImages.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[520px] pb-2 md:pb-0 shrink-0 w-full md:w-20">
              {activeColorImages.map((imgUrl, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={`${imgUrl}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#070a10] border p-1.5 transition-all overflow-hidden shrink-0 group ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                        : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                    title={`View angle #${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-slate-300 font-mono text-[9px] px-1 rounded">
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Large Central Display Area */}
          <div className="relative flex-1 aspect-square w-full rounded-3xl bg-[#090d16] border border-slate-800/90 overflow-hidden p-6 sm:p-10 flex items-center justify-center shadow-2xl">
            {/* Ambient Dynamic Color Glow */}
            <div
              className="absolute inset-0 opacity-25 blur-3xl pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${activeVariation.colorCode || '#3b82f6'} 0%, transparent 70%)`
              }}
            />

            {/* Main Interactive Product Image */}
            <ProductImage
              category={product.category}
              colorCode={activeVariation.colorCode}
              colorName={activeVariation.colorName}
              productName={product.name}
              src={currentDisplayedImageSrc}
              alt={`${product.name} in ${activeVariation.colorName}`}
              className="w-full h-full max-h-[460px] object-contain relative z-10 transition-all duration-300 transform hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 font-mono text-xs">
              {product.discount > 0 && (
                <span className="text-blue-400 font-bold bg-[#0b0f17]/90 px-2.5 py-1 rounded-md border border-blue-500/30 backdrop-blur-md">
                  -{product.discount}% OFF
                </span>
              )}
              {product.isNewArrival && (
                <span className="text-violet-400 font-bold bg-[#0b0f17]/90 px-2.5 py-1 rounded-md border border-violet-500/30 backdrop-blur-md">
                  NEW RELEASE
                </span>
              )}
            </div>

            {/* Active Variation Indicator Watermark */}
            <div className="absolute bottom-6 right-6 z-20 text-[11px] font-mono text-slate-500">
              COLORWAY: <span className="text-slate-300 uppercase font-semibold">{activeVariation.colorName}</span>
              {activeColorImages.length > 1 && (
                <span className="text-slate-500 ml-1.5 font-normal">
                  ({selectedImageIndex + 1}/{activeColorImages.length})
                </span>
              )}
            </div>

            {/* Next/Prev gallery arrows if multiple shots available */}
            {activeColorImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : activeColorImages.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < activeColorImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors z-20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-mono text-blue-400 font-medium">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono font-semibold text-slate-200">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-[#0b0f17] border border-slate-800/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-extrabold text-3xl text-white">
                ${activePrice}
              </span>
              {product.originalPrice > activePrice && (
                <span className="font-mono text-base text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock indicator badge */}
            <div>
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  Only {activeVariation.stock} Left in {activeVariation.colorName}!
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  In Stock ({activeVariation.stock} units)
                </span>
              )}
            </div>
          </div>

          {/* Color Variation Selector (Swaps gallery and image dynamically) */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-[#0b0f17] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Select Finish / Color:
                </span>
                <span className="font-mono text-blue-400 font-medium">
                  {activeVariation.colorName}
                </span>
              </div>

              {/* Swatch Pills with interactive selection */}
              <div className="flex flex-wrap gap-2.5">
                {product.variations.map((v) => {
                  const isSelected = v.id === activeVariation.id;
                  const isVarOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariationChange(v)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/15 font-semibold ring-1 ring-blue-500'
                          : isVarOut
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: v.colorCode }}
                      />
                      <span>{v.colorName}</span>
                      {isVarOut && <span className="text-[10px] text-rose-400">(Sold out)</span>}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                Selecting a color automatically displays that finish's dedicated studio photography and gallery angles.
              </p>
            </div>
          )}

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-[#0b0f17] border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(activeVariation.stock, quantity + 1))}
                  disabled={quantity >= activeVariation.stock || isOutOfStock}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-blue-500/25 active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                isOutOfStock
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-blue-500/40 text-blue-400 hover:text-blue-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now with Express Checkout</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Complimentary insured shipping (2-3 business days)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official 2-Year Bin Care Warranty included</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>30-Day risk-free return trial window</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Technical Breakdown */}
      <div className="pt-10 border-t border-slate-800">
        <div className="flex items-center gap-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-semibold pb-3 -mb-3 transition-colors relative ${
              activeTab === 'specs' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Technical Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`text-sm font-semibold pb-3 -mb-3 transition-colors relative ${
              activeTab === 'description' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Overview
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`text-sm font-semibold pb-3 -mb-3 transition-colors relative ${
              activeTab === 'shipping' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shipping & Warranty
            {activeTab === 'shipping' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />
            )}
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-[#0b0f17] border border-slate-800/80 flex justify-between items-center text-xs"
                >
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-slate-100 font-mono text-right">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>
                Engineered for enthusiasts who demand zero compromises. Every internal circuit trace has been optimized for low impedance and thermal equilibrium, while outer surfaces employ CNC aerospace grade tooling.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Express Delivery:</strong> Orders placed before 3:00 PM EST ship same-day via tracked priority air couriers. All shipments are fully insured against loss or damage.
              </p>
              <p>
                <strong>Bin Care Warranty:</strong> Includes 2 full years of coverage for hardware defects, battery degradation below 80%, and accidental damage repair at cost price.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              Complementary Hardware
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              Related in {product.category}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
