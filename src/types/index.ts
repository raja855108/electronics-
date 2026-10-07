export interface ProductVariation {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  mainImage: string;
  galleryImages: string[];
  stock: number;
  price?: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isPublished: boolean;
  mainImage: string;
  galleryImages: string[];
  specifications: Record<string, string>;
  stock: number;
  variations: ProductVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
  description?: string;
  icon?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  variationId: string;
  colorName: string;
  colorCode: string;
  image: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'credit_card' | 'cod' | 'upi_wire' | 'stripe_demo';
  paymentStatus: 'paid' | 'pending';
}

export interface AdminMetrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
  lowStockProducts: Array<{
    productId: string;
    productName: string;
    variationName?: string;
    stock: number;
  }>;
}
