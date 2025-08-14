
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductResponse, ApiResponse, ProductVariant } from '@/types/api';
import { productService } from '@/services/productService';
import { handleApiError } from '@/services/apiService';

export type { Product, ProductVariant };

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface ProductActions {
  fetchProducts: (filters?: { page?: number; limit?: number; category?: string; shopId?: string; searchQuery?: string; minPrice?: number; maxPrice?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; inStockOnly?: boolean; }, append?: boolean) => Promise<void>;
  resetProducts: () => void;
  fetchProductsByShop: (shopId: string, filters?: { page?: number; limit?: number; }) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<ApiResponse<ProductResponse>>;
  updateProduct: (productId: string, product: Partial<Product>) => Promise<ApiResponse<ProductResponse>>;
  deleteProduct: (productId: string) => Promise<ApiResponse<void>>;
  getProductById: (productId: string) => Product | undefined;
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

      fetchProducts: async (filters, append = false) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.getAllProducts(filters);
          if (response.success && response.data) {
            const productsData = response.data as { data: Product[]; meta: { currentPage: number; totalPages: number; totalItems: number } };
            set((state) => ({
              products: append ? [...state.products, ...productsData.data] : productsData.data,
              currentPage: productsData.meta.currentPage,
              totalPages: productsData.meta.totalPages,
              totalProducts: productsData.meta.totalItems,
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch products' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
        }
      },
      resetProducts: () => {
        set({ products: [], currentPage: 1, totalPages: 1, totalProducts: 0, error: null });
      },

      fetchProductsByShop: async (shopId: string, filters) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.getAllProducts({ shopId, ...filters });
          if (response.success && response.data) {
            const productsData = response.data as { data: Product[]; meta: { currentPage: number; totalPages: number; totalItems: number } };
            set({
              products: productsData.data,
              currentPage: productsData.meta.currentPage,
              totalPages: productsData.meta.totalPages,
              totalProducts: productsData.meta.totalItems,
              isLoading: false,
            });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch products' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      addProduct: async (product) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.createProduct(product as any);
          if (response.success && response.data) {
            set((state) => ({
              products: [...state.products, response.data as Product],
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to add product' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      updateProduct: async (productId, product) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.updateProduct(productId, product);
          if (response.success && response.data) {
            set((state) => ({
              products: state.products.map((p) =>
                p.id === productId ? { ...p, ...response.data } : p
              ),
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update product' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      deleteProduct: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.deleteProduct(productId);
          if (response.success) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== productId),
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to delete product' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
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
