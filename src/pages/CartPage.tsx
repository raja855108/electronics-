import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { ProductImage } from '../components/ProductImage.tsx';

interface CartPageProps {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onContinueShopping,
  onProceedToCheckout
}) => {
  const {
    cart,
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

  const [inputCoupon, setInputCoupon] = useState('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const freeShippingThreshold = 150;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-white">Your Shopping Cart is Empty</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You haven't added any Bin Electronics hardware to your bag yet. Explore our flagship acoustic drivers, smartphones, and workstations.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-display font-bold text-3xl text-white">
            Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#0b0f17] p-3 rounded-xl border border-slate-800 max-w-xs text-xs space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Free Shipping:</span>
            <span className="font-mono text-blue-400 font-semibold">
              {distanceToFreeShipping === 0 ? 'Unlocked!' : `$${distanceToFreeShipping} away`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.variationId}`}
              className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800/80 flex flex-col sm:flex-row gap-5 items-center justify-between transition-colors hover:border-slate-700"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-24 h-24 rounded-xl bg-[#07090e] border border-slate-800 shrink-0 overflow-hidden p-2 flex items-center justify-center">
                  <ProductImage
                    category=""
                    colorCode={item.colorCode}
                    colorName={item.colorName}
                    productName={item.productName}
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-white">
                    {item.productName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0"
                      style={{ backgroundColor: item.colorCode }}
                    />
                    <span>Finish: <strong className="text-slate-200">{item.colorName}</strong></span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono">${item.price} each</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Stock available: {item.maxStock} units
                  </div>
                </div>
              </div>

              {/* Quantity Stepper, Price & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.variationId, item.quantity - 1)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-xs font-semibold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variationId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-base text-white">
                    ${item.price * item.quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.variationId)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/90 space-y-6 sticky top-24">
          <h2 className="font-display font-semibold text-lg text-white pb-3 border-b border-slate-800">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <div className="space-y-2">
            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-blue-400 font-mono font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Promo Code: {couponCode}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-slate-400 hover:text-rose-400 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. BIN10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Calculation breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount Applied</span>
                <span className="font-mono">-${discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Insured Express Shipping</span>
              <span className="font-mono text-slate-200">
                {shipping === 0 ? 'FREE' : `$${shipping}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold text-white">
              <span>Estimated Total</span>
              <span className="font-mono text-xl text-blue-400">${total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="space-y-3">
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
