
import { create } from 'zustand';
import { apiGet, apiPut } from '@/services/apiService';
import { User, Shop, Order } from '@/types/api';

interface AdminState {
  users: User[];
  shops: Shop[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface AdminActions {
  fetchAllUsers: () => Promise<void>;
  fetchAllShops: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set) => ({
  users: [],
  shops: [],
  orders: [],
  isLoading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiGet<User[]>('/users');
      if (response.success && response.data) {
        set({ users: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.error || 'Failed to fetch users' });
      }
    } catch (error) {
      //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },

  fetchAllShops: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiGet<Shop[]>('/shops');
      if (response.success && response.data) {
        set({ shops: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.error || 'Failed to fetch shops' });
      }
    } catch (error) {
      //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiGet<Order[]>('/orders');
      if (response.success && response.data) {
        set({ orders: response.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.error || 'Failed to fetch orders' });
      }
    } catch (error) {
      //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },

  updateUserStatus: async (userId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiPut<User>(`/users/${userId}/status`, { status });
      if (response.success && response.data) {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, ...response.data } : user
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.error || 'Failed to update user status' });
      }
    } catch (error) {
      //@ts-ignore
      set({ isLoading: false, error: error.message });
    }
  },
}));
