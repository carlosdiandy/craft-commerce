import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderResponse, ApiResponse } from '@/types/api';
import { orderService } from '@/services/orderService';
import { handleApiError } from '@/services/apiService';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface OrderActions {
  fetchOrders: () => Promise<void>;
  fetchOrdersByShop: (shopId: string) => Promise<void>;
  fetchOrdersByUser: (userId: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<OrderResponse>>;
  updateOrderStatus: (orderId: string, status: string) => Promise<ApiResponse<OrderResponse>>;
  updateOrderTracking: (orderId: string, trackingData: { trackingNumber?: string; estimatedDeliveryDate?: string }) => Promise<ApiResponse<OrderResponse>>;
  getOrderById: (orderId: string) => Order | undefined;
}

type OrderStore = OrderState & OrderActions;

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.getAllOrders();
          if (response.success && response.data) {
            set({ orders: response.data as Order[], isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch orders' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
        }
      },

      fetchOrdersByShop: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.getOrdersByShop(shopId);
          if (response.success && response.data) {
            set({ orders: response.data as Order[], isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch orders' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
        }
      },

      fetchOrdersByUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.getOrdersByUser(userId);
          if (response.success && response.data) {
            set({ orders: response.data as Order[], isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch orders' });
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
        }
      },

      createOrder: async (order) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.createOrder(order);
          if (response.success && response.data) {
            set((state) => ({
              orders: [...state.orders, response.data as Order],
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to create order' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      updateOrderStatus: async (orderId: string, status: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.updateOrderStatus(orderId, status);
          if (response.success && response.data) {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, status: response.data!.status } : order
              ),
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update order status' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      updateOrderTracking: async (orderId: string, trackingData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await orderService.updateOrderTracking(orderId, trackingData);
          if (response.success && response.data) {
            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, ...response.data } : order
              ),
              isLoading: false,
            }));
            return response;
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update order tracking' });
            return response;
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({ isLoading: false, error: errorResponse.error });
          return errorResponse;
        }
      },

      getOrderById: (orderId: string) => {
        const { orders } = get();
        return orders.find((order) => order.id === orderId);
      },
    }),
    {
      name: 'order-store',
    }
  )
);