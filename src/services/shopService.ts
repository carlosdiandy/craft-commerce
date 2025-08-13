import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Shop, ShopResponse, ShopDetailResponse, ShopUser, ShopUserResponse, CreateShopUserRequest, UpdateShopUserRequest } from '@/types/api';

const SHOPS_BASE_URL = '/shops';

export const shopService = {
  // Shop CRUD operations
  getAllShops(): Promise<ApiResponse<Shop[]>> {
    return apiGet<Shop[]>(SHOPS_BASE_URL);
  },

  getShopById(id: string): Promise<ApiResponse<ShopDetailResponse>> {
    return apiGet<ShopDetailResponse>(`${SHOPS_BASE_URL}/${id}`);
  },

  createShop(shop: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Shop>> {
    return apiPost<Shop>(SHOPS_BASE_URL, shop);
  },

  updateShop(id: string, shop: Partial<Shop>): Promise<ApiResponse<Shop>> {
    return apiPut<Shop>(`${SHOPS_BASE_URL}/${id}`, shop);
  },

  deleteShop(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${SHOPS_BASE_URL}/${id}`);
  },

  // Shop users management
  getShopUsers(shopId: string): Promise<ApiResponse<ShopUserResponse[]>> {
    return apiGet<ShopUserResponse[]>(`${SHOPS_BASE_URL}/${shopId}/users`);
  },

  addUserToShop(shopId: string, userData: CreateShopUserRequest): Promise<ApiResponse<ShopUserResponse>> {
    return apiPost<ShopUserResponse>(`${SHOPS_BASE_URL}/${shopId}/users`, userData);
  },

  updateShopUser(shopId: string, shopUserId: string, userData: UpdateShopUserRequest): Promise<ApiResponse<ShopUserResponse>> {
    return apiPut<ShopUserResponse>(`${SHOPS_BASE_URL}/${shopId}/users/${shopUserId}`, userData);
  },

  removeUserFromShop(shopId: string, shopUserId: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${SHOPS_BASE_URL}/${shopId}/users/${shopUserId}`);
  },
};