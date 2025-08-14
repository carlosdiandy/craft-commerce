import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Shop, ShopResponse, ShopDetailResponse, ShopUser, ShopUserResponse, CreateShopUserRequest, UpdateShopUserRequest } from '@/types/api';

const SHOPS_BASE_URL = '/shops';

export const shopService = {
  // Shop CRUD operations
  getAllShops(filters?: { page?: number; limit?: number; isFeatured?: boolean; sortBy?: string; sortOrder?: 'asc' | 'desc'; }): Promise<ApiResponse<PaginatedResponse<ShopResponse> | ShopResponse[]>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.isFeatured) params.append('isFeatured', filters.isFeatured.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `${SHOPS_BASE_URL}?${queryString}` : SHOPS_BASE_URL;

    return apiGet<PaginatedResponse<ShopResponse> | ShopResponse[]>(url);
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