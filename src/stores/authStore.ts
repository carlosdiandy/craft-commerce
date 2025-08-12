
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/api';
import { apiPost, handleApiError } from '@/services/apiService';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
  ShopOwnerStatus
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
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  ownerId: string;
  status: 'active' | 'suspended';
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
  // Mock users for demo purposes
  mockUsers: User[];
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
  getAllUsers: () => User[];
  deleteUser: (userId: string) => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  // Shop owner functions
  updateShopOwnerStatus: (status: ShopOwnerStatus) => void;
  // Shop management functions
  addProductToShop: (shopId: string, product: Product) => void;
  updateProductInShop: (shopId: string, productId: string, updates: Partial<Product>) => void;
  deleteProductFromShop: (shopId: string, productId: string) => void;
  // Shop user management
  addShopUser: (shopId: string, user: ShopUser) => void;
  updateShopUser: (shopId: string, userId: string, updates: Partial<ShopUser>) => void;
  deleteShopUser: (shopId: string, userId: string) => void;
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
      mockUsers: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@platform.com',
          role: 'ROLE_ADMIN' as UserRole,
          createdAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
        {
          id: '2',
          name: 'Shop Owner',
          email: 'shop@example.com',
          role: 'ROLE_SHOP_OWNER' as UserRole,
          createdAt: '2024-01-01T00:00:00Z',
          isActive: true,
          shopOwnerStatus: 'approved' as ShopOwnerStatus,
        },
        {
          id: '3',
          name: 'Client User',
          email: 'client@example.com',
          role: 'ROLE_CLIENT' as UserRole,
          createdAt: '2024-01-01T00:00:00Z',
          isActive: true,
        },
      ],

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
            set({
              isLoading: false,
              error: response.error || 'Login failed',
            });
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
            set({
              isLoading: false,
              error: response.error || 'Registration failed',
            });
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

      getAllUsers: () => {
        return get().mockUsers;
      },

      deleteUser: (userId: string) => {
        set((state) => ({
          mockUsers: state.mockUsers.filter(user => user.id !== userId)
        }));
      },

      adminUpdateUser: (userId: string, updates: Partial<User>) => {
        set((state) => ({
          mockUsers: state.mockUsers.map(user =>
            user.id === userId ? { ...user, ...updates } : user
          )
        }));
      },

      updateShopOwnerStatus: (status: ShopOwnerStatus) => {
        const { user } = get();
        if (user && user.role === 'ROLE_SHOP_OWNER') {
          set({ user: { ...user, shopOwnerStatus: status } });
        }
      },

      addProductToShop: (shopId: string, product: Product) => {
        // Mock implementation
        console.log('Adding product to shop:', shopId, product);
      },

      updateProductInShop: (shopId: string, productId: string, updates: Partial<Product>) => {
        // Mock implementation
        console.log('Updating product in shop:', shopId, productId, updates);
      },

      deleteProductFromShop: (shopId: string, productId: string) => {
        // Mock implementation
        console.log('Deleting product from shop:', shopId, productId);
      },

      addShopUser: (shopId: string, user: ShopUser) => {
        // Mock implementation
        console.log('Adding user to shop:', shopId, user);
      },

      updateShopUser: (shopId: string, userId: string, updates: Partial<ShopUser>) => {
        // Mock implementation
        console.log('Updating shop user:', shopId, userId, updates);
      },

      deleteShopUser: (shopId: string, userId: string) => {
        // Mock implementation
        console.log('Deleting shop user:', shopId, userId);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
