import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Check } from 'lucide-react';
import { Product, ProductVariation } from '../types/index.ts';
import { ProductImage } from './ProductImage.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatRupee } from '../utils/currency.ts';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, variation?: ProductVariation) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedVariation, setSelectedVariation] = useState<ProductVariation>(
    product.variations && product.variations.length > 0 ? product.variations[0] : {
      id: 'default',
      productId: product.id,
      colorName: 'Standard',
      colorCode: '#2563eb',
      mainImage: product.mainImage,
      galleryImages: [],
      stock: product.stock,
      price: product.price
    }
  );

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentPrice = selectedVariation.price !== undefined ? selectedVariation.price : product.price;
  const isOutOfStock = selectedVariation.stock <= 0;
  const isLowStock = selectedVariation.stock > 0 && selectedVariation.stock <= 6;

  const handleColorClick = (e: React.MouseEvent, variation: ProductVariation) => {
    e.stopPropagation();
    setSelectedVariation(variation);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      showToast(`${product.name} in ${selectedVariation.colorName} is out of stock.`, 'error');
      return;
    }
    addToCart(product, selectedVariation, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? `Removed from wishlist.` : `Saved to wishlist!`, 'info');
  };

  return (
    <div
      onClick={() => onSelectProduct(product, selectedVariation)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#0b0f17] rounded-2xl border border-slate-800/80 hover:border-blue-500/40 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer"
    >
      <div>
        {/* Visual Showcase Top */}
        <div className="relative w-full aspect-square bg-[#07090e] rounded-xl overflow-hidden border border-slate-800/60 p-4 flex items-center justify-center">
          {/* Subtle Glow Backdrop */}
          <div
            className="absolute inset-0 opacity-20 blur-2xl transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${selectedVariation.colorCode || '#3b82f6'} 0%, transparent 70%)`
            }}
          />

          {/* Product Image Renderer */}
          <ProductImage
            category={product.category}
            colorCode={selectedVariation.colorCode}
            colorName={selectedVariation.colorName}
            productName={product.name}
            src={selectedVariation.mainImage || product.mainImage}
            alt={`${product.name} in ${selectedVariation.colorName}`}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 relative z-10"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-20 ${
              isWishlisted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-900'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* New / Sale Tag - Zero-pill clean text indicator */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 text-[11px] font-mono">
            {product.discount > 0 && (
              <span className="text-blue-400 font-bold bg-[#0b0f17]/80 px-2 py-0.5 rounded border border-blue-500/30 backdrop-blur-sm">
                -{product.discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="text-violet-400 font-bold bg-[#0b0f17]/80 px-2 py-0.5 rounded border border-violet-500/30 backdrop-blur-sm">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Color Variation Dots Swatches */}
        {product.variations && product.variations.length > 1 && (
          <div className="flex items-center gap-1.5 mt-3.5 px-0.5">
            {product.variations.map((v) => {
              const active = v.id === selectedVariation.id;
              return (
                <button
                  key={v.id}
                  onClick={(e) => handleColorClick(e, v)}
                  title={`${v.colorName} (${v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'})`}
                  className={`relative w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                    active ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0b0f17] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorCode }}
                >
                  {active && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        v.colorName.toLowerCase().includes('white') ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
            <span className="text-[11px] text-slate-500 ml-1.5 truncate">
              {selectedVariation.colorName}
            </span>
          </div>
        )}

        {/* Product Meta & Name */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-slate-500 uppercase tracking-wider text-[11px] font-medium">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-mono font-medium text-slate-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h3 className="font-display font-semibold text-sm md:text-base text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA Bottom */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-base md:text-lg text-white">
              {formatRupee(currentPrice)}
            </span>
            {product.originalPrice > currentPrice && (
              <span className="font-mono text-xs text-slate-500 line-through">
                {formatRupee(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Stock status indicator */}
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isOutOfStock ? (
              <span className="text-rose-400">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-400">Only {selectedVariation.stock} left</span>
            ) : (
              <span className="text-emerald-400">In Stock</span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-md shadow-blue-600/30 hover:shadow-blue-500/50'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
