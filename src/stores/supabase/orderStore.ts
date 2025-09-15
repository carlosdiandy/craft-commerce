import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { orderService, Order } from '@/services/supabase/orderService';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

interface OrderActions {
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  fetchOrdersByShop: (shopId: string) => Promise<void>;
  fetchOrdersByUser: (userId: string) => Promise<void>;
  createOrder: (orderData: { 
    shop_id: string; 
    total_amount: number; 
    items: { product_id: string; quantity: number; price: number }[] 
  }) => Promise<{ success: boolean; error?: string; data?: Order }>;
  updateOrderStatus: (orderId: string, status: string) => Promise<{ success: boolean; error?: string }>;
  updateOrderTracking: (orderId: string, trackingData: { 
    tracking_number?: string; 
    estimated_delivery_date?: string 
  }) => Promise<{ success: boolean; error?: string }>;
  getOrderById: (orderId: string) => Order | undefined;
  clearError: () => void;
}

type OrderStore = OrderState & OrderActions;

export const useSupabaseOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      hasMore: true,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.getAllOrders();
          set({
            orders: data || [],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      fetchOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.getOrderById(orderId);
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

      fetchOrdersByShop: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.getOrdersByShop(shopId);
          set({
            orders: data || [],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      fetchOrdersByUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.getOrdersByUser(userId);
          set({
            orders: data || [],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.createOrder(orderData);
          set((state) => ({
            orders: [data, ...state.orders],
            isLoading: false,
          }));
          return { success: true, data };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      updateOrderStatus: async (orderId: string, status: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.updateOrderStatus(orderId, status);
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order
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

      updateOrderTracking: async (orderId: string, trackingData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await orderService.updateOrderTracking(orderId, trackingData);
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, ...trackingData } : order
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

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'supabase-order-storage',
    }
  )
);