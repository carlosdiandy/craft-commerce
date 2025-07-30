import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './productStore';

export interface WishlistItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface WishlistState {
  items: WishlistItem[];
}

interface WishlistActions {
  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeItem: (productId: string, variants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, variants?: Record<string, string>) => void;
  isItemInWishlist: (productId: string, variants?: Record<string, string>) => boolean;
  getWishlistItem: (productId: string, variants?: Record<string, string>) => WishlistItem | undefined;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variants) => {
        const { items } = get();
        const existingItem = items.find(
          item =>
            item.productId === product.id &&
            (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants)
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === product.id &&
              (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                productName: product.name,
                productImage: product.images?.[0] || '',
                price: product.price,
                quantity,
                selectedVariants: variants,
              },
            ],
          });
        }
      },

      removeItem: (productId, variants) => {
        const { items } = get();
        set({
          items: items.filter(
            item =>
              !(item.productId === productId &&
                (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants))
          ),
        });
      },

      updateQuantity: (productId, quantity, variants) => {
        if (quantity <= 0) {
          get().removeItem(productId, variants);
          return;
        }

        const { items } = get();
        set({
          items: items.map(item =>
            item.productId === productId &&
            (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      isItemInWishlist: (productId, variants) => {
        return get().items.some(
          item =>
            item.productId === productId &&
            (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants)
        );
      },

      getWishlistItem: (productId, variants) => {
        return get().items.find(
          item =>
            item.productId === productId &&
            (item.selectedVariants ? JSON.stringify(item.selectedVariants) === JSON.stringify(variants) : !variants)
        );
      },
    }),
    {
      name: 'wishlist-store',
    }
  )
);
