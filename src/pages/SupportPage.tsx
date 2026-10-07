import React, { useState } from 'react';
import { Shield, Truck, RotateCcw, Headphones, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

interface SupportPageProps {
  initialTab?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ initialTab = 'faq', onNavigate }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been assigned a priority engineering ticket.', 'success');
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderId.trim()) return;
    setTrackLoading(true);
    try {
      const res = await fetch(`/api/orders/${trackOrderId.trim().toUpperCase()}`);
      if (!res.ok) throw new Error('Order ID not found. Please verify the code on your receipt.');
      const data = await res.json();
      setTrackingResult(data);
      showToast(`Order found: Status is ${data.status}`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
      setTrackingResult(null);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
          Dedicated Customer Assistance
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Bin Electronics Support Center
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Hardware documentation, global tracking, international warranty claims, and 24/7 technical assistance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        {[
          { id: 'faq', label: 'Frequently Asked Questions' },
          { id: 'track', label: 'Track Order' },
          { id: 'warranty', label: 'Bin Care 2-Year Warranty' },
          { id: 'shipping', label: 'Shipping & Delivery' },
          { id: 'returns', label: 'Returns & Refunds' },
          { id: 'contact', label: 'Contact Engineers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setTrackingResult(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap font-medium ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 sm:p-10">
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white">Frequently Asked Questions</h2>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <h3 className="font-semibold text-white text-sm">How do color variations work for Bin hardware?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every color variation (Midnight Black, Arctic White, Electric Blue, etc.) is anodized or coated with micro-ceramic precision. Selecting a color switches the live studio render and allocates inventory from that specific colorway's dedicated production lot.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <h3 className="font-semibold text-white text-sm">What is the Bin Care 2-Year Warranty?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every product shipped includes comprehensive warranty protection covering internal driver failure, battery capacity degradation below 80%, neural chip failure, and free replacement parts for two calendar years.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <h3 className="font-semibold text-white text-sm">How fast is global shipping?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Orders placed before 3:00 PM EST ship same-day via tracked priority air couriers (FedEx International Priority & DHL Express). Average delivery time is 2 business days in North America & Europe, and 3-4 days worldwide.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <h3 className="font-semibold text-white text-sm">Can I return my order if I am not satisfied?</h3>
                <p className="text-slate-400 leading-relaxed">
                  Yes. We provide a 30-day risk-free in-home trial. If the hardware does not exceed your expectations, initiate a return for a 100% full refund with prepaid return shipping labels provided.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Track Order Tab */}
        {activeTab === 'track' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <Truck className="w-8 h-8 text-blue-400 mx-auto" />
              <h2 className="font-display font-bold text-xl text-white">Track Your Consignment</h2>
              <p className="text-xs text-slate-400">
                Enter your unique Order Reference ID (e.g. BIN-2026-9812 or from your recent checkout) to retrieve real-time fulfillment status.
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Order ID (e.g. BIN-2026-9812)"
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white uppercase font-mono placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shrink-0"
              >
                {trackLoading ? 'Searching...' : 'Locate Order'}
              </button>
            </form>

            {trackingResult && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-mono font-bold text-white text-sm">{trackingResult.id}</span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                    {trackingResult.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Destination:</span>
                  <p className="text-slate-200">
                    {trackingResult.customer.fullName} — {trackingResult.customer.city}, {trackingResult.customer.country}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-500">Items:</span>
                  {trackingResult.items.map((it: any) => (
                    <div key={it.variationId} className="flex justify-between text-slate-300">
                      <span>{it.productName} ({it.colorName}) ×{it.quantity}</span>
                      <span className="font-mono">${it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warranty Tab */}
        {activeTab === 'warranty' && (
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            <h2 className="font-display font-bold text-xl text-white">Bin Care 2-Year International Warranty</h2>
            <p>
              All Bin Electronics products purchased directly through our official channels or authorized retail partners include 24 months of worldwide comprehensive hardware coverage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <h4 className="font-semibold text-white">What Is Protected:</h4>
                <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                  <li>Acoustic driver mechanical and magnetic degradation</li>
                  <li>Bluetooth and Wi-Fi RF module connectivity dropouts</li>
                  <li>Battery capacity decline below 80% within 24 months</li>
                  <li>Structural hinge failure and micro-soldering defects</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <h4 className="font-semibold text-white">Replacement Process:</h4>
                <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                  <li>Direct swap dispatched upon courier return scan</li>
                  <li>Zero processing or diagnosis fees</li>
                  <li>Pre-paid shipping labels generated worldwide</li>
                  <li>Same color variation guaranteed for replacements</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            <h2 className="font-display font-bold text-xl text-white">Shipping & Worldwide Logistics</h2>
            <p>
              We maintain automated fulfillment centers in San Francisco, Frankfurt, and Singapore. All consignments are sealed in tamper-evident electrostatic packaging.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span>Free Express Shipping Threshold</span>
                <span className="font-mono text-emerald-400 font-semibold">Orders $150 and above</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span>Standard Delivery (Under $150)</span>
                <span className="font-mono text-white">$15 Flat Rate (Air Courier)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span>Dispatch Cutoff</span>
                <span className="text-white">Same-day dispatch before 3:00 PM EST</span>
              </div>
            </div>
          </div>
        )}

        {/* Returns Tab */}
        {activeTab === 'returns' && (
          <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
            <h2 className="font-display font-bold text-xl text-white">30-Day Hassle-Free Returns</h2>
            <p>
              We want you to experience Bin Electronics in your natural workflow. Try our headphones, workstations, or mobile devices for 30 full days.
            </p>
            <p>
              If you decide to return your unit, simply request a return label. We will credit your original payment method in full within 48 hours of return receipt.
            </p>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-1">
              <Headphones className="w-8 h-8 text-blue-400 mx-auto" />
              <h2 className="font-display font-bold text-xl text-white">Contact Hardware Support</h2>
              <p className="text-xs text-slate-400">Our engineering technicians respond within 4 hours.</p>
            </div>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="font-semibold text-white text-sm">Message Transmitted</h4>
                <p>We've logged your request. A Bin Electronics hardware engineer will reply to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Hardware Model / Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Sonic Pro ANC firmware question"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25"
                >
                  Send Inquiry to Engineering Support
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
