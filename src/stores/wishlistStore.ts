
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WishlistItem } from '@/types/api';

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (productId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.some(item => item.productId === product.id);
          if (!exists) {
            const newItem: WishlistItem = {
              productId: product.id,
              addedDate: new Date().toISOString(),
              quantity: 1
            };
            return { items: [...state.items, newItem] };
          }
          return state;
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isItemInWishlist: (productId) => {
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
      name: 'wishlist-storage',
    }
  )
);
