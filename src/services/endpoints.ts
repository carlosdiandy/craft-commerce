import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ProductResponse,
  ProductsListResponse,
  ProductDetailResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ShopResponse,
  ShopsListResponse,
  ShopDetailResponse,
  OrderResponse,
  OrdersListResponse,
  OrderDetailResponse,
  UpdateOrderRequest,
  ReviewResponse,
  ReviewsListResponse,
  CreateReviewRequest,
  ShippingResponse,
  CreateShippingRequest,
  UserResponse,
  UsersListResponse,
  ShopUserResponse,
  CreateShopUserRequest,
  UpdateShopUserRequest,
  ApiResponse
} from '@/types/api';
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/apiService';

// Authentication endpoints
export const authAPI = {
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiPost<AuthResponse>('/auth/signin', data),
  
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiPost<AuthResponse>('/auth/signup', data),
  
  logout: (): Promise<ApiResponse<any>> =>
    apiPost<any>('/auth/signout'),
};

// Product endpoints
export const productAPI = {
  getAll: (params?: Record<string, string>): Promise<ApiResponse<ProductResponse[]>> => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiGet<ProductResponse[]>(`/products/${queryString}`);
  },
  
  getById: (id: string): Promise<ApiResponse<ProductResponse>> =>
    apiGet<ProductResponse>(`/products/${id}`),
  
  create: (data: CreateProductRequest): Promise<ApiResponse<ProductResponse>> =>
    apiPost<ProductResponse>('/products/', data),
  
  update: (id: string, data: UpdateProductRequest): Promise<ApiResponse<ProductResponse>> =>
    apiPut<ProductResponse>(`/products/${id}`, data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/products/${id}`),
  
  getByShop: (shopId: string): Promise<ApiResponse<ProductResponse[]>> =>
    apiGet<ProductResponse[]>(`/products/?shopId=${shopId}`),
};

// Shop endpoints
export const shopAPI = {
  getAll: (): Promise<ApiResponse<ShopResponse[]>> =>
    apiGet<ShopResponse[]>('/shops/'),
  
  getById: (id: string): Promise<ApiResponse<ShopResponse>> =>
    apiGet<ShopResponse>(`/shops/${id}`),
  
  create: (data: Partial<ShopResponse>): Promise<ApiResponse<ShopResponse>> =>
    apiPost<ShopResponse>('/shops/', data),
  
  update: (id: string, data: Partial<ShopResponse>): Promise<ApiResponse<ShopResponse>> =>
    apiPut<ShopResponse>(`/shops/${id}`, data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/shops/${id}`),
};

// Order endpoints
export const orderAPI = {
  getAll: (): Promise<ApiResponse<OrderResponse[]>> =>
    apiGet<OrderResponse[]>('/orders/'),
  
  getById: (id: string): Promise<ApiResponse<OrderResponse>> =>
    apiGet<OrderResponse>(`/orders/${id}`),
  
  create: (data: Partial<OrderResponse>): Promise<ApiResponse<OrderResponse>> =>
    apiPost<OrderResponse>('/orders/', data),
  
  updateStatus: (id: string, status: string): Promise<ApiResponse<OrderResponse>> =>
    apiPut<OrderResponse>(`/orders/${id}/status`, { status }),
  
  updateTracking: (id: string, data: { trackingNumber?: string; estimatedDeliveryDate?: string }): Promise<ApiResponse<OrderResponse>> =>
    apiPut<OrderResponse>(`/orders/${id}/tracking`, data),
  
  getByUser: (userId: string): Promise<ApiResponse<OrderResponse[]>> =>
    apiGet<OrderResponse[]>(`/orders/user/${userId}`),
};

// Review endpoints
export const reviewAPI = {
  getByProduct: (productId: string): Promise<ApiResponse<ReviewResponse[]>> =>
    apiGet<ReviewResponse[]>(`/reviews/product/${productId}`),
  
  create: (data: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> =>
    apiPost<ReviewResponse>('/reviews/', data),
  
  update: (id: string, data: Partial<ReviewResponse>): Promise<ApiResponse<ReviewResponse>> =>
    apiPut<ReviewResponse>(`/reviews/${id}`, data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/reviews/${id}`),
};

// Shipping endpoints
export const shippingAPI = {
  getByOrderId: (orderId: string): Promise<ApiResponse<ShippingResponse>> =>
    apiGet<ShippingResponse>(`/shipping/order/${orderId}`),
  
  create: (data: CreateShippingRequest): Promise<ApiResponse<ShippingResponse>> =>
    apiPost<ShippingResponse>('/shipping', data),
  
  update: (id: string, data: Partial<ShippingResponse>): Promise<ApiResponse<ShippingResponse>> =>
    apiPut<ShippingResponse>(`/shipping/${id}`, data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/shipping/${id}`),
};

// User management endpoints
export const userAPI = {
  getAll: (): Promise<ApiResponse<UserResponse[]>> =>
    apiGet<UserResponse[]>('/admin/users/'),
  
  getById: (id: string): Promise<ApiResponse<UserResponse>> =>
    apiGet<UserResponse>(`/admin/users/${id}`),
  
  update: (id: string, data: Partial<UserResponse>): Promise<ApiResponse<UserResponse>> =>
    apiPut<UserResponse>(`/admin/users/${id}`, data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/admin/users/${id}`),
  
  updateShopOwnerStatus: (id: string, status: string): Promise<ApiResponse<UserResponse>> =>
    apiPut<UserResponse>(`/admin/users/${id}`, { shopOwnerStatus: status }),
};

// Shop user management endpoints
export const shopUserAPI = {
  getByShop: (shopId: string): Promise<ApiResponse<ShopUserResponse[]>> =>
    apiGet<ShopUserResponse[]>(`/shops/${shopId}/users`),
  
  create: (shopId: string, data: CreateShopUserRequest): Promise<ApiResponse<ShopUserResponse>> =>
    apiPost<ShopUserResponse>(`/shops/${shopId}/users`, data),
  
  update: (shopId: string, userId: string, data: UpdateShopUserRequest): Promise<ApiResponse<ShopUserResponse>> =>
    apiPut<ShopUserResponse>(`/shops/${shopId}/users/${userId}`, data),
  
  delete: (shopId: string, userId: string): Promise<ApiResponse<void>> =>
    apiDelete<void>(`/shops/${shopId}/users/${userId}`),
};