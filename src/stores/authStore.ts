
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/api';
import { apiPost, handleApiError } from '@/services/apiService';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

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
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const loginData: LoginRequest = { email, password };
          const response = await apiPost<AuthResponse>('/auth/login', loginData);

          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Login failed',
            });
            return { success: false, error: response.error || 'Login failed' };
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({
            isLoading: false,
            error: errorResponse.error,
          });
          return { success: false, error: errorResponse.error };
        }
      },

      register: async (name: string, email: string, password: string, role = 'ROLE_CLIENT') => {
        set({ isLoading: true, error: null });

        try {
          const registerData: RegisterRequest = { name, email, password, role };
          const response = await apiPost<AuthResponse>('/auth/register', registerData);

          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.error || 'Registration failed',
            });
            return { success: false, error: response.error || 'Registration failed' };
          }
        } catch (error) {
          const errorResponse = handleApiError(error);
          set({
            isLoading: false,
            error: errorResponse.error,
          });
          return { success: false, error: errorResponse.error };
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
