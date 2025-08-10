import { apiGet, ApiResponse } from './apiService';
import { AnalyticsData } from '@/types/api';

const ANALYTICS_BASE_URL = '/analytics';

export const analyticsService = {
  getTotalOrders(): Promise<ApiResponse<number>> {
    return apiGet<number>(`${ANALYTICS_BASE_URL}/total-orders`);
  },

  getTotalRevenue(): Promise<ApiResponse<number>> {
    return apiGet<number>(`${ANALYTICS_BASE_URL}/total-revenue`);
  },

  getTotalProducts(): Promise<ApiResponse<number>> {
    return apiGet<number>(`${ANALYTICS_BASE_URL}/total-products`);
  },

  getTotalUsers(): Promise<ApiResponse<number>> {
    return apiGet<number>(`${ANALYTICS_BASE_URL}/total-users`);
  },

  getTotalShops(): Promise<ApiResponse<number>> {
    return apiGet<number>(`${ANALYTICS_BASE_URL}/total-shops`);
  },

  getOrderStatusDistribution(): Promise<ApiResponse<{ [key: string]: number }>> {
    return apiGet<{ [key: string]: number }>(`${ANALYTICS_BASE_URL}/order-status-distribution`);
  },
};
