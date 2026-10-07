import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, X, SlidersHorizontal, Check } from 'lucide-react';
import { Product, Category, ProductVariation } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialFilter?: string;
  onSelectProduct: (product: Product, variation?: ProductVariation) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  initialCategory,
  initialSearch,
  initialFilter,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>(initialFilter || 'all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Compute filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase();
        if (!matchesCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Deals / New filter
      if (filterType === 'deals' && p.discount <= 0) return false;
      if (filterType === 'new' && !p.isNewArrival) return false;
      if (filterType === 'featured' && !p.isFeatured) return false;

      // Price filter
      if (p.price > priceMax) return false;

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortOption, priceMax, inStockOnly, filterType]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('featured');
    setPriceMax(3000);
    setInStockOnly(false);
    setFilterType('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Catalog & Hardware
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mt-1">
            All Products
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredProducts.length} high-performance items
          </p>
        </div>

        {/* Search input & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search by model or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 pl-9 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          } md:col-span-1 space-y-6 bg-[#0b0f17] p-5 rounded-2xl border border-slate-800/80 sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Filters</span>
            </h3>
            {(selectedCategory !== 'all' || searchQuery || filterType !== 'all' || inStockOnly || priceMax < 3000) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Category
            </h4>
            <div className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] font-mono text-slate-500">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Tags (Deals, New, Featured) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Collections
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'All', value: 'all' },
                { label: 'Featured', value: 'featured' },
                { label: 'New Arrivals', value: 'new' },
                { label: 'Deals & Offers', value: 'deals' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    filterType === f.value
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">
                Max Price
              </span>
              <span className="font-mono font-medium text-white">${priceMax}</span>
            </div>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$50</span>
              <span>$3,000</span>
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Products Grid Area */}
        <main className="md:col-span-3 lg:col-span-4 space-y-6">
          {/* Sorting and Results Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#0b0f17] rounded-xl border border-slate-800 text-xs">
            <div className="text-slate-400">
              Showing <span className="font-mono text-white">{filteredProducts.length}</span> of{' '}
              <span className="font-mono text-white">{products.length}</span> items
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 py-1 px-2.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-[#0b0f17] border border-slate-800 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-200">No electronics match your query</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search terms or expanding your price and category filters.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
