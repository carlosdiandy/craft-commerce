import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService } from '@/services/supabase/productService';
import { Product } from '@/types/api';

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
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.image_url ? [product.image_url] : [],
            shopId: product.shop_id,
            shopName: product.shops?.name || 'Unknown Shop',
            category: product.category,
            stock: product.stock_quantity || 0,
            description: product.description || '',
            createdAt: product.created_at,
            updatedAt: product.updated_at
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
          // Transform single product data
          const transformedProduct: Product = {
            id: data.id,
            name: data.name,
            price: data.price,
            images: data.image_url ? [data.image_url] : [],
            shopId: data.shop_id,
            shopName: data.shops?.name || 'Unknown Shop',
            category: data.category,
            stock: data.stock_quantity || 0,
            description: data.description || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          set({ isLoading: false });
          return transformedProduct;
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
          const transformedData: Product = {
            id: data.id,
            name: data.name,
            price: data.price,
            images: data.image_url ? [data.image_url] : [],
            shopId: data.shop_id,
            shopName: 'Unknown Shop',
            category: data.category,
            stock: data.stock_quantity || 0,
            description: data.description || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          set((state) => ({
            products: [...state.products, transformedData],
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
          set((state) => {
            const transformedData: Product = {
              id: data.id,
              name: data.name,
              price: data.price,
              images: data.image_url ? [data.image_url] : [],
              shopId: data.shop_id,
              shopName: 'Unknown Shop',
              category: data.category,
              stock: data.stock_quantity || 0,
              description: data.description || '',
              createdAt: data.created_at,
              updatedAt: data.updated_at
            };
            return {
              products: state.products.map((p) =>
                p.id === id ? { ...p, ...transformedData } : p
              ),
              isLoading: false,
            };
          });
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