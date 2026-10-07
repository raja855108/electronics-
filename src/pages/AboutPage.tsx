import React from 'react';
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';

interface AboutPageProps {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
          Our Philosophy & Metallurgy
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight text-balance">
          Better Technology For An Uncompromised World.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          Bin Electronics was founded with a singular decree: reject the disposable plastic cycle of modern consumer electronics. Every device we build is sculpted from titanium, sapphire, and custom silicon.
        </p>
      </div>

      {/* Craftsmanship Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-[#0b0f17] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Custom Silicon</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Off-the-shelf processor chips force thermal compromises. Our proprietary coprocessors run low-power neural networks directly on device, guaranteeing ultra-low acoustic latency and unprecedented battery stamina.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0b0f17] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Grade 5 Metallurgy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our headphone hinges and smartphone chassis are forged from aerospace Grade 5 titanium. Bead-blasted to an ultra-fine matte satin finish, they resist scratches, corrosion, and everyday stress for decades.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0b0f17] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">2-Year Direct Care</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Because our hardware is engineered to endure, every customer receives our comprehensive 2-Year Bin Care Warranty. Direct engineer contact lines and immediate hardware replacements worldwide.
          </p>
        </div>
      </div>

      {/* Quote / Mission statement */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-500/20 p-8 sm:p-12 text-center space-y-4">
        <blockquote className="font-display font-semibold text-xl sm:text-2xl text-white max-w-2xl mx-auto leading-relaxed">
          “When you strip away unnecessary gimmicks and invest in pure acoustic geometry and titanium precision, technology ceases to be disposable—it becomes an instrument.”
        </blockquote>
        <div className="text-xs text-blue-400 font-mono">
          Bin Electronics Hardware Design Studio · California & Munich
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateToShop}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xl shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
        >
          <span>Explore The Bin Electronics Hardware Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
