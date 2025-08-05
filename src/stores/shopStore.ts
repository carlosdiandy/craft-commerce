
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Shop, ShopUser } from './authStore';
import { apiGet, apiPost, apiPut, apiDelete, handleApiError } from '@/services/apiService';
import { ApiResponse, ShopResponse, ShopUserResponse } from '@/types/api';

interface ShopState {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
}

interface ShopActions {
  fetchShops: () => Promise<void>;
  createShop: (shopData: Omit<Shop, 'id' | 'ownerId' | 'status' | 'createdAt'>) => Promise<ApiResponse<ShopResponse>>;
  updateShop: (shopId: string, shopData: Partial<Shop>) => Promise<ApiResponse<ShopResponse>>;
  deleteShop: (shopId: string) => Promise<ApiResponse<null>>;
  fetchShopUsers: (shopId: string) => Promise<ApiResponse<ShopUserResponse[]>>;
  addShopUser: (shopId: string, userData: Omit<ShopUser, 'id' | 'createdAt'>) => Promise<ApiResponse<ShopUserResponse>>;
  updateShopUser: (shopId: string, userId: string, userData: Partial<ShopUser>) => Promise<ApiResponse<ShopUserResponse>>;
  deleteShopUser: (shopId: string, userId: string) => Promise<ApiResponse<null>>;
}

type ShopStore = ShopState & ShopActions;

export const useShopStore = create<ShopStore>()(
  persist(
    (set) => ({
      shops: [],
      isLoading: false,
      error: null,

      fetchShops: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiGet<ShopResponse[]>('/shops');
          if (response.success && response.data) {
            set({ shops: response.data, isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to fetch shops' });
          }
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
        }
      },

      createShop: async (shopData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost<ShopResponse>('/shops', shopData);
          if (response.success) {
            set((state) => ({
              shops: [...state.shops, response.data!],
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to create shop' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      updateShop: async (shopId, shopData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPut<ShopResponse>(`/shops/${shopId}`, shopData);
          if (response.success) {
            set((state) => ({
              shops: state.shops.map((shop) =>
                shop.id === shopId ? { ...shop, ...response.data } : shop
              ),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update shop' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      deleteShop: async (shopId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiDelete<null>(`/shops/${shopId}`);
          if (response.success) {
            set((state) => ({
              shops: state.shops.filter((shop) => shop.id !== shopId),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to delete shop' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      fetchShopUsers: async (shopId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiGet<ShopUserResponse[]>(`/shops/${shopId}/users`);
          // Note: This does not store the users in the main state as it's specific to a shop.
          // The component calling this should handle the response.
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      addShopUser: async (shopId, userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost<ShopUserResponse>(`/shops/${shopId}/users`, userData);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      updateShopUser: async (shopId, userId, userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPut<ShopUserResponse>(`/shops/${shopId}/users/${userId}`, userData);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      deleteShopUser: async (shopId, userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiDelete<null>(`/shops/${shopId}/users/${userId}`);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },
    }),
    {
      name: 'shop-store',
    }
  )
);
