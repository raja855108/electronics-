import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Layers, Image as ImageIcon, Sparkles, Copy, Palette } from 'lucide-react';
import { Product, ProductVariation, Category } from '../../types/index.ts';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { ProductImage } from '../../components/ProductImage.tsx';
import { ImageUploadField } from '../../components/admin/ImageUploadField.tsx';

interface AdminProductsPageProps {
  categories: Category[];
  onRefreshData: () => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ categories, onRefreshData }) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal / Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Audio');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(199);
  const [formOriginalPrice, setFormOriginalPrice] = useState(249);
  const [formDiscount, setFormDiscount] = useState(20);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formMainImage, setFormMainImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [formSpecs, setFormSpecs] = useState<Array<{ key: string; val: string }>>([
    { key: 'Material', val: 'Titanium Grade 5' },
    { key: 'Battery', val: '40 Hours Playback' }
  ]);

  // Color Variations state
  const [formVariations, setFormVariations] = useState<ProductVariation[]>([
    {
      id: 'var-1',
      productId: '',
      colorName: 'Midnight Black',
      colorCode: '#0f172a',
      mainImage: '',
      galleryImages: [],
      stock: 20,
      price: 199
    },
    {
      id: 'var-2',
      productId: '',
      colorName: 'Arctic White',
      colorCode: '#f8fafc',
      mainImage: '',
      galleryImages: [],
      stock: 15,
      price: 199
    }
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.name || 'Audio');
    setFormTagline('');
    setFormDescription('');
    setFormPrice(299);
    setFormOriginalPrice(349);
    setFormDiscount(14);
    setFormIsFeatured(false);
    setFormIsNewArrival(true);
    setFormMainImage('');
    setFormGalleryImages([]);
    setFormSpecs([
      { key: 'Chassis', val: 'Aerospace Titanium' },
      { key: 'Connectivity', val: 'Bluetooth 5.4' }
    ]);
    setFormVariations([
      {
        id: `var-${Date.now()}-1`,
        productId: '',
        colorName: 'Midnight Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 25,
        price: 299
      },
      {
        id: `var-${Date.now()}-2`,
        productId: '',
        colorName: 'Electric Blue',
        colorCode: '#2563eb',
        mainImage: '',
        galleryImages: [],
        stock: 18,
        price: 299
      }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormTagline(p.tagline || '');
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormDiscount(p.discount);
    setFormIsFeatured(p.isFeatured);
    setFormIsNewArrival(p.isNewArrival);
    setFormMainImage(p.mainImage || '');
    setFormGalleryImages(p.galleryImages || []);

    const specsArray = Object.entries(p.specifications || {}).map(([key, val]) => ({ key, val }));
    setFormSpecs(specsArray.length > 0 ? specsArray : [{ key: 'Material', val: 'Aluminum' }]);

    setFormVariations(
      (p.variations || []).map((v) => ({
        ...v,
        mainImage: v.mainImage || '',
        galleryImages: v.galleryImages || []
      }))
    );
    setIsModalOpen(true);
  };

  // Variation Handlers
  const handleAddVariation = () => {
    const newVar: ProductVariation = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: editingProduct?.id || '',
      colorName: 'Titanium Slate',
      colorCode: '#475569',
      mainImage: formMainImage || '',
      galleryImages: [],
      stock: 15,
      price: formPrice
    };
    setFormVariations([...formVariations, newVar]);
  };

  const handleUpdateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const updated = [...formVariations];
    updated[index] = { ...updated[index], [field]: value };
    setFormVariations(updated);
  };

  const handleRemoveVariation = (index: number) => {
    if (formVariations.length <= 1) {
      showToast('A product must maintain at least one color variation.', 'error');
      return;
    }
    setFormVariations(formVariations.filter((_, idx) => idx !== index));
  };

  const handleCopyProductMediaToVariation = (index: number) => {
    const updated = [...formVariations];
    updated[index].mainImage = formMainImage;
    updated[index].galleryImages = [...formGalleryImages];
    setFormVariations(updated);
    showToast(`Copied product media to ${updated[index].colorName}`, 'info');
  };

  // Specs Handlers
  const handleAddSpec = () => {
    setFormSpecs([...formSpecs, { key: '', val: '' }]);
  };

  const handleUpdateSpec = (idx: number, field: 'key' | 'val', value: string) => {
    const updated = [...formSpecs];
    updated[idx][field] = value;
    setFormSpecs(updated);
  };

  const handleRemoveSpec = (idx: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== idx));
  };

  // Submit Save Product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('Product title is required.', 'error');
      return;
    }

    if (formVariations.length === 0) {
      showToast('Please add at least one color variation.', 'error');
      return;
    }

    // Convert specs array to object
    const specRecord: Record<string, string> = {};
    formSpecs.forEach((s) => {
      if (s.key.trim()) {
        specRecord[s.key.trim()] = s.val.trim();
      }
    });

    // Calculate total stock from all variations
    const totalStock = formVariations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

    const payload = {
      name: formName,
      category: formCategory,
      tagline: formTagline,
      description: formDescription,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      discount: Number(formDiscount),
      isFeatured: formIsFeatured,
      isNewArrival: formIsNewArrival,
      mainImage: formMainImage,
      galleryImages: formGalleryImages,
      specifications: specRecord,
      stock: totalStock,
      variations: formVariations.map((v) => ({
        ...v,
        mainImage: v.mainImage || '',
        galleryImages: v.galleryImages || [],
        stock: Number(v.stock) || 0,
        price: Number(v.price) || Number(formPrice)
      }))
    };

    try {
      const isEdit = !!editingProduct;
      const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save product');
      }

      showToast(isEdit ? 'Product updated successfully!' : 'New product created!', 'success');
      setIsModalOpen(false);
      fetchProducts();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${productName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete product');
      showToast(`Deleted "${productName}".`, 'info');
      fetchProducts();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
            Catalog Management & Image Storage
          </span>
          <h1 className="font-display font-bold text-3xl text-white mt-1">
            Hardware Products & Variations
          </h1>
        </div>

        <button
          onClick={openNewProductModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0b0f17] rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0b0f17] rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Color Variations & Images</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#07090e] border border-slate-800 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                          <ProductImage
                            category={product.category}
                            colorCode={product.variations?.[0]?.colorCode}
                            colorName={product.variations?.[0]?.colorName}
                            productName={product.name}
                            src={product.mainImage || product.variations?.[0]?.mainImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{product.name}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">{product.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">{product.category}</td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${product.price}
                      {product.discount > 0 && (
                        <span className="text-[11px] text-blue-400 block font-normal">
                          -{product.discount}%
                        </span>
                      )}
                    </td>

                    {/* Color variations list & image indicator */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {product.variations?.map((v) => (
                          <div
                            key={v.id}
                            title={`${v.colorName}: ${v.stock} units, ${v.mainImage ? 'Custom image' : 'Default'}`}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
                          >
                            <span
                              className="w-2 h-2 rounded-full border border-slate-700"
                              style={{ backgroundColor: v.colorCode }}
                            />
                            <span className="text-slate-300">{v.colorName}</span>
                            <span className="text-slate-500 font-mono">({v.stock})</span>
                            {v.mainImage && (
                              <span title="Has assigned custom image">
                                <ImageIcon className="w-2.5 h-2.5 text-blue-400" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`font-semibold ${
                          product.stock <= 5
                            ? 'text-rose-400'
                            : product.stock <= 15
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[10px]">
                        {product.isFeatured && (
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b0f17] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  {editingProduct ? 'Edit Product & Colorway Media' : 'Create New Product'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure titles, specs, persistent image uploads, and variation colorways.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-8 text-xs">
              {/* ---------------- 1. BASIC PRODUCT INFORMATION ---------------- */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-slate-200 pb-1 border-b border-slate-800/80">
                  1. General Information & Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-medium">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Bin Sonic Pro ANC Headphones"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Tagline / Subheading</label>
                    <input
                      type="text"
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. Audiophile-Grade Active Acoustics"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-medium">Description</label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Detailed specifications, industrial design notes, acoustic drivers..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Retail Price ($) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Original / Strikethrough Price ($)</label>
                    <input
                      type="number"
                      min="1"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={formDiscount}
                      onChange={(e) => setFormDiscount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-200">Featured On Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsNewArrival}
                        onChange={(e) => setFormIsNewArrival(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-200">New Release Badge</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ---------------- 2. PRIMARY PRODUCT MEDIA UPLOADS ---------------- */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>Primary Product Media (Default Views)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Upload the default hero image and overarching product gallery. Stored persistently on server disk.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Main Image Upload */}
                  <div className="md:col-span-5">
                    <ImageUploadField
                      mode="single"
                      value={formMainImage}
                      onChange={setFormMainImage}
                      label="Main Product Cover Image"
                      helperText="Displayed as the default storefront hero photo."
                    />
                  </div>

                  {/* Multi-Image Gallery */}
                  <div className="md:col-span-7">
                    <ImageUploadField
                      mode="gallery"
                      values={formGalleryImages}
                      onChange={setFormGalleryImages}
                      label="Product Angle & Detail Gallery"
                      helperText="Drag & drop multiple images. Use ← / → arrows to reorder shots."
                    />
                  </div>
                </div>
              </div>

              {/* ---------------- 3. COLOR VARIATIONS MEDIA & INVENTORY (CRITICAL) ---------------- */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/20 to-slate-900/80 border border-blue-500/30 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-400" />
                      <span>Color Variation Finishes & Media Assignment</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Each colorway has its own main studio render, multiple gallery angles, and independent stock levels.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Colorway</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {formVariations.map((v, idx) => (
                    <div
                      key={v.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#070a10] border border-slate-800 space-y-4 relative group"
                    >
                      {/* Top Bar: Color Info, Swatch & Stock */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 border-slate-600 shadow-sm shrink-0"
                            style={{ backgroundColor: v.colorCode }}
                          />
                          <span className="font-semibold text-white text-sm">
                            Finish #{idx + 1}: {v.colorName || 'Untitled Colorway'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyProductMediaToVariation(idx)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md text-[11px] flex items-center gap-1 transition-colors"
                            title="Copy default product media to this variation"
                          >
                            <Copy className="w-3 h-3 text-blue-400" />
                            <span>Copy Default Media</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(idx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md hover:bg-slate-900 transition-colors"
                            title="Delete this color variation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Variation Metadata Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Colorway Name *</label>
                          <input
                            type="text"
                            required
                            value={v.colorName}
                            onChange={(e) => handleUpdateVariation(idx, 'colorName', e.target.value)}
                            placeholder="e.g. Electric Blue"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Hex Swatch</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={v.colorCode || '#2563eb'}
                              onChange={(e) => handleUpdateVariation(idx, 'colorCode', e.target.value)}
                              className="w-7 h-7 rounded bg-transparent cursor-pointer border-0 p-0"
                            />
                            <input
                              type="text"
                              value={v.colorCode}
                              onChange={(e) => handleUpdateVariation(idx, 'colorCode', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Stock Units *</label>
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => handleUpdateVariation(idx, 'stock', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-400">Variation Price ($)</label>
                          <input
                            type="number"
                            min="1"
                            value={v.price !== undefined ? v.price : formPrice}
                            onChange={(e) => handleUpdateVariation(idx, 'price', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Variation Images Upload Area */}
                      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* Variation Main Image */}
                        <div className="md:col-span-5">
                          <ImageUploadField
                            mode="single"
                            value={v.mainImage || ''}
                            onChange={(url) => handleUpdateVariation(idx, 'mainImage', url)}
                            label={`${v.colorName || 'Variation'} Main Image`}
                            helperText="Swaps to this image when customer selects this color."
                          />
                        </div>

                        {/* Variation Gallery Images */}
                        <div className="md:col-span-7">
                          <ImageUploadField
                            mode="gallery"
                            values={v.galleryImages || []}
                            onChange={(urls) => handleUpdateVariation(idx, 'galleryImages', urls)}
                            label={`${v.colorName || 'Variation'} Gallery Angles`}
                            helperText="Additional angle shots dedicated exclusively to this finish."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------------- 4. SPECIFICATIONS EDITOR ---------------- */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                    Technical Specifications
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Spec Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Key (e.g. Battery Life)"
                        value={spec.key}
                        onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 60 Hours)"
                        value={spec.val}
                        onChange={(e) => handleUpdateSpec(idx, 'val', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25"
                >
                  Save Product & All Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
