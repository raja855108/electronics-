import React, { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, ArrowRight, RefreshCw, Eye, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { AdminMetrics, Order } from '../../types/index.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { formatRupee } from '../../utils/currency.ts';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: 'products' | 'orders') => void;
  onViewOrderDetails: (order: Order) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onViewOrderDetails
}) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err: any) {
      showToast(err.message || 'Error fetching metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  const handleQuickStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      fetchMetrics();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading && !metrics) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading operations telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Operations & Executive Overview
          </span>
          <h1 className="font-display font-bold text-3xl text-white mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Gross Sales</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {formatRupee(metrics?.totalSales || 0)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Real-time settled orders</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Customer Orders</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {metrics?.totalOrders || 0}
          </div>
          <div className="text-[11px] text-slate-500">
            Across global distribution
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Catalog Products</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {metrics?.totalProducts || 0}
          </div>
          <div className="text-[11px] text-slate-500">
            Hardware skus & variations
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Low Stock Alerts</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-400">
            {metrics?.lowStockCount || 0}
          </div>
          <div className="text-[11px] text-amber-400/80">
            Requires inventory replenishment
          </div>
        </div>
      </div>

      {/* Two-Column Tables: Recent Orders & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-display font-semibold text-lg text-white">
              Recent Orders
            </h2>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No orders logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items / Finish</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-900/40">
                      <td className="py-3 font-mono font-semibold text-white">
                        {order.id}
                      </td>
                      <td className="py-3 text-slate-300">
                        <div>{order.customer.fullName}</div>
                        <div className="text-[10px] text-slate-500">{order.customer.email}</div>
                      </td>
                      <td className="py-3 text-slate-300">
                        {order.items.map((it) => (
                          <div key={it.variationId} className="truncate max-w-[150px]">
                            {it.productName} ({it.colorName}) ×{it.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 font-mono font-bold text-white">
                        {formatRupee(order.total)}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value as Order['status'])}
                          className="bg-slate-900 border border-slate-800 text-[11px] text-slate-200 py-1 px-2 rounded-md focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onViewOrderDetails(order)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-display font-semibold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low-Stock Inventory</span>
            </h2>
          </div>

          {!metrics?.lowStockProducts || metrics.lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400/80">
              All variations have healthy warehouse levels.
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.lowStockProducts.map((p, idx) => (
                <div
                  key={`${p.productId}-${idx}`}
                  className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-white truncate">{p.productName}</h4>
                    {p.variationName && (
                      <span className="text-[11px] text-amber-400">Color: {p.variationName}</span>
                    )}
                  </div>
                  <div className="font-mono font-bold text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {p.stock} left
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 font-medium border border-slate-800 transition-colors"
          >
            Adjust Inventory in Product Manager
          </button>
        </div>
      </div>
    </div>
  );
};
