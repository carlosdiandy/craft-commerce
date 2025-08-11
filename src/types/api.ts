
// Base API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Success and Error response types for API service
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  status?: number;
  path?: string;
  details?: { [key: string]: string }; // New field for validation errors
}

// User roles and status
export type UserRole = 'ROLE_CLIENT' | 'ROLE_SHOP_OWNER' | 'ROLE_ADMIN' | 'ROLE_SHOP_EMPLOYEE'; // Updated
export type ShopOwnerStatus = 'pending' | 'approved' | 'rejected';
export type ShopUserRole = 'SHOP_ADMIN' | 'SHOP_EMPLOYEE';

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  shopOwnerStatus?: ShopOwnerStatus;
  shops?: Shop[];
}

export interface UserResponse extends User {
  shopOwnerStatus?: ShopOwnerStatus;
  shops?: Shop[];
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
  shopOwnerType?: 'individual' | 'company';
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken?: string;
  shopOwnerStatus?: ShopOwnerStatus;
  success?: boolean;
  message?: string;
  error?: string;
}

// Product related types
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  color?: string;
  size?: string;
  material?: string;
  priceAdjustment?: number;
}

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
  variants?: ProductVariant[];
  lowStockThreshold?: number; // Added
}

export interface ProductResponse extends Product {
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductsListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductDetailResponse extends ProductResponse { }

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  shopId: string;
  images?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

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

export interface ShopsListResponse {
  shops: ShopResponse[];
  total: number;
}

export interface ShopDetailResponse extends ShopResponse {
  products?: ProductResponse[];
}

export interface ShopUser {
  id: string;
  name: string;
  email: string;
  role: ShopUserRole;
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
  name?: string;
  email?: string;
}

export interface CreateShopUserRequest {
  userId: string;
  role: string;
  permissions?: string[];
}

export interface UpdateShopUserRequest extends Partial<CreateShopUserRequest> { }

// Order related types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

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
  orderDate?: string;
  totalAmount?: number;
  orderItems?: OrderItem[];
}

export interface OrderResponse extends Order {
  trackingNumber?: string;
}

export interface OrdersListResponse {
  orders: OrderResponse[];
  total: number;
}

export interface OrderDetailResponse extends OrderResponse { }

export interface UpdateOrderRequest {
  status?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
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

export interface ReviewsListResponse {
  reviews: ReviewResponse[];
  total: number;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

// Shipping types
export interface Shipping {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
  addressId: string;
  shippingMethod: string;
  shippingCost: number;
  shippingDate: string;
  deliveryDate?: string;
}

export interface ShippingResponse {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export interface CreateShippingRequest {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: { [key: string]: string };
}

// Wishlist item
export interface WishlistItem {
  productId: string;
  addedDate: string;
  quantity: number;
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

// Users list response
export interface UsersListResponse {
  users: UserResponse[];
  total: number;
}

// New Interfaces for Promotions, Coupons, Support Tickets, Analytics, GDPR

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number; // Use number for BigDecimal
  startDate: string; // LocalDateTime
  endDate: string; // LocalDateTime
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number; // Use number for BigDecimal
  expiryDate: string; // LocalDateTime
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  user: User; // User who created the ticket
  assignedTo?: User; // Support agent assigned to the ticket
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string; // LocalDateTime
  updatedAt?: string; // LocalDateTime
  resolvedAt?: string; // LocalDateTime
}

export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  totalShops: number;
  orderStatusDistribution: { [key: string]: number };
}

export interface GDPRData {
  userData: string; // JSON string of user data
}

// Permission type for role permissions service
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}
