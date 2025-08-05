
import { create } from 'zustand';
import { apiGet } from '@/services/apiService';
import { Product } from '@/types/api';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductActions {
  fetchProductsByShop: (shopId: string) => Promise<void>;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProductsByShop: async (shopId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiGet<Product[]>(`/products/shop/${shopId}`);
      if (response.success && response.data) {
        set({ products: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.error || 'Failed to fetch products' });
      }
    } catch (error) {
        //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },
}));
