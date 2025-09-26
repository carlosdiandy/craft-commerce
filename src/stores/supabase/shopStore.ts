import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shopService, Shop } from '@/services/supabase/shopService';
import { supabase } from '@/integrations/supabase/client';

interface ShopState {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
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
  updateShopStatus: (shopId: string, status: string) => Promise<void>;
  fetchShopUsers: (shopId: string) => Promise<any[]>;
  deleteShopUser: (shopId: string, userId: string) => Promise<void>;
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
      totalPages: 1,
      hasMore: true,

      fetchShops: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await shopService.getAllShops(filters);
          // Transform shop data to add missing properties
          const transformedShops = data?.map((shop: any) => ({
            ...shop,
            image: shop.logo_url,
            productsCount: 0, // This would need a separate query to get actual count
          })) || [];
          
          set({
            shops: transformedShops,
            isLoading: false,
            totalPages: 1, // This would need proper pagination from backend
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

      updateShopStatus: async (shopId: string, status: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('shops')
            .update({ is_validated: status === 'active' })
            .eq('id', shopId)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            shops: state.shops.map((shop) =>
              shop.id === shopId ? { ...shop, is_validated: status === 'active' } : shop
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      fetchShopUsers: async (shopId: string) => {
        try {
          const { data, error } = await supabase
            .from('shop_users')
            .select(`
              *,
              profiles!shop_users_user_id_fkey(first_name, last_name, email)
            `)
            .eq('shop_id', shopId);

          if (error) throw error;
          return data || [];
        } catch (error: any) {
          set({ error: error.message });
          return [];
        }
      },

      deleteShopUser: async (shopId: string, userId: string) => {
        try {
          const { error } = await supabase
            .from('shop_users')
            .delete()
            .eq('shop_id', shopId)
            .eq('user_id', userId);

          if (error) throw error;
        } catch (error: any) {
          set({ error: error.message });
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