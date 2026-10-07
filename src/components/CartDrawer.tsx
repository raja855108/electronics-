import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { ProductImage } from './ProductImage.tsx';
import { formatRupee } from '../utils/currency.ts';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    discount,
    total,
    totalItems,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = React.useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f17] border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="font-display font-semibold text-lg text-white">Your Cart</h2>
              <span className="text-xs text-slate-400 font-mono">({totalItems} items)</span>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-slate-300">Your bag is empty</p>
                  <p className="text-xs text-slate-500">Discover premium electronics built for peak performance.</p>
                </div>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onContinueShopping();
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors inline-block"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variationId}`}
                  className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex gap-3.5 group transition-colors hover:border-slate-700"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-[#080b12] border border-slate-800 shrink-0 overflow-hidden relative flex items-center justify-center">
                    <ProductImage
                      category=""
                      colorCode={item.colorCode}
                      colorName={item.colorName}
                      productName={item.productName}
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 truncate" title={item.productName}>
                        {item.productName}
                      </h4>
                      {/* Zero-pill unboxed variation meta */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0"
                          style={{ backgroundColor: item.colorCode }}
                        />
                        <span className="truncate">{item.colorName}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="font-mono text-slate-300">{formatRupee(item.price)}</span>
                      </div>
                    </div>

                    {/* Quantity controls and delete */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variationId, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variationId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-white">
                          {formatRupee(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variationId)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#090d16] space-y-4">
              {/* Promo code form */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-400 font-mono font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Coupon: {couponCode}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-400 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. BIN10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">{formatRupee(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatRupee(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-slate-200">
                    {shipping === 0 ? 'FREE' : formatRupee(shipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-semibold text-white">
                  <span>Total</span>
                  <span className="font-mono text-base text-blue-400">{formatRupee(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    onContinueShopping();
                  }}
                  className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust assurance */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout · 2-Year Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
