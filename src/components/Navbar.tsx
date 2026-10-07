import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Sparkles, User } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAdminAuth } from '../context/AdminAuthContext.tsx';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string, params?: Record<string, string>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery
}) => {
  const { totalItems, openCartDrawer } = useCart();
  const { isAuthenticated } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'Deals', page: 'shop', params: { filter: 'deals' } },
    { label: 'New Arrivals', page: 'shop', params: { filter: 'new' } },
    { label: 'Support', page: 'support' },
  ];

  const handleNavClick = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page, params);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('shop', { search: searchQuery.trim() });
      setShowSearchInput(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080a0f]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-2.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-extrabold text-lg bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    B
                  </span>
                </div>
              </div>
              <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Bin Electronics
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page && !link.params;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page, link.params)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap py-1 relative ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Admin/Account, Cart) */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Trigger / Bar */}
            {showSearchInput ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search audio, phones, gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 pl-9 pr-8 py-1.5 rounded-lg border border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="text-slate-400 hover:text-white absolute right-2.5 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-900/80 rounded-lg transition-colors"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                currentPage.startsWith('admin')
                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}
              aria-label="Admin Portal"
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span className="hidden xl:inline text-xs text-blue-300">Admin</span>
                </>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 text-slate-200 hover:text-white transition-all flex items-center justify-center group"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md shadow-blue-500/40">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090c14]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.page, link.params)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
