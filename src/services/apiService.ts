import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  ApiErrorResponse, 
  ApiSuccessResponse 
} from '@/types/api';

// Base API configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors consistently
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorData = error.response?.data as any;
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: errorData?.error || error.message || 'An error occurred',
      message: errorData?.message || error.message || 'Request failed',
      status: error.response?.status || 500,
      path: error.config?.url,
    };
    
    return Promise.reject(errorResponse);
  }
);

// Generic API response handler
export const handleApiResponse = <T>(response: AxiosResponse<T>): ApiSuccessResponse<T> => {
  return {
    success: true,
    data: response.data,
    message: 'Request successful',
  };
};

// Generic API error handler
export const handleApiError = (error: any): ApiErrorResponse => {
  if (error.success === false) {
    // Already processed by interceptor
    return error as ApiErrorResponse;
  }
  
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    message: error.message || 'Request failed',
    status: error.status || 500,
  };
};

// Generic API request wrapper
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await requestFn();
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Utility functions for common HTTP methods
export const apiGet = <T>(url: string): Promise<ApiResponse<T>> => {
  return apiRequest(() => apiClient.get<T>(url));
};

export const apiPost = <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest(() => apiClient.post<T>(url, data));
};

export const apiPut = <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest(() => apiClient.put<T>(url, data));
};

export const apiDelete = <T>(url: string): Promise<ApiResponse<T>> => {
  return apiRequest(() => apiClient.delete<T>(url));
};

export const apiPatch = <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  return apiRequest(() => apiClient.patch<T>(url, data));
};