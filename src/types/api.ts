// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  path?: string;
  status: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Authentication Response Types
export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  token: string;
}

export interface LoginResponse extends ApiSuccessResponse<AuthResponse> {}
export interface RegisterResponse extends ApiSuccessResponse<AuthResponse> {}

// User Response Types
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  shopOwnerStatus?: string;
  shops?: ShopResponse[];
}

export interface UsersListResponse extends ApiSuccessResponse<UserResponse[]> {}
export interface UserDetailResponse extends ApiSuccessResponse<UserResponse> {}

// Shop Response Types
export interface ShopResponse {
  id: string;
  name: string;
  description: string;
  image?: string;
  rating?: number;
  productsCount?: number;
  location?: string;
  ownerId: string;
  ownerName: string;
  status: string;
  createdAt: string;
}

export interface ShopsListResponse extends ApiSuccessResponse<ShopResponse[]> {}
export interface ShopDetailResponse extends ApiSuccessResponse<ShopResponse> {}

// Product Response Types
export interface ProductVariantResponse {
  id?: string;
  color?: string;
  size?: string;
  material?: string;
  stock: number;
  priceAdjustment: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  images: string[];
  shopId: string;
  shopName: string;
  category: string;
  stock: number;
  description: string;
  variants?: ProductVariantResponse[];
}

export interface ProductsListResponse extends ApiSuccessResponse<ProductResponse[]> {}
export interface ProductDetailResponse extends ApiSuccessResponse<ProductResponse> {}

// Order Response Types
export interface OrderItemResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderResponse {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shopId: string;
  shopName?: string;
  items: OrderItemResponse[];
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
}

export interface OrdersListResponse extends ApiSuccessResponse<OrderResponse[]> {}
export interface OrderDetailResponse extends ApiSuccessResponse<OrderResponse> {}

// Review Response Types
export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  userName: string;
  createdAt?: string;
}

export interface ReviewsListResponse extends ApiSuccessResponse<ReviewResponse[]> {}
export interface ReviewDetailResponse extends ApiSuccessResponse<ReviewResponse> {}

// Shipping Response Types
export interface ShippingResponse {
  id: string;
  orderId: string;
  addressId: string;
  shippingMethod: string;
  shippingCost: number;
  shippingDate: string;
  deliveryDate: string;
}

export interface ShippingDetailResponse extends ApiSuccessResponse<ShippingResponse> {}

// Shop User Response Types
export interface ShopUserResponse {
  id: string;
  userId: string;
  shopId: string;
  role: string;
  permissions: string[];
}

export interface ShopUsersListResponse extends ApiSuccessResponse<ShopUserResponse[]> {}
export interface ShopUserDetailResponse extends ApiSuccessResponse<ShopUserResponse> {}

// Generic List Response with Pagination
export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  images: string[];
  shopId: string;
  category: string;
  stock: number;
  description: string;
  variants?: Omit<ProductVariantResponse, 'id'>[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  productId: string;
}

export interface CreateShippingRequest {
  orderId: string;
  addressId: string;
  shippingMethod: string;
  shippingCost: number;
  shippingDate: string;
  deliveryDate: string;
}

export interface UpdateOrderRequest {
  status?: OrderResponse['status'];
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export interface CreateShopUserRequest {
  userId: string;
  role: string;
  permissions: string[];
}

export interface UpdateShopUserRequest extends Partial<CreateShopUserRequest> {
  id: string;
}