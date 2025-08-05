
import { create } from 'zustand';
import { apiGet } from '@/services/apiService';
import { Order } from '@/types/api';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface OrderActions {
  fetchOrdersByShop: (shopId: string) => Promise<void>;
}

type OrderStore = OrderState & OrderActions;

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrdersByShop: async (shopId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiGet<Order[]>(`/orders/shop/${shopId}`);
      if (response.success && response.data) {
        set({ orders: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.error || 'Failed to fetch orders' });
      }
    } catch (error) {
        //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },
}));
