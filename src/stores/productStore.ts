
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductResponse, ApiResponse } from '@/types/api';

export { Product, ProductVariant } from '@/types/api';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  fetchProducts: (filters?: any) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<ApiResponse<ProductResponse>>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<ApiResponse<ProductResponse>>;
  deleteProduct: (productId: string) => Promise<ApiResponse<null>>;
  getProductById: (productId: string) => Product | undefined;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,

      fetchProducts: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation - replace with actual API call
          const mockProducts: Product[] = [
            {
              id: '1',
              name: 'iPhone 15 Pro',
              price: 1199,
              images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
              shopId: 'shop1',
              shopName: 'TechStore Premium',
              category: 'Électronique',
              stock: 15,
              description: 'Le dernier iPhone avec puce A17 Pro'
            }
          ];
          
          set({ products: mockProducts, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Failed to fetch products' });
        }
      },

      addProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
          // Mock implementation
          const newProduct: Product = { ...product, id: Date.now().toString() };
          set((state) => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
          return { success: true, data: newProduct as ProductResponse };
        } catch (error) {
          set({ isLoading: false, error: 'Failed to add product' });
          return { success: false, error: 'Failed to add product' };
        }
      },

      updateProduct: async (productId, product) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            products: state.products.map((p) =>
              p.id === productId ? { ...p, ...product } : p
            ),
            isLoading: false,
          }));
          return { success: true, data: { ...product, id: productId } as ProductResponse };
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update product' });
          return { success: false, error: 'Failed to update product' };
        }
      },

      deleteProduct: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            products: state.products.filter((p) => p.id !== productId),
            isLoading: false,
          }));
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: 'Failed to delete product' });
          return { success: false, error: 'Failed to delete product' };
        }
      },

      getProductById: (productId) => {
        const { products } = get();
        return products.find((product) => product.id === productId);
      },
    }),
    {
      name: 'product-store',
    }
  )
);
