
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/api';

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number, selectedVariants?: { [key: string]: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
  getItemsCount: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, quantity = 1, selectedVariants = {}) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            const updatedItems = state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity, selectedVariants }
                : item
            );
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              product,
              quantity,
              selectedVariants
            };
            return { items: [...state.items, newItem] };
          }
        });
        get().calculateTotal();
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
        get().calculateTotal();
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0),
        }));
        get().calculateTotal();
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      calculateTotal: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        set({ total });
      },

      getItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
