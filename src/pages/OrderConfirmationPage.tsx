import React from 'react';
import { CheckCircle2, ArrowRight, Printer, Package, Truck, ShieldCheck, Home } from 'lucide-react';
import { Order } from '../types/index.ts';
import { ProductImage } from '../components/ProductImage.tsx';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onViewAdminOrders: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
  onViewAdminOrders
}) => {
  const steps: Order['status'][] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status) >= 0 ? steps.indexOf(order.status) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
          Order Verified & Placed
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Thank you for choosing Bin Electronics!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          An automated receipt and tracking instructions have been dispatched to{' '}
          <strong className="text-white">{order.customer.email}</strong>.
        </p>
      </div>

      {/* Order Status Tracker */}
      <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Order ID: </span>
            <span className="font-mono font-bold text-white text-sm">{order.id}</span>
          </div>
          <div>
            <span className="text-slate-500">Order Date: </span>
            <span className="text-slate-300">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Status: </span>
            <span className="font-semibold text-blue-400">{order.status}</span>
          </div>
        </div>

        {/* Linear Stepper */}
        <div className="relative pt-2">
          <div className="grid grid-cols-5 text-center text-xs gap-1">
            {steps.map((st, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={st} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-medium hidden sm:inline ${
                      isCurrent ? 'text-blue-400' : isPassed ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping Summary */}
        <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-4 text-xs">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Shipping Address</span>
          </h3>
          <div className="space-y-1 text-slate-300 leading-relaxed">
            <p className="font-semibold text-white">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.state} {order.customer.postalCode}
            </p>
            <p>{order.customer.country}</p>
            <p className="text-slate-500 pt-1">Phone: {order.customer.phone}</p>
          </div>
        </div>

        {/* Payment & Assurance Summary */}
        <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-4 text-xs">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Payment & Guarantee</span>
          </h3>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="uppercase font-medium text-white">
                {order.paymentMethod.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="text-emerald-400 font-semibold uppercase">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Warranty Coverage:</span>
              <span className="text-blue-400 font-medium">2-Year Official Bin Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-400" />
          <span>Purchased Hardware ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.variationId}`} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#07090e] border border-slate-800 p-1 flex items-center justify-center shrink-0">
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
                <div>
                  <h4 className="font-semibold text-white">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.colorCode }}
                    />
                    <span>Finish: {item.colorName}</span>
                    <span>· Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="font-mono font-semibold text-white">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-slate-200">${order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount</span>
              <span className="font-mono">-${order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span className="font-mono text-slate-200">
              {order.shipping === 0 ? 'FREE' : `$${order.shipping}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
            <span>Total Paid</span>
            <span className="font-mono text-blue-400 text-base">${order.total}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
        <button
          onClick={onViewAdminOrders}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-blue-400 border border-blue-500/30 font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Track in Admin Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
