import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService, Product } from '@/services/supabase/productService';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface ProductActions {
  fetchProducts: (filters?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    shopId?: string; 
    sortBy?: string; 
    sortOrder?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
  }) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (product: any) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, product: any) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetProducts: () => void;
  clearError: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,

      fetchProducts: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await productService.getAllProducts(filters);
          // Transform product data to match expected interface
          const transformedProducts = data?.map((product: any) => ({
            ...product,
            images: product.image_url ? [product.image_url] : [],
            stock: product.stock_quantity || 0,
            shopId: product.shop_id,
            shopName: product.shops?.name || 'Unknown Shop',
          })) || [];
          
          set({
            products: transformedProducts,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      fetchProductById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await productService.getProductById(id);
          set({ isLoading: false });
          return data;
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return null;
        }
      },

      createProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await productService.createProduct(product);
          set((state) => ({
            products: [...state.products, data],
            isLoading: false,
          }));
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      updateProduct: async (id: string, product) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await productService.updateProduct(id, product);
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
            isLoading: false,
          }));
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await productService.deleteProduct(id);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            isLoading: false,
          }));
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      resetProducts: () => {
        set({
          products: [],
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'supabase-product-store',
    }
  )
);