import React from 'react';
import { Shield, Truck, RotateCcw, Headphones, ArrowRight, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#05070b] border-t border-slate-900 text-slate-400 text-sm mt-24">
      {/* Trust Badges Row */}
      <div className="border-b border-slate-900/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Express Global Delivery</h4>
                <p className="text-xs text-slate-500 mt-0.5">Complimentary express shipping on all orders over ₹1,499.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">2-Year Bin Care Warranty</h4>
                <p className="text-xs text-slate-500 mt-0.5">Comprehensive hardware protection and accidental coverage.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-500 mt-0.5">Zero questions asked return policy with prepaid shipping labels.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Direct access to electronics hardware engineers anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-[1.5px]">
                <div className="w-full h-full bg-[#0b0f17] rounded-[7px] flex items-center justify-center font-bold text-blue-400">
                  B
                </div>
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Bin Electronics
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Pioneering high-performance consumer hardware, precision wireless acoustics, and futuristic mobile computing devices engineered with grade-5 titanium and custom silicon.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#twitter" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#instagram" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#github" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-wider text-slate-200 uppercase">
              Hardware
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Audio' })} className="hover:text-blue-400 transition-colors">
                  Audio & Headphones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Smartphones' })} className="hover:text-blue-400 transition-colors">
                  Smartphones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Laptops' })} className="hover:text-blue-400 transition-colors">
                  Workstation Laptops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Smart Watches' })} className="hover:text-blue-400 transition-colors">
                  Smart Watches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Cameras' })} className="hover:text-blue-400 transition-colors">
                  Cinema Cameras
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Gaming' })} className="hover:text-blue-400 transition-colors">
                  Gaming Gear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Support & Company */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-wider text-slate-200 uppercase">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-blue-400 transition-colors">
                  Support Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'shipping' })} className="hover:text-blue-400 transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'returns' })} className="hover:text-blue-400 transition-colors">
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'warranty' })} className="hover:text-blue-400 transition-colors">
                  Bin Care Warranty
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'track' })} className="hover:text-blue-400 transition-colors">
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Admin */}
          <div className="space-y-3">
            <h5 className="font-semibold text-xs tracking-wider text-slate-200 uppercase">
              Organization
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors">
                  About Bin Electronics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'privacy' })} className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support', { tab: 'terms' })} className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="text-slate-500 hover:text-blue-400 transition-colors">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 mt-10 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Bin Electronics Inc. All rights reserved. Precision engineered for tomorrow.
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Bin Core Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Express Fulfillment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
