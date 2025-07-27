import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'shopOwner' | 'client';
export type ShopOwnerStatus = 'pending' | 'paid' | 'validated';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  shopOwnerStatus?: ShopOwnerStatus;
  shops?: Shop[];
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    shopOwnerType?: 'individual' | 'company';
  }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  updateShopOwnerStatus: (status: ShopOwnerStatus) => void;
}

type AuthStore = AuthState & AuthActions;

// Simulation des utilisateurs (en production, remplacer par des vraies API)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@platform.com',
    name: 'Admin Platform',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'shop@example.com',
    name: 'Shop Owner',
    role: 'shopOwner',
    shopOwnerStatus: 'validated',
    shops: [
      {
        id: 'shop1',
        name: 'Ma Boutique Mode',
        description: 'Vêtements tendance',
        ownerId: '2',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'client@example.com',
    name: 'Client Fidèle',
    role: 'client',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulation API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          if (user && password === 'password') {
            const token = `mock-jwt-token-${user.id}`;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          
          set({ isLoading: false });
          return false;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          // Simulation API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: Date.now().toString(),
            email: userData.email,
            name: userData.name,
            role: userData.role,
            shopOwnerStatus: userData.role === 'shopOwner' ? 'pending' : undefined,
            shops: userData.role === 'shopOwner' ? [] : undefined,
            createdAt: new Date().toISOString(),
          };
          
          mockUsers.push(newUser);
          
          const token = `mock-jwt-token-${newUser.id}`;
          set({
            user: newUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (token) {
          // En production, vérifier la validité du token
          set({ isAuthenticated: true });
        }
      },

      updateShopOwnerStatus: (status) => {
        const { user } = get();
        if (user && user.role === 'shopOwner') {
          set({
            user: { ...user, shopOwnerStatus: status },
          });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);