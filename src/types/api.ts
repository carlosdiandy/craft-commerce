
// Base API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ROLE_CLIENT' | 'ROLE_SHOP_OWNER' | 'ROLE_ADMIN';
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface UserResponse extends User {
  shopOwnerStatus?: 'pending' | 'approved' | 'rejected';
}

// Authentication types
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

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
  shopOwnerStatus?: 'pending' | 'approved' | 'rejected';
}

// Product related types
export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  shopId: string;
  shopName: string;
  category: string;
  stock: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export interface ProductResponse extends Product {
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
}

// Shop related types
export interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  ownerId: string;
  ownerName?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  productsCount?: number;
  location?: string;
  products?: Product[];
  shopUsers?: ShopUser[];
}

export interface ShopResponse {
  id: string;
  name: string;
  description: string;
  image?: string;
  ownerId: string;
  ownerName?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  productsCount?: number;
  location?: string;
}

export interface ShopUser {
  id: string;
  name: string;
  email: string;
  role: string;
  shopId: string;
  createdAt: string;
  permissions?: string[];
}

export interface ShopUserResponse {
  id: string;
  userId: string;
  shopId: string;
  role: string;
  permissions?: string[];
  createdAt: string;
}

// Order related types
export interface Order {
  id: string;
  userId: string;
  userName?: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: Address;
  paymentMethod?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderResponse extends Order {
  trackingNumber?: string;
}

// Address type
export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewResponse extends Review {
  productName?: string;
  userAvatar?: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
