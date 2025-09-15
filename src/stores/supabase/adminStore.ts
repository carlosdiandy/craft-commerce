import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/supabase/profileService';
import { shopService } from '@/services/supabase/shopService';
import { orderService } from '@/services/supabase/orderService';

interface AdminState {
  users: any[];
  shops: any[];
  orders: any[];
  isLoading: boolean;
  error: string | null;
}

interface AdminActions {
  fetchAllUsers: () => Promise<void>;
  fetchAllShops: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  clearError: () => void;
}

type AdminStore = AdminState & AdminActions;

export const useSupabaseAdminStore = create<AdminStore>()((set, get) => ({
  users: [],
  shops: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      set({
        users: data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  fetchAllShops: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await shopService.getAllShops();
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

  fetchAllOrders: async () => {
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

  updateUserStatus: async (userId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await supabase
        .from('profiles')
        .update({ shop_owner_status: status })
        .eq('user_id', userId);

      // Refresh users list
      get().fetchAllUsers();
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));