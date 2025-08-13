
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
}

interface ProductActions {
  fetchProducts: (filters?: any) => Promise<void>;
  fetchProductsByShop: (shopId: string) => Promise<void>;
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

      fetchProducts: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.getAllProducts(filters);
          if (response.success && response.data) {
            // Handle both paginated and direct array responses
            const products = Array.isArray(response.data) ? response.data : response.data.data;
            set({ products: products as Product[], isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch products' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
        }
      },

      fetchProductsByShop: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productService.getAllProducts({ shopId });
          if (response.success && response.data) {
            const products = Array.isArray(response.data) ? response.data : response.data.data;
            set({ products: products as Product[], isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch products' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
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
