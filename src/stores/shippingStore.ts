import { create } from 'zustand';
import axios from 'axios';

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
    const response = await axios.post(API_URL, shipping);
    set({ shipping: response.data });
  },

  updateShipping: async (shipping) => {
    if (!shipping.id) throw new Error("Shipping ID is required for updates.");
    const response = await axios.put(`${API_URL}/${shipping.id}`, shipping);
    set({ shipping: response.data });
  },

  fetchShippingByOrderId: async (orderId) => {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    set({ shipping: response.data });
  },
}));
