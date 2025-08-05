
import { create } from 'zustand';
import { Shipping, ShippingResponse, CreateShippingRequest, ApiResponse } from '@/types/api';

interface ShippingState {
  shippings: Shipping[];
  isLoading: boolean;
  error: string | null;
}

interface ShippingActions {
  fetchShippingByOrderId: (orderId: string) => Promise<void>;
  createShipping: (data: CreateShippingRequest) => Promise<ApiResponse<Shipping>>;
  updateShipping: (id: string, data: Partial<Shipping>) => Promise<ApiResponse<Shipping>>;
  deleteShipping: (id: string) => Promise<ApiResponse<null>>;
}

type ShippingStore = ShippingState & ShippingActions;

export const useShippingStore = create<ShippingStore>((set, get) => ({
  shippings: [],
  isLoading: false,
  error: null,

  fetchShippingByOrderId: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      const mockShipping: Shipping = {
        id: '1',
        orderId,
        trackingNumber: 'TRK123456789',
        carrier: 'DHL',
        status: 'shipped',
        estimatedDelivery: '2024-01-15',
        createdAt: '2024-01-10T10:00:00Z',
        addressId: 'addr1',
        shippingMethod: 'standard',
        shippingCost: 5.99,
        shippingDate: '2024-01-10',
        deliveryDate: '2024-01-15'
      };
      
      set((state) => ({
        shippings: [...state.shippings.filter(s => s.orderId !== orderId), mockShipping],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch shipping' });
    }
  },

  createShipping: async (data: CreateShippingRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newShipping: Shipping = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        addressId: 'addr1',
        shippingMethod: 'standard',
        shippingCost: 5.99,
        shippingDate: new Date().toISOString(),
      };
      
      set((state) => ({
        shippings: [...state.shippings, newShipping],
        isLoading: false,
      }));
      
      return { success: true, data: newShipping };
    } catch (error) {
      set({ isLoading: false, error: 'Failed to create shipping' });
      return { success: false, error: 'Failed to create shipping' };
    }
  },

  updateShipping: async (id: string, data: Partial<Shipping>) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => ({
        shippings: state.shippings.map((shipping) =>
          shipping.id === id ? { ...shipping, ...data } : shipping
        ),
        isLoading: false,
      }));
      
      const updatedShipping = get().shippings.find(s => s.id === id)!;
      return { success: true, data: updatedShipping };
    } catch (error) {
      set({ isLoading: false, error: 'Failed to update shipping' });
      return { success: false, error: 'Failed to update shipping' };
    }
  },

  deleteShipping: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => ({
        shippings: state.shippings.filter((shipping) => shipping.id !== id),
        isLoading: false,
      }));
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: 'Failed to delete shipping' });
      return { success: false, error: 'Failed to delete shipping' };
    }
  },
}));
