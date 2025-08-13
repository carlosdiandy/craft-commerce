import { apiGet, apiPost, apiPut, ApiResponse } from './apiService';
import { Order, OrderResponse, OrderDetailResponse, UpdateOrderRequest } from '@/types/api';

const ORDERS_BASE_URL = '/orders';

export const orderService = {
  getAllOrders(): Promise<ApiResponse<OrderResponse[]>> {
    return apiGet<OrderResponse[]>(ORDERS_BASE_URL);
  },

  getOrderById(id: string): Promise<ApiResponse<OrderDetailResponse>> {
    return apiGet<OrderDetailResponse>(`${ORDERS_BASE_URL}/${id}`);
  },

  getOrdersByShop(shopId: string): Promise<ApiResponse<OrderResponse[]>> {
    return apiGet<OrderResponse[]>(`${ORDERS_BASE_URL}/shop/${shopId}`);
  },

  getOrdersByUser(userId: string): Promise<ApiResponse<OrderResponse[]>> {
    return apiGet<OrderResponse[]>(`${ORDERS_BASE_URL}/user/${userId}`);
  },

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<OrderResponse>> {
    return apiPost<OrderResponse>(ORDERS_BASE_URL, order);
  },

  updateOrderStatus(id: string, status: string): Promise<ApiResponse<OrderResponse>> {
    return apiPut<OrderResponse>(`${ORDERS_BASE_URL}/${id}/status`, { status });
  },

  updateOrderTracking(id: string, trackingData: { trackingNumber?: string; estimatedDeliveryDate?: string }): Promise<ApiResponse<OrderResponse>> {
    return apiPut<OrderResponse>(`${ORDERS_BASE_URL}/${id}/tracking`, trackingData);
  },
};