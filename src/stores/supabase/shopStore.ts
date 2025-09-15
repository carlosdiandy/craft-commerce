import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shopService, Shop } from '@/services/supabase/shopService';

interface ShopState {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

interface ShopActions {
  fetchShops: (filters?: { 
    page?: number; 
    limit?: number; 
    isFeatured?: boolean; 
    sortBy?: string; 
    sortOrder?: string; 
  }) => Promise<void>;
  fetchShopById: (shopId: string) => Promise<Shop | null>;
  createShop: (shop: { name: string; description?: string; logo_url?: string }) => Promise<{ success: boolean; error?: string; data?: Shop }>;
  updateShop: (shopId: string, shop: { name?: string; description?: string; logo_url?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteShop: (shopId: string) => Promise<{ success: boolean; error?: string }>;
  fetchShopUsers: (shopId: string) => Promise<any[]>;
  addUserToShop: (shopId: string, userData: { user_id: string; role?: string; permissions?: string[] }) => Promise<{ success: boolean; error?: string }>;
  updateShopUser: (shopId: string, shopUserId: string, userData: { role?: string; permissions?: string[] }) => Promise<{ success: boolean; error?: string }>;
  removeUserFromShop: (shopId: string, shopUserId: string) => Promise<{ success: boolean; error?: string }>;
  getShopById: (shopId: string) => Shop | undefined;
  clearError: () => void;
}

type ShopStore = ShopState & ShopActions;

export const useSupabaseShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      shops: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      hasMore: true,

      fetchShops: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await shopService.getAllShops(filters);
          set({
            shops: data || [],
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      fetchShopById: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await shopService.getShopById(shopId);
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

      createShop: async (shop) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await shopService.createShop(shop as any);
          set((state) => ({
            shops: [data, ...state.shops],
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

      updateShop: async (shopId: string, shop) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await shopService.updateShop(shopId, shop);
          set((state) => ({
            shops: state.shops.map((s) =>
              s.id === shopId ? { ...s, ...data } : s
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

      deleteShop: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          await shopService.deleteShop(shopId);
          set((state) => ({
            shops: state.shops.filter((shop) => shop.id !== shopId),
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

      fetchShopUsers: async (shopId: string) => {
        try {
          const { data } = await shopService.getShopUsers(shopId);
          return data || [];
        } catch (error: any) {
          set({ error: error.message });
          return [];
        }
      },

      addUserToShop: async (shopId: string, userData) => {
        set({ isLoading: true, error: null });
        try {
          await shopService.addUserToShop(shopId, userData);
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      updateShopUser: async (shopId: string, shopUserId: string, userData) => {
        set({ isLoading: true, error: null });
        try {
          await shopService.updateShopUser(shopId, shopUserId, userData);
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      removeUserFromShop: async (shopId: string, shopUserId: string) => {
        set({ isLoading: true, error: null });
        try {
          await shopService.removeUserFromShop(shopId, shopUserId);
          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        }
      },

      getShopById: (shopId: string) => {
        return get().shops.find((shop) => shop.id === shopId);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'supabase-shop-storage',
    }
  )
);