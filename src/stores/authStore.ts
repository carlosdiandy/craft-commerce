import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/api';
import { apiPost, handleApiError, apiGet, apiDelete, apiPut } from '@/services/apiService';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ShopOwnerStatus,
  Permission, // Import Permission
} from '@/types/api';

// Re-export types for external use
export type { User, UserRole, ShopOwnerStatus } from '@/types/api';

export interface ShopUser {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
  createdAt: string;
  permissions?: string[];
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  ownerId: string;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  createdAt: string;
  products: Product[];
  shopUsers: ShopUser[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  users: User[]; // To store all users fetched by admin
  allPermissions: Permission[]; // To store all available permissions
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
  handleTokenRefresh: () => Promise<void>;
  // Admin functions
  fetchAllUsers: () => Promise<{ success: boolean; error?: string; }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; error?: string; }>;
  adminUpdateUser: (userId: string, updates: Partial<User>) => Promise<{ success: boolean; error?: string; }>;
  updateShopUserPermissions: (shopId: string, shopUserId: string, permissions: string[]) => Promise<{ success: boolean; error?: string; }>;
  fetchAllPermissions: () => Promise<{ success: boolean; error?: string; }>; // New action
  createPermission: (name: string, resource: string, action: string, description?: string) => Promise<{ success: boolean; error?: string; }>; // New action
  // Shop owner functions
  updateShopOwnerStatus: (status: ShopOwnerStatus) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      users: [],
      allPermissions: [], // Initialize

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const loginData: LoginRequest = { email, password };
          const response = await apiPost<AuthResponse>('/auth/login', loginData);

          if (response.success && response.data) {
            const { user, accessToken, refreshToken } = response.data;

            // Store accessToken in localStorage
            localStorage.setItem('auth_token', accessToken);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              accessToken,
              refreshToken,
            });

            return { success: true, message: response.data.message };
          } else {
            set({ isLoading: false, error: response.error || 'Login failed' });
            return {
              success: false,
              error: response.error || 'Login failed',
              message: response.message || 'Login failed'
            };
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({
            isLoading: false,
            error: errorResponse.error,
          });
          return {
            success: false,
            error: errorResponse.error,
            message: errorResponse.message || errorResponse.error
          };
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiPost<AuthResponse>('/auth/register', data);

          if (response.success && response.data) {
            const { user, accessToken, refreshToken } = response.data;

            // Store accessToken in localStorage
            localStorage.setItem('auth_token', accessToken);
            if (refreshToken) {
              localStorage.setItem('refresh_token', refreshToken);
            }

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              accessToken,
              refreshToken,
            });

            return { success: true, message: response.data.message };
          } else {
            set({ isLoading: false, error: response.error || 'Registration failed' });
            return {
              success: false,
              error: response.error || 'Registration failed',
              message: response.message || 'Registration failed'
            };
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({
            isLoading: false,
            error: errorResponse.error,
          });
          return {
            success: false,
            error: errorResponse.error,
            message: errorResponse.message || errorResponse.error
          };
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      handleTokenRefresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          return;
        }

        try {
          const response = await apiPost<{ accessToken: string, refreshToken: string }>('/auth/refresh-token', { refreshToken });
          if (response.success && response.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('auth_token', accessToken);
            localStorage.setItem('refresh_token', newRefreshToken);
            set({ accessToken, refreshToken: newRefreshToken });
          }
        } catch (error) {
          console.error('Failed to refresh token', error);
          get().logout();
        }
      },

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
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      fetchAllPermissions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiGet<Permission[]>('/permissions');
          if (response.success && response.data) {
            set({ allPermissions: response.data, isLoading: false });
          }
          else {
            set({ isLoading: false, error: response.error || 'Failed to fetch permissions' });
          }
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      createPermission: async (name: string, resource: string, action: string, description?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPost<Permission>('/permissions', { name, resource, action, description });
          if (response.success && response.data) {
            set((state) => ({
              allPermissions: [...state.allPermissions, response.data],
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to create permission' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      deleteUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiDelete<null>(`/users/${userId}`);
          if (response.success) {
            set((state) => ({
              users: state.users.filter(user => user.id !== userId),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to delete user' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      adminUpdateUser: async (userId: string, updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // Extract role and globalPermissions for the new endpoint
          const { role, globalPermissions, ...rest } = updates;
          const payload: any = {};
          if (role !== undefined) payload.role = role;
          if (globalPermissions !== undefined) payload.globalPermissions = globalPermissions;

          const response = await apiPut<User>(`/users/${userId}/role-permissions`, payload);
          if (response.success && response.data) {
            set((state) => ({
              users: state.users.map(user =>
                user.id === userId ? { ...user, ...response.data } : user
              ),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update user' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },

      updateShopOwnerStatus: (status: ShopOwnerStatus) => {
        const { user } = get();
        if (user && user.role === 'ROLE_SHOP_OWNER') {
          set({ user: { ...user, shopOwnerStatus: status } });
        }
      },

      updateShopUserPermissions: async (shopId: string, shopUserId: string, permissions: string[]) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiPut<ShopUser>(`/shops/${shopId}/users/${shopUserId}/permissions`, { permissions });
          if (response.success && response.data) {
            // Optionally update local state if needed, e.g., in a shop store
            set({ isLoading: false });
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update shop user permissions' });
          }
          return response;
        } catch (error) {
          set({ isLoading: false, error: handleApiError(error).error });
          return handleApiError(error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);