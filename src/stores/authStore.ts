import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './productStore';
import axios from 'axios';

export type UserRole = 'admin' | 'shopOwner' | 'client';
export type ShopOwnerStatus = 'pending' | 'paid' | 'validated' | 'uploaded' | 'suspended';

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
  products?: Product[];
  shopUsers?: ShopUser[];
}

export type ShopUserRole = 'shop_admin' | 'shop_employee';

export interface ShopUser {
  id: string;
  name: string;
  email: string;
  role: ShopUserRole;
  createdAt: string;
  permissions: string[];
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
  deleteUser: (userId: string) => void;
  adminUpdateUser: (userId: string, userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  updateShopOwnerStatus: (userId: string, status: ShopOwnerStatus) => void;
  getPendingShopOwners: () => User[];
  getAllUsers: () => User[];
  addProductToShop: (shopId: string, product: Product) => void;
  updateProductInShop: (shopId: string, productId: string, updatedProduct: Partial<Product>) => void;
  deleteProductFromShop: (shopId: string, productId: string) => void;
  addShopUser: (shopId: string, shopUser: ShopUser) => void;
  updateShopUser: (shopId: string, shopUserId: string, updatedShopUser: Partial<ShopUser>) => void;
  deleteShopUser: (shopId: string, shopUserId: string) => void;
}

type AuthStore = AuthState & AuthActions;

const API_URL = "http://localhost:8080/api/auth/"; // Assuming backend runs on 8080

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(API_URL + "signin", {
            email,
            password,
          });
          const { id, name, email: userEmail, roles, token } = response.data;
          const user: User = {
            id: id.toString(),
            name,
            email: userEmail,
            role: roles[0], // Assuming single role for simplicity
            createdAt: new Date().toISOString(),
          };
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(API_URL + "signup", {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: [userData.role], // Backend expects array of roles
          });
          // Assuming successful registration also logs in the user or returns user data
          const { id, name, email: userEmail, roles, token } = response.data;
          const user: User = {
            id: id.toString(),
            name,
            email: userEmail,
            role: roles[0], // Assuming single role for simplicity
            createdAt: new Date().toISOString(),
          };
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error("Registration failed:", error);
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
        // This will be implemented with API calls later
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      deleteUser: async (userId: string) => {
        try {
          await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          // Optionally, refetch all users or remove from local state
          set(state => ({
            user: state.user?.id === userId ? null : state.user,
          }));
        } catch (error) {
          console.error("Failed to delete user:", error);
        }
      },

      adminUpdateUser: async (userId: string, userData: Partial<User>) => {
        try {
          const response = await axios.put(`http://localhost:8080/api/admin/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          // If the updated user is the currently logged-in user, update the store's user state
          if (get().user?.id === userId) {
            set({ user: response.data });
          }
        } catch (error) {
          console.error("Failed to update user:", error);
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (token) {
          // In a real app, validate token with backend
          set({ isAuthenticated: true });
        }
      },

      updateShopOwnerStatus: async (userId: string, status: ShopOwnerStatus) => {
        try {
          await axios.put(`http://localhost:8080/api/admin/users/${userId}`, { shopOwnerStatus: status }, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          // If the updated user is the currently logged-in user, update the store's user state
          if (get().user?.id === userId) {
            set(state => ({ user: { ...state.user!, shopOwnerStatus: status } }));
          }
        } catch (error) {
          console.error("Failed to update shop owner status:", error);
        }
      },

      getPendingShopOwners: () => {
        // This is a synchronous function returning mock data for now
        return [];
      },

      getAllUsers: () => {
        // This is a synchronous function returning mock data for now
        return [];
      },

      addProductToShop: async (shopId: string, product: Product) => {
        try {
          const response = await axios.post("http://localhost:8080/api/products/", product, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          // Optionally, update the local state with the new product
          console.log("Product added:", response.data);
        } catch (error) {
          console.error("Failed to add product to shop:", error);
        }
      },

      updateProductInShop: async (shopId: string, productId: string, updatedProduct: Partial<Product>) => {
        try {
          const response = await axios.put(`http://localhost:8080/api/products/${productId}`, updatedProduct, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          console.log("Product updated:", response.data);
        } catch (error) {
          console.error("Failed to update product in shop:", error);
        }
      },

      deleteProductFromShop: async (shopId: string, productId: string) => {
        try {
          await axios.delete(`http://localhost:8080/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          console.log("Product deleted:", productId);
        } catch (error) {
          console.error("Failed to delete product from shop:", error);
        }
      },

      addShopUser: async (shopId: string, shopUser: ShopUser) => {
        try {
          const response = await axios.post(`http://localhost:8080/api/shops/${shopId}/users`, shopUser, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          console.log("Shop user added:", response.data);
        } catch (error) {
          console.error("Failed to add shop user:", error);
        }
      },

      updateShopUser: async (shopId: string, shopUserId: string, updatedShopUser: Partial<ShopUser>) => {
        try {
          const response = await axios.put(`http://localhost:8080/api/shops/${shopId}/users/${shopUserId}`, updatedShopUser, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          console.log("Shop user updated:", response.data);
        } catch (error) {
          console.error("Failed to update shop user:", error);
        }
      },

      deleteShopUser: async (shopId: string, shopUserId: string) => {
        try {
          await axios.delete(`http://localhost:8080/api/shops/${shopId}/users/${shopUserId}`, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          console.log("Shop user deleted:", shopUserId);
        } catch (error) {
          console.error("Failed to delete shop user:", error);
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