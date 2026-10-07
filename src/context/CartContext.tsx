import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, ProductVariation, CartItem } from '../types/index.ts';
import { useToast } from './ToastContext.tsx';

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product, variation: ProductVariation, quantity?: number) => boolean;
  updateQuantity: (productId: string, variationId: string, quantity: number) => void;
  removeFromCart: (productId: string, variationId: string) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  totalItems: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'bin_electronics_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart to storage', err);
    }
  }, [cart]);

  const addToCart = (product: Product, variation: ProductVariation, quantity: number = 1): boolean => {
    if (variation.stock <= 0) {
      showToast(`Selected color (${variation.colorName}) is currently out of stock.`, 'error');
      return false;
    }

    const price = variation.price !== undefined ? variation.price : product.price;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variationId === variation.id
      );

      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;
        if (newQty > variation.stock) {
          showToast(`Cannot add more. Maximum available stock for ${variation.colorName} is ${variation.stock}.`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          maxStock: variation.stock,
          price
        };
        showToast(`Updated "${product.name}" (${variation.colorName}) quantity in bag.`, 'success');
        return updated;
      } else {
        if (quantity > variation.stock) {
          showToast(`Only ${variation.stock} units available for ${variation.colorName}.`, 'error');
          return prev;
        }
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          variationId: variation.id,
          colorName: variation.colorName,
          colorCode: variation.colorCode,
          image: variation.mainImage || product.mainImage || '',
          price,
          quantity,
          maxStock: variation.stock
        };
        showToast(`Added "${product.name}" (${variation.colorName}) to bag!`, 'success');
        return [...prev, newItem];
      }
    });

    return true;
  };

  const updateQuantity = (productId: string, variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variationId === variationId) {
          if (quantity > item.maxStock) {
            showToast(`Maximum stock limit reached (${item.maxStock} units).`, 'error');
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variationId: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variationId === variationId)));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Free shipping over $150, else $15 flat rate. Free if empty.
  const shipping = useMemo(() => {
    if (cart.length === 0) return 0;
    return subtotal >= 150 ? 0 : 15;
  }, [subtotal, cart.length]);

  const discount = useMemo(() => {
    if (discountPercent > 0) {
      return Math.round((subtotal * discountPercent) / 100);
    }
    return 0;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shipping);
  }, [subtotal, discount, shipping]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const applyCoupon = (code: string): boolean => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'BINTECH10' || cleaned === 'BIN10') {
      setCouponCode(cleaned);
      setDiscountPercent(10);
      showToast('10% discount applied to your order!', 'success');
      return true;
    }
    if (cleaned === 'SUPER20') {
      setCouponCode(cleaned);
      setDiscountPercent(20);
      showToast('20% flagship VIP discount applied!', 'success');
      return true;
    }
    showToast('Invalid promo code. Try "BIN10" for 10% off.', 'error');
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    showToast('Discount code removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shipping,
        discount,
        total,
        totalItems,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
