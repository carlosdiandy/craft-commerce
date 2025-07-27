import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './cartStore';

interface FavoritesState {
  items: Product[];
}

interface FavoritesActions {
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToFavorites: (product) => {
        const { items } = get();
        if (!items.find(item => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeFromFavorites: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
      },

      toggleFavorite: (product) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(product.id)) {
          removeFromFavorites(product.id);
        } else {
          addToFavorites(product);
        }
      },

      isFavorite: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      clearFavorites: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'favorites-store',
    }
  )
);