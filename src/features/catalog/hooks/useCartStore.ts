'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../constants/products';

export interface CartItem {
  id: string; // unique item id (e.g. product.id + size)
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartStore {
  cart: CartItem[];
  wishlist: Product[];
  compareList: Product[];
  coupon: { code: string; discountPercent: number } | null;
  isMiniCartOpen: boolean;
  setMiniCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compareList: [],
      coupon: null,
      isMiniCartOpen: false,
      setMiniCartOpen: (open) => set({ isMiniCartOpen: open }),

      addToCart: (product, size = '500ml', qty = 1) => {
        const cart = get().cart;
        const itemId = `${product.id}-${size}`;
        const existing = cart.find((item) => item.id === itemId);

        if (existing) {
          set({
            cart: cart.map((item) =>
              item.id === itemId ? { ...item, quantity: item.quantity + qty } : item,
            ),
          });
        } else {
          set({
            cart: [...cart, { id: itemId, product, quantity: qty, selectedSize: size }],
          });
        }
      },

      removeFromCart: (itemId) => {
        set({
          cart: get().cart.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.some((p) => p.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          wishlist: get().wishlist.filter((p) => p.id !== productId),
        });
      },

      addToCompare: (product) => {
        const compareList = get().compareList;
        if (compareList.length < 4 && !compareList.some((p) => p.id === product.id)) {
          set({ compareList: [...compareList, product] });
        }
      },

      removeFromCompare: (productId) => {
        set({
          compareList: get().compareList.filter((p) => p.id !== productId),
        });
      },

      clearCompare: () => set({ compareList: [] }),

      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === 'DETAIL20') {
          set({ coupon: { code: 'DETAIL20', discountPercent: 20 } });
          return true;
        }
        if (normalized === 'CERAMIC10') {
          set({ coupon: { code: 'CERAMIC10', discountPercent: 10 } });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: 'liquidplus-cart-storage',
    },
  ),
);
export default useCartStore;
