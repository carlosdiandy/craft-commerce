import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Product, ProductResponse, ProductDetailResponse, CreateProductRequest, UpdateProductRequest, PaginatedResponse } from '@/types/api';

const PRODUCTS_BASE_URL = '/products';

export const productService = {
  getAllProducts(filters?: { shopId?: string; category?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<ProductResponse> | ProductResponse[]>> {
    const params = new URLSearchParams();
    if (filters?.shopId) params.append('shopId', filters.shopId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${PRODUCTS_BASE_URL}?${queryString}` : PRODUCTS_BASE_URL;
    
    return apiGet<PaginatedResponse<ProductResponse> | ProductResponse[]>(url);
  },

  getProductById(id: string): Promise<ApiResponse<ProductDetailResponse>> {
    return apiGet<ProductDetailResponse>(`${PRODUCTS_BASE_URL}/${id}`);
  },

  createProduct(product: CreateProductRequest): Promise<ApiResponse<ProductResponse>> {
    return apiPost<ProductResponse>(PRODUCTS_BASE_URL, product);
  },

  updateProduct(id: string, product: UpdateProductRequest): Promise<ApiResponse<ProductResponse>> {
    return apiPut<ProductResponse>(`${PRODUCTS_BASE_URL}/${id}`, product);
  },

  deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${PRODUCTS_BASE_URL}/${id}`);
  },
};