import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './cartStore';

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
  {
    id: '4',
    email: 'pending1@example.com',
    name: 'Pending Shop 1',
    role: 'shopOwner',
    shopOwnerStatus: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'pending2@example.com',
    name: 'Pending Shop 2',
    role: 'shopOwner',
    shopOwnerStatus: 'pending',
    createdAt: new Date().toISOString(),
  },
];

// Function to update a user's status in the mockUsers array
const updateMockUserStatus = (userId: string, status: ShopOwnerStatus) => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], shopOwnerStatus: status };
  }
};

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

      deleteUser: (userId: string) => {
        set(state => {
          const updatedMockUsers = mockUsers.filter(u => u.id !== userId);
          // Update the mockUsers array directly (for mock environment)
          mockUsers.splice(0, mockUsers.length, ...updatedMockUsers);
          // If the deleted user is the currently logged-in user, log them out
          if (state.user?.id === userId) {
            return { user: null, token: null, isAuthenticated: false };
          }
          return {};
        });
      },

      adminUpdateUser: (userId: string, userData: Partial<User>) => {
        set(state => {
          const updatedMockUsers = mockUsers.map(u =>
            u.id === userId ? { ...u, ...userData } : u
          );
          // Update the mockUsers array directly (for mock environment)
          mockUsers.splice(0, mockUsers.length, ...updatedMockUsers);
          // If the updated user is the currently logged-in user, update the store's user state
          if (state.user?.id === userId) {
            return { user: { ...state.user, ...userData } };
          }
          return {};
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (token) {
          // En production, vérifier la validité du token
          set({ isAuthenticated: true });
        }
      },

      updateShopOwnerStatus: (userId: string, status: ShopOwnerStatus) => {
        updateMockUserStatus(userId, status);
        // If the updated user is the currently logged-in user, update the store's user state
        const { user } = get();
        if (user && user.id === userId) {
          set({
            user: { ...user, shopOwnerStatus: status },
          });
        }
      },

      getPendingShopOwners: () => {
        return mockUsers.filter(u => u.role === 'shopOwner' && u.shopOwnerStatus === 'pending');
      },

      getAllUsers: () => {
        return mockUsers;
      },

      addProductToShop: (shopId: string, product: Product) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId) {
                  return { ...shop, products: [...(shop.products || []), product] };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          // Update the current user's state if they are the one whose shop was modified
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
      },

      updateProductInShop: (shopId: string, productId: string, updatedProduct: Partial<Product>) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId && shop.products) {
                  const updatedProducts = shop.products.map(prod =>
                    prod.id === productId ? { ...prod, ...updatedProduct } : prod
                  );
                  return { ...shop, products: updatedProducts };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
      },

      deleteProductFromShop: (shopId: string, productId: string) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId && shop.products) {
                  const filteredProducts = shop.products.filter(prod => prod.id !== productId);
                  return { ...shop, products: filteredProducts };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
      },

      addShopUser: (shopId: string, shopUser: ShopUser) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId) {
                  return { ...shop, shopUsers: [...(shop.shopUsers || []), shopUser] };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
      },

      updateShopUser: (shopId: string, shopUserId: string, updatedShopUser: Partial<ShopUser>) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId && shop.shopUsers) {
                  const updatedShopUsers = shop.shopUsers.map(su =>
                    su.id === shopUserId ? { ...su, ...updatedShopUser } : su
                  );
                  return { ...shop, shopUsers: updatedShopUsers };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
      },

      deleteShopUser: (shopId: string, shopUserId: string) => {
        set(state => {
          const updatedUsers = mockUsers.map(user => {
            if (user.role === 'shopOwner' && user.shops) {
              const updatedShops = user.shops.map(shop => {
                if (shop.id === shopId && shop.shopUsers) {
                  const filteredShopUsers = shop.shopUsers.filter(su => su.id !== shopUserId);
                  return { ...shop, shopUsers: filteredShopUsers };
                }
                return shop;
              });
              return { ...user, shops: updatedShops };
            }
            return user;
          });
          const currentUser = updatedUsers.find(u => u.id === state.user?.id);
          return {
            user: currentUser || state.user,
          };
        });
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