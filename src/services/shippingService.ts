import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Shipping, ShippingResponse, CreateShippingRequest } from '@/types/api';

const SHIPPING_BASE_URL = '/shipping';

export const shippingService = {
  getShippingByOrder(orderId: string): Promise<ApiResponse<ShippingResponse>> {
    return apiGet<ShippingResponse>(`${SHIPPING_BASE_URL}/order/${orderId}`);
  },

  createShipping(shipping: CreateShippingRequest): Promise<ApiResponse<ShippingResponse>> {
    return apiPost<ShippingResponse>(SHIPPING_BASE_URL, shipping);
  },

  updateShipping(id: string, shipping: Partial<CreateShippingRequest>): Promise<ApiResponse<ShippingResponse>> {
    return apiPut<ShippingResponse>(`${SHIPPING_BASE_URL}/${id}`, shipping);
  },

  deleteShipping(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${SHIPPING_BASE_URL}/${id}`);
  },
};