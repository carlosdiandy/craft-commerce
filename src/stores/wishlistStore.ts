
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/api';

interface WishlistState {
  items: Product[];
}

interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (productId: string) => boolean;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.some(item => item.id === product.id);
          if (!exists) {
            return { items: [...state.items, product] };
          }
          return state;
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isItemInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
