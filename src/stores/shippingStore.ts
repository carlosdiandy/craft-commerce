import { create } from 'zustand';
import axios from 'axios';
import { ShippingResponse, CreateShippingRequest, ApiResponse } from '@/types/api';
import { apiGet, apiPost, apiPut, handleApiError } from '@/services/apiService';

export interface Shipping {
  id: string;
  orderId: string;
  addressId: string;
  shippingMethod: string;
  shippingCost: number;
  shippingDate: string;
  deliveryDate: string;
}

interface ShippingState {
  shipping: Shipping | null;
}

interface ShippingActions {
  createShipping: (shipping: Omit<Shipping, 'id'>) => Promise<void>;
  updateShipping: (shipping: Partial<Shipping>) => Promise<void>;
  fetchShippingByOrderId: (orderId: string) => Promise<void>;
}


type ShippingStore = ShippingState & ShippingActions;

const API_URL = "http://localhost:8080/api/shipping";

export const useShippingStore = create<ShippingStore>((set) => ({
  shipping: null,

  createShipping: async (shipping) => {
    try {
      const response = await apiPost<ShippingResponse>('/shipping', shipping);
      if (response.success && response.data) {
        set({ shipping: response.data });
      }
    } catch (error) {
      console.error("Failed to create shipping:", error);
    }
  },

  updateShipping: async (shipping) => {
    if (!shipping.id) throw new Error("Shipping ID is required for updates.");
    try {
      const response = await apiPut<ShippingResponse>(`/shipping/${shipping.id}`, shipping);
      if (response.success && response.data) {
        set({ shipping: response.data });
      }
    } catch (error) {
      console.error("Failed to update shipping:", error);
    }
  },

  fetchShippingByOrderId: async (orderId) => {
    try {
      const response = await apiGet<ShippingResponse>(`/shipping/order/${orderId}`);
      if (response.success && response.data) {
        set({ shipping: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch shipping:", error);
      set({ shipping: null });
    }
  },
}));
