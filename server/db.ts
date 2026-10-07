import fs from 'fs';
import path from 'path';
import type { Product, Category, Order, AdminMetrics } from '../src/types/index.ts';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  admin: {
    email: string;
    token: string;
  };
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', description: 'Next-generation flagship smartphones with ultra displays' },
  { id: 'laptops', name: 'Laptops', slug: 'laptops', description: 'Ultra-thin workstation performance notebooks' },
  { id: 'tablets', name: 'Tablets', slug: 'tablets', description: 'Ultra-responsive OLED creative tablets' },
  { id: 'audio', name: 'Audio', slug: 'audio', description: 'Audiophile studio sound and noise cancelling acoustics' },
  { id: 'smart-watches', name: 'Smart Watches', slug: 'smart-watches', description: 'Aerospace titanium health and biometric wearables' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'High-speed wireless power and magnetic docks' },
  { id: 'cameras', name: 'Cameras', slug: 'cameras', description: '4K/8K cinema sensors and gimbal-stabilized optics' },
  { id: 'gaming', name: 'Gaming', slug: 'gaming', description: 'Low latency haptic controllers and peripherals' },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'bin-sonic-pro',
    name: 'Bin Sonic Pro ANC Wireless Headphones',
    slug: 'bin-sonic-pro-anc',
    tagline: 'Pure Acoustic Immersion with 45dB Active Noise Cancellation',
    description: 'Engineered for audio purists and mobile creators, the Bin Sonic Pro delivers studio-grade resolution with custom 40mm Beryllium drivers, ultra-low latency wireless streaming, and intuitive capacitive touch controls. Precision machined aluminum hinges provide all-day ergonomic comfort.',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.9,
    reviewsCount: 184,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Acoustic Driver': '40mm Custom Beryllium Diaphragm',
      'Noise Cancellation': 'Hybrid Active ANC (-45dB attenuation)',
      'Battery Life': 'Up to 60 Hours (ANC On: 48h)',
      'Connectivity': 'Bluetooth 5.4, Multipoint, 3.5mm Lossless',
      'Codecs': 'LDAC, aptX Adaptive, AAC, SBC',
      'Weight': '255g Lightweight Ergonomic Chassis',
      'Warranty': '2-Year International Bin Care'
    },
    stock: 41,
    variations: [
      {
        id: 'var-sonic-black',
        productId: 'bin-sonic-pro',
        colorName: 'Midnight Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 18,
        price: 349,
        sku: 'BIN-AUD-01-BLK'
      },
      {
        id: 'var-sonic-white',
        productId: 'bin-sonic-pro',
        colorName: 'Arctic White',
        colorCode: '#f8fafc',
        mainImage: '',
        galleryImages: [],
        stock: 9,
        price: 349,
        sku: 'BIN-AUD-01-WHT'
      },
      {
        id: 'var-sonic-blue',
        productId: 'bin-sonic-pro',
        colorName: 'Electric Blue',
        colorCode: '#2563eb',
        mainImage: '',
        galleryImages: [],
        stock: 14,
        price: 349,
        sku: 'BIN-AUD-01-BLU'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-quantum-16-ultra',
    name: 'Bin Quantum Phone 16 Ultra',
    slug: 'bin-quantum-phone-16-ultra',
    tagline: 'Titanium Architecture. 200MP Periscope Telephoto. AI Neural Core.',
    description: 'The pinnacle of smartphone engineering. Featuring a micro-sandblasted Grade 5 titanium chassis, 6.8-inch Dynamic AMOLED 2X display with 1-120Hz LTPO variable refresh rate, and 5400mAh dual-cell silicon carbon battery with 100W HyperCharge.',
    category: 'Smartphones',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    rating: 4.95,
    reviewsCount: 312,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Display': '6.8" Quad HD+ LTPO 1-120Hz AMOLED (3000 nits peak)',
      'Processor': 'Bin Quantum NPU Octa-Core 3nm',
      'Camera Array': '200MP Main + 50MP Ultra-Wide + 50MP 5x Periscope',
      'RAM / Storage': '16GB LPDDR5X / 512GB UFS 4.0',
      'Battery': '5400mAh Silicon-Carbon, 100W Wired, 50W Wireless',
      'Durability': 'IP68 Submersion Rated, Armor Glass Victus 3',
      'OS': 'BinOS 4.0 Neural Core Edition'
    },
    stock: 39,
    variations: [
      {
        id: 'var-q16-black',
        productId: 'bin-quantum-16-ultra',
        colorName: 'Obsidian Black',
        colorCode: '#090d16',
        mainImage: '',
        galleryImages: [],
        stock: 22,
        price: 1199,
        sku: 'BIN-PHN-16-OBS'
      },
      {
        id: 'var-q16-blue',
        productId: 'bin-quantum-16-ultra',
        colorName: 'Titanium Blue',
        colorCode: '#1e40af',
        mainImage: '',
        galleryImages: [],
        stock: 12,
        price: 1199,
        sku: 'BIN-PHN-16-BLU'
      },
      {
        id: 'var-q16-silver',
        productId: 'bin-quantum-16-ultra',
        colorName: 'Starlight Silver',
        colorCode: '#e2e8f0',
        mainImage: '',
        galleryImages: [],
        stock: 5,
        price: 1199,
        sku: 'BIN-PHN-16-SLV'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-apex-16-pro',
    name: 'Bin Apex 16 Pro Workstation Laptop',
    slug: 'bin-apex-16-pro',
    tagline: 'Uncompromising M-Architecture Power for Creators and Engineers',
    description: 'Designed for demanding compiling, 3D spatial rendering, and computational workflows. Featuring a 16.2-inch Mini-LED 3.5K Liquid Retina display, vapor chamber cryo-cooling, and 22-hour battery life.',
    category: 'Laptops',
    price: 2299,
    originalPrice: 2499,
    discount: 8,
    rating: 4.88,
    reviewsCount: 96,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Display': '16.2" Mini-LED 3456x2234 120Hz ProMotion (1600 nits)',
      'Processor': 'Bin Apex M4 16-Core CPU / 40-Core GPU',
      'Memory': '64GB Unified Memory (400GB/s bandwidth)',
      'Storage': '1TB NVMe PCIe 5.0 SSD (7200MB/s)',
      'Ports': '3x Thunderbolt 5, HDMI 2.1, SDXC Slot, MagSafe 3',
      'Battery': '100Wh Battery (22 Hours video playback)',
      'Weight': '2.14 kg Anodized Aerospace Aluminum'
    },
    stock: 23,
    variations: [
      {
        id: 'var-apex-spacegray',
        productId: 'bin-apex-16-pro',
        colorName: 'Space Gray',
        colorCode: '#334155',
        mainImage: '',
        galleryImages: [],
        stock: 15,
        price: 2299,
        sku: 'BIN-LAP-16-SGY'
      },
      {
        id: 'var-apex-black',
        productId: 'bin-apex-16-pro',
        colorName: 'Stealth Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 8,
        price: 2349,
        sku: 'BIN-LAP-16-BLK'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-chrono-pulse-ultra',
    name: 'Bin Chrono Pulse Watch Ultra',
    slug: 'bin-chrono-pulse-watch-ultra',
    tagline: 'Aerospace Grade Titanium. Dual-Frequency GPS. 100m Dive Rated.',
    description: 'The premier tactical smartwatch for extreme athletes and urban explorers. Multi-sensor biometric suite tracking ECG, HRV, SpO2, core body temperature, and continuous sleep stages in real-time.',
    category: 'Smart Watches',
    price: 449,
    originalPrice: 499,
    discount: 10,
    rating: 4.85,
    reviewsCount: 142,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Case Material': '49mm Grade 5 Titanium with Sapphire Crystal Lens',
      'Display': '1.96" Always-On LTPO OLED 3000 nits',
      'Battery Life': 'Up to 72 Hours in Normal Mode, 120 Hours Low Power',
      'Water Resistance': '100m Water Resistance / EN13319 Dive Certified',
      'Sensors': 'Optical Heart, Electrical ECG, Temperature, Depth Sensor',
      'Connectivity': 'Cellular LTE, Dual-Band L1/L5 GPS, NFC BinPay'
    },
    stock: 51,
    variations: [
      {
        id: 'var-chrono-black',
        productId: 'bin-chrono-pulse-ultra',
        colorName: 'Onyx Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 25,
        price: 449,
        sku: 'BIN-WTC-01-ONX'
      },
      {
        id: 'var-chrono-blue',
        productId: 'bin-chrono-pulse-ultra',
        colorName: 'Cobalt Electric',
        colorCode: '#3b82f6',
        mainImage: '',
        galleryImages: [],
        stock: 19,
        price: 449,
        sku: 'BIN-WTC-01-CBL'
      },
      {
        id: 'var-chrono-orange',
        productId: 'bin-chrono-pulse-ultra',
        colorName: 'Alpine Orange',
        colorCode: '#ea580c',
        mainImage: '',
        galleryImages: [],
        stock: 7,
        price: 459,
        sku: 'BIN-WTC-01-ORG'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-slate-pro-13',
    name: 'Bin Slate Pro 13 OLED Tablet',
    slug: 'bin-slate-pro-13-tablet',
    tagline: 'Tandem OLED Precision with 120Hz Stylus Pen Support',
    description: 'Transform your digital canvas with 5.1mm ultra-thin industrial precision. Powered by dual Tandem OLED layers offering unmatched color contrast and true deep blacks.',
    category: 'Tablets',
    price: 899,
    originalPrice: 999,
    discount: 10,
    rating: 4.8,
    reviewsCount: 78,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Display': '13.0" Tandem OLED 2752x2064 120Hz ProMotion',
      'Processor': 'Bin OctaCore M3 Compute Core',
      'Thickness': '5.1mm Featherweight Profile (579g)',
      'Audio': '4-Speaker Spatial Acoustic Array',
      'Stylus': 'Bin Pen Gen 3 Support with Haptic Feedback'
    },
    stock: 25,
    variations: [
      {
        id: 'var-slate-gray',
        productId: 'bin-slate-pro-13',
        colorName: 'Cosmic Gray',
        colorCode: '#475569',
        mainImage: '',
        galleryImages: [],
        stock: 14,
        price: 899,
        sku: 'BIN-TAB-13-GRY'
      },
      {
        id: 'var-slate-silver',
        productId: 'bin-slate-pro-13',
        colorName: 'Frost Silver',
        colorCode: '#f1f5f9',
        mainImage: '',
        galleryImages: [],
        stock: 11,
        price: 899,
        sku: 'BIN-TAB-13-SLV'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-cybervision-4k',
    name: 'Bin CyberVision 4K Cinema Camera',
    slug: 'bin-cybervision-4k-camera',
    tagline: '14-Stop Dynamic Range. 4K 120FPS ProRes RAW Capture.',
    description: 'Compact cinema powerhouse equipped with a 1-inch stacked CMOS sensor, 6-axis optical image stabilization, and built-in active cooling for continuous high-framerate shooting.',
    category: 'Cameras',
    price: 1499,
    originalPrice: 1699,
    discount: 12,
    rating: 4.9,
    reviewsCount: 64,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Sensor': '1.0-inch Stacked Exmor BSI CMOS Sensor',
      'Recording': '4K 120fps 10-Bit 4:2:2 ProRes / CinemaDNG',
      'Stabilization': 'Active 6-Axis Hybrid Gimbal Stabilization',
      'Lens Mount': 'Universal E-Mount Micro Precision'
    },
    stock: 10,
    variations: [
      {
        id: 'var-cam-black',
        productId: 'bin-cybervision-4k',
        colorName: 'Stealth Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 6,
        price: 1499,
        sku: 'BIN-CAM-4K-BLK'
      },
      {
        id: 'var-cam-gray',
        productId: 'bin-cybervision-4k',
        colorName: 'Graphite Gray',
        colorCode: '#374151',
        mainImage: '',
        galleryImages: [],
        stock: 4,
        price: 1499,
        sku: 'BIN-CAM-4K-GRY'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-neocontroller-pad',
    name: 'Bin NeoController Pro Wireless Pad',
    slug: 'bin-neocontroller-pro-gamepad',
    tagline: 'Hall Effect Electromagnetic Joysticks. Sub-1ms Latency.',
    description: 'Zero drift electromagnetic Hall effect analog sticks and magnetic micro-switch face buttons. Featuring dual linear rumble motors and swappable rear ergonomic paddles.',
    category: 'Gaming',
    price: 89,
    originalPrice: 119,
    discount: 25,
    rating: 4.87,
    reviewsCount: 228,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Sticks': 'Hall-Effect Electromagnetic Non-Contact Sensing',
      'Polling Rate': '1000Hz (1ms response time over 2.4GHz wireless)',
      'Trigger Stops': 'Dual Hair-Trigger Mechanical Adjusters',
      'Battery': '1200mAh Li-Po (Up to 30 Hours Gameplay)'
    },
    stock: 71,
    variations: [
      {
        id: 'var-neo-black',
        productId: 'bin-neocontroller-pad',
        colorName: 'Cyber Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 35,
        price: 89,
        sku: 'BIN-GAM-01-BLK'
      },
      {
        id: 'var-neo-violet',
        productId: 'bin-neocontroller-pad',
        colorName: 'Neon Violet',
        colorCode: '#8b5cf6',
        mainImage: '',
        galleryImages: [],
        stock: 20,
        price: 89,
        sku: 'BIN-GAM-01-VIO'
      },
      {
        id: 'var-neo-blue',
        productId: 'bin-neocontroller-pad',
        colorName: 'Glacier Blue',
        colorCode: '#38bdf8',
        mainImage: '',
        galleryImages: [],
        stock: 16,
        price: 89,
        sku: 'BIN-GAM-01-BLU'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bin-magcharge-duo',
    name: 'Bin MagCharge Duo 30W Fast Charger',
    slug: 'bin-magcharge-duo-dock',
    tagline: 'Dual Magnetic Fast Induction Dock with CryoAir Thermal Cooling',
    description: 'Simultaneously charge your Bin Quantum smartphone and wireless headphones at maximum Qi2 speeds. Built with an internal silent cooling fan to maintain peak battery health.',
    category: 'Accessories',
    price: 59,
    originalPrice: 79,
    discount: 25,
    rating: 4.75,
    reviewsCount: 110,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isPublished: true,
    mainImage: '',
    galleryImages: [],
    specifications: {
      'Output': '30W Max Dual Fast Induction Qi2 Standard',
      'Cooling': 'Silent Magnetic Centrifugal Heat Dissipation',
      'Input': 'USB-C PD 3.1 65W GaN',
      'Cable Included': '1.5m Braided Armored USB-C Cable'
    },
    stock: 70,
    variations: [
      {
        id: 'var-mag-black',
        productId: 'bin-magcharge-duo',
        colorName: 'Midnight Black',
        colorCode: '#0f172a',
        mainImage: '',
        galleryImages: [],
        stock: 40,
        price: 59,
        sku: 'BIN-ACC-01-BLK'
      },
      {
        id: 'var-mag-white',
        productId: 'bin-magcharge-duo',
        colorName: 'Arctic White',
        colorCode: '#f8fafc',
        mainImage: '',
        galleryImages: [],
        stock: 30,
        price: 59,
        sku: 'BIN-ACC-01-WHT'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'BIN-2026-9812',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Delivered',
    customer: {
      fullName: 'Marcus Vance',
      email: 'm.vance@techhorizon.io',
      phone: '+1 (415) 892-1049',
      address: '742 Silicon Boulevard, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    items: [
      {
        productId: 'bin-sonic-pro',
        productName: 'Bin Sonic Pro ANC Wireless Headphones',
        variationId: 'var-sonic-blue',
        colorName: 'Electric Blue',
        colorCode: '#2563eb',
        image: '',
        price: 349,
        quantity: 1,
        maxStock: 14
      }
    ],
    subtotal: 349,
    shipping: 0,
    discount: 0,
    total: 349,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid'
  },
  {
    id: 'BIN-2026-9844',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'Processing',
    customer: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@designcore.de',
      phone: '+49 170 9482103',
      address: 'Friedrichstraße 118',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10117',
      country: 'Germany'
    },
    items: [
      {
        productId: 'bin-quantum-16-ultra',
        productName: 'Bin Quantum Phone 16 Ultra',
        variationId: 'var-q16-black',
        colorName: 'Obsidian Black',
        colorCode: '#090d16',
        image: '',
        price: 1199,
        quantity: 1,
        maxStock: 22
      },
      {
        productId: 'bin-magcharge-duo',
        productName: 'Bin MagCharge Duo 30W Fast Charger',
        variationId: 'var-mag-black',
        colorName: 'Midnight Black',
        colorCode: '#0f172a',
        image: '',
        price: 59,
        quantity: 1,
        maxStock: 40
      }
    ],
    subtotal: 1258,
    shipping: 0,
    discount: 50,
    total: 1208,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid'
  }
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load existing db, falling back to defaults:', e);
    }

    const initialData: DatabaseSchema = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      orders: DEFAULT_ORDERS,
      admin: {
        email: 'admin@binelectronics.com',
        token: 'bin_admin_secret_token_2026'
      }
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // --- Products ---
  public getProducts(filter?: { category?: string; search?: string; sort?: string; featured?: boolean }): Product[] {
    let list = [...this.data.products];

    if (filter?.category && filter.category !== 'all') {
      const catLower = filter.category.toLowerCase();
      list = list.filter(p => p.category.toLowerCase() === catLower || p.category.toLowerCase().replace(/\s+/g, '-') === catLower);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (filter?.featured) {
      list = list.filter(p => p.isFeatured);
    }

    if (filter?.sort) {
      switch (filter.sort) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
    }

    return list;
  }

  public getProductById(idOrSlug: string): Product | undefined {
    return this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  public saveProduct(product: Product): Product {
    const idx = this.data.products.findIndex(p => p.id === product.id);
    // recalculate aggregate stock from variations if variations exist
    if (product.variations && product.variations.length > 0) {
      product.stock = product.variations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    }
    product.updatedAt = new Date().toISOString();

    if (idx >= 0) {
      this.data.products[idx] = product;
    } else {
      product.createdAt = new Date().toISOString();
      this.data.products.unshift(product);
    }
    this.saveData(this.data);
    return product;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.data.categories.map(c => {
      const count = this.data.products.filter(p => p.category.toLowerCase() === c.name.toLowerCase() || p.category.toLowerCase() === c.slug.toLowerCase()).length;
      return { ...c, itemCount: count };
    });
  }

  public addCategory(cat: { name: string; slug?: string; description?: string }): Category {
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: slug,
      name: cat.name,
      slug,
      description: cat.description || ''
    };
    this.data.categories.push(newCat);
    this.saveData(this.data);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    this.data.categories = this.data.categories.filter(c => c.id !== id && c.slug !== id);
    this.saveData(this.data);
    return true;
  }

  // --- Orders ---
  public getOrders(search?: string, status?: string): Order[] {
    let list = [...this.data.orders];
    if (status && status !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): { success: boolean; order?: Order; error?: string } {
    // Atomically check and deduct stock for each product and variation
    for (const item of orderData.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.productName}" no longer exists.` };
      }

      if (item.variationId && product.variations && product.variations.length > 0) {
        const variation = product.variations.find(v => v.id === item.variationId);
        if (!variation) {
          return { success: false, error: `Variation "${item.colorName}" for ${product.name} not found.` };
        }
        if (variation.stock < item.quantity) {
          return {
            success: false,
            error: `Only ${variation.stock} units left for "${product.name}" in ${item.colorName}. Please adjust your quantity.`
          };
        }
      } else {
        if (product.stock < item.quantity) {
          return {
            success: false,
            error: `Only ${product.stock} units left for "${product.name}". Please adjust your quantity.`
          };
        }
      }
    }

    // Deduct stock atomically
    for (const item of orderData.items) {
      const product = this.data.products.find(p => p.id === item.productId)!;
      if (item.variationId && product.variations) {
        const variation = product.variations.find(v => v.id === item.variationId);
        if (variation) {
          variation.stock -= item.quantity;
        }
      }
      product.stock -= item.quantity;
      if (product.stock < 0) product.stock = 0;
      product.updatedAt = new Date().toISOString();
    }

    const uniqueId = `BIN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: uniqueId,
      createdAt: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);

    return { success: true, order: newOrder };
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return undefined;

    // If cancelled, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = this.data.products.find(p => p.id === item.productId);
        if (product) {
          if (item.variationId && product.variations) {
            const variation = product.variations.find(v => v.id === item.variationId);
            if (variation) {
              variation.stock += item.quantity;
            }
          }
          product.stock += item.quantity;
          product.updatedAt = new Date().toISOString();
        }
      }
    }

    order.status = status;
    this.saveData(this.data);
    return order;
  }

  // --- Metrics ---
  public getMetrics(): AdminMetrics {
    const totalSales = this.data.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalOrders = this.data.orders.length;
    const totalProducts = this.data.products.length;

    const lowStockProducts: AdminMetrics['lowStockProducts'] = [];

    this.data.products.forEach(p => {
      if (p.variations && p.variations.length > 0) {
        p.variations.forEach(v => {
          if (v.stock <= 8) {
            lowStockProducts.push({
              productId: p.id,
              productName: p.name,
              variationName: v.colorName,
              stock: v.stock
            });
          }
        });
      } else if (p.stock <= 8) {
        lowStockProducts.push({
          productId: p.id,
          productName: p.name,
          stock: p.stock
        });
      }
    });

    return {
      totalSales,
      totalOrders,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      recentOrders: this.data.orders.slice(0, 5),
      lowStockProducts
    };
  }

  public verifyAdmin(token: string): boolean {
    return token === this.data.admin.token;
  }
}

export const db = new DatabaseService();
