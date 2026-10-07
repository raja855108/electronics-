import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, CheckCircle2, Clock, Truck, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.ts';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { ProductImage } from '../../components/ProductImage.tsx';
import { formatRupee } from '../../utils/currency.ts';

interface AdminOrdersPageProps {
  initialSelectedOrder?: Order | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  initialSelectedOrder,
  onClearSelectedOrder
}) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inspectOrder, setInspectOrder] = useState<Order | null>(initialSelectedOrder || null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'all'
        ? `/api/orders?status=${statusFilter}`
        : '/api/orders';
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (initialSelectedOrder) {
      setInspectOrder(initialSelectedOrder);
    }
  }, [initialSelectedOrder]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
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
      const updated = await res.json();

      showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (inspectOrder && inspectOrder.id === orderId) {
        setInspectOrder(updated);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Order Fulfillment & Logistics
          </span>
          <h1 className="font-display font-bold text-3xl text-white mt-1">
            Customer Orders
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0b0f17] rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0b0f17] rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Purchased Items & Variations</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white text-sm">{order.id}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div className="font-semibold text-white">{order.customer.fullName}</div>
                      <div className="text-[11px] text-slate-500">{order.customer.email}</div>
                      <div className="text-[10px] text-slate-500">{order.customer.city}, {order.customer.country}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.variationId} className="flex items-center gap-1.5 text-[11px]">
                            <span
                              className="w-2 h-2 rounded-full border border-slate-700 shrink-0"
                              style={{ backgroundColor: item.colorCode }}
                            />
                            <span className="truncate max-w-[180px] font-medium text-slate-200">
                              {item.productName}
                            </span>
                            <span className="text-slate-400">({item.colorName})</span>
                            <span className="font-mono text-slate-400 font-bold">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                      {formatRupee(order.total)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-slate-300 uppercase">
                        {order.paymentMethod.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-emerald-400 block font-mono">
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : order.status === 'Shipped'
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspector Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Order Details: {inspectOrder.id}
                </h2>
                <span className="text-xs text-slate-400">
                  Placed on {new Date(inspectOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  setInspectOrder(null);
                  if (onClearSelectedOrder) onClearSelectedOrder();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Current Status</span>
                <span className="text-sm font-semibold text-white">{inspectOrder.status}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Change Status:</span>
                <select
                  value={inspectOrder.status}
                  onChange={(e) => handleUpdateStatus(inspectOrder.id, e.target.value as OrderStatus)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white py-1 px-3 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <h4 className="font-semibold text-white">Customer Information</h4>
                <p className="text-slate-300 font-medium">{inspectOrder.customer.fullName}</p>
                <p className="text-slate-400">{inspectOrder.customer.email}</p>
                <p className="text-slate-400">{inspectOrder.customer.phone}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                <h4 className="font-semibold text-white">Fulfillment Address</h4>
                <p className="text-slate-300">{inspectOrder.customer.address}</p>
                <p className="text-slate-300">
                  {inspectOrder.customer.city}, {inspectOrder.customer.state} {inspectOrder.customer.postalCode}
                </p>
                <p className="text-slate-400">{inspectOrder.customer.country}</p>
              </div>
            </div>

            {/* Ordered Items with specific variation colors */}
            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-white">
                Ordered Products & Variations ({inspectOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
                {inspectOrder.items.map((it) => (
                  <div key={it.variationId} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#07090e] border border-slate-800 p-1 flex items-center justify-center shrink-0">
                        <ProductImage
                          category=""
                          colorCode={it.colorCode}
                          colorName={it.colorName}
                          productName={it.productName}
                          src={it.image}
                          alt={it.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">{it.productName}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: it.colorCode }}
                          />
                          <span>Variation: {it.colorName}</span>
                          <span>· Qty: {it.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-bold text-white">
                      {formatRupee(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <div className="text-slate-400">
                Payment: <strong className="text-white uppercase">{inspectOrder.paymentMethod}</strong> (Status: <span className="text-emerald-400">{inspectOrder.paymentStatus}</span>)
              </div>
              <div className="font-display font-bold text-lg text-blue-400">
                Total: {formatRupee(inspectOrder.total)}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
