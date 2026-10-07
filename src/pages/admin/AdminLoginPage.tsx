import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToStore }) => {
  const { login } = useAdminAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@binelectronics.com');
  const [password, setPassword] = useState('BinAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      showToast('Admin authentication confirmed. Welcome back!', 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@binelectronics.com');
    setPassword('BinAdmin2026!');
    showToast('Loaded default demo credentials.', 'info');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0b0f17] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 blur-sm" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            Bin Electronics Staff Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access inventory, orders, and hardware variations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Administrator Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Security Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Use Demo Admin Credentials</span>
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
