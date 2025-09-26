import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WishlistItem } from '@/types/api';

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistActions {
  addItem: (product: Product, quantity?: number, selectedVariants?: { [key: string]: string }) => void;
  removeItem: (productId: string, selectedVariants?: { [key: string]: string }) => void;
  clearWishlist: () => void;
  isItemInWishlist: (productId: string, selectedVariants?: { [key: string]: string }) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useSupabaseWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedVariants = {}) => {
        set((state) => {
          const exists = state.items.some(item => item.productId === product.id);
          if (!exists) {
            const newItem: WishlistItem = {
              productId: product.id,
              addedDate: new Date().toISOString(),
              quantity
            };
            return { items: [...state.items, newItem] };
          }
          return state;
        });
      },

      removeItem: (productId, selectedVariants = {}) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isItemInWishlist: (productId, selectedVariants = {}) => {
        return get().items.some(item => item.productId === productId);
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
      },
    }),
    {
      name: 'supabase-wishlist-storage',
    }
  )
);