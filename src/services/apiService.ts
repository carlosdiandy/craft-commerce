import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api';


// Export the ApiResponse type for other services
export type { ApiResponse } from '@/types/api';

// Base API configuration
export const API_BASE_URL = 'http://localhost:3000/api';
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    // On n'ajoute pas le token sur les routes publiques
    const isPublicRoute =
      config.url?.startsWith('/auth/login') ||
      config.url?.startsWith('/auth/register') ||
      config.url?.startsWith('/public/');

    if (!isPublicRoute && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    // On n'ajoute pas le token sur les routes publiques
    const isPublicRoute =
      error.config.url?.startsWith('/auth/login') ||
      error.config.url?.startsWith('/auth/register') ||
      error.config.url?.startsWith('/public/');


    if (
      error.response?.status === 401 && !isPublicRoute &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await apiClient.post('/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Sauvegarde
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        useAuthStore.setState({ accessToken, refreshToken: newRefreshToken });

        processQueue(null, accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion d'erreur générique
    const errorData = error.response?.data as any;
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: errorData?.error || error.message || 'An error occurred',
      message: errorData?.message || error.message || 'Request failed',
      status: error.response?.status || 500,
      path: originalRequest?.url,
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

  const errorData = error.response?.data;
  const status = error.response?.status || 500;
  let details: { [key: string]: string } | undefined;

  if (status === 400 && errorData) { // Assuming 400 for validation errors
    details = errorData; // The GlobalExceptionHandler returns a map directly
  }

  return {
    success: false,
    error: errorData?.error || error.message || 'An unexpected error occurred',
    message: errorData?.message || error.message || 'Request failed',
    status: status,
    path: error.config?.url,
    details: details,
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

