import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Banknote, Landmark, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { CustomerAddress, Order } from '../types/index.ts';
import { ProductImage } from '../components/ProductImage.tsx';

interface CheckoutPageProps {
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderCompleted,
  onBackToCart
}) => {
  const { cart, subtotal, shipping, discount, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<CustomerAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cod' | 'upi_wire' | 'stripe_demo'>('credit_card');

  // Demo Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fillDemoAddress = () => {
    setFormData({
      fullName: 'Alex Vance',
      email: 'alex.vance@blackmesa.org',
      phone: '+1 (555) 234-5678',
      address: '404 Cybernetics Way, Suite 800',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'United States'
    });
    showToast('Autofilled demo shipping address!', 'info');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setErrorMessage('Please fill in all mandatory shipping address fields.');
      showToast('Please fill in all shipping fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: formData,
        items: cart,
        subtotal,
        shipping,
        discount,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'Confirmed'
      };

      let data: any = null;
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
          data = await response.json();
        } else {
          const errRes = await response.json().catch(() => null);
          if (errRes?.error) {
            throw new Error(errRes.error);
          }
        }
      } catch (networkErr: any) {
        if (networkErr.message && !networkErr.message.includes('fetch')) {
          throw networkErr;
        }
      }

      // If backend was offline or static host (e.g. GitHub Pages), generate persistent local order
      if (!data || !data.id) {
        data = {
          ...orderPayload,
          id: `BIN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
          createdAt: new Date().toISOString()
        };
        try {
          const prev = JSON.parse(localStorage.getItem('bin_offline_orders') || '[]');
          localStorage.setItem('bin_offline_orders', JSON.stringify([data, ...prev]));
        } catch {}
      }

      showToast(`Order ${data.id} confirmed successfully!`, 'success');
      clearCart();
      onOrderCompleted(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while placing your order.');
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400">Add products before proceeding to checkout.</p>
        <button
          onClick={onBackToCart}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToCart}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </button>
          <h1 className="font-display font-bold text-3xl text-white">
            Secure Checkout
          </h1>
        </div>

        <button
          type="button"
          onClick={fillDemoAddress}
          className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition-colors"
        >
          1-Click Demo Address
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address Card */}
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-5">
            <h2 className="font-display font-semibold text-lg text-white flex items-center justify-between">
              <span>1. Shipping Details</span>
              <span className="text-xs font-normal text-slate-500">Air Express Tracked</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. Alex Vance"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-300 font-medium">Street Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="Street name, suite, or building"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">City *</label>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="Austin"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">State / Province</label>
                <input
                  type="text"
                  name="state"
                  placeholder="TX"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Postal / PIN Code *</label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  placeholder="78701"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-white">
                2. Payment Method
              </h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </span>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-semibold">Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi_wire')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  paymentMethod === 'upi_wire'
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Landmark className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-semibold">UPI / Bank Wire</span>
              </button>
            </div>

            {/* Card Inputs Simulation */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">Card Number (Sandbox Simulated)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Expires</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Production ready architecture: Backend is structured to plug into Stripe/Razorpay without exposing secret API keys.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                You will pay cash or card to the courier upon delivery. Verification OTP will be sent to your phone.
              </div>
            )}

            {paymentMethod === 'upi_wire' && (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                Instant UPI QR and Wire instructions will generate upon confirmation.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Placement */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0b0f17] border border-slate-800/90 space-y-6 sticky top-24">
          <h2 className="font-display font-semibold text-lg text-white pb-3 border-b border-slate-800">
            Order Review ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h2>

          {/* Itemized summary */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.variationId}`}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
              >
                <div className="w-12 h-12 rounded-lg bg-[#080b12] border border-slate-800 shrink-0 p-1 flex items-center justify-center">
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
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-200 truncate">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.colorCode }}
                    />
                    <span>{item.colorName}</span>
                    <span>× {item.quantity}</span>
                  </div>
                </div>
                <div className="font-mono font-semibold text-white">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">${subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span className="font-mono">-${discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="font-mono text-slate-200">
                {shipping === 0 ? 'FREE' : `$${shipping}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
              <span>Grand Total</span>
              <span className="font-mono text-xl text-blue-400">${total}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing Hardware & Placing Order...</span>
              ) : (
                <>
                  <span>Place Order (${total})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full buyer protection & instant email receipt</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
