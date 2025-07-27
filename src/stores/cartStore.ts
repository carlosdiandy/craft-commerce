import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  shopId: string;
  shopName: string;
  category: string;
  stock: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number, variants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  calculateTotal: () => void;
  getItemsCount: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,

      addItem: (product, quantity = 1, variants) => {
        const { items } = get();
        const existingItem = items.find(
          item => 
            item.product.id === product.id && 
            JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id && 
              JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity, selectedVariants: variants }],
          });
        }
        
        get().calculateTotal();
      },

      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter(item => item.product.id !== productId),
        });
        get().calculateTotal();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        set({
          items: items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
        get().calculateTotal();
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      calculateTotal: () => {
        const { items } = get();
        const total = items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity),
          0
        );
        set({ total });
      },

      getItemsCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);