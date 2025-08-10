import { apiGet, apiDelete, ApiResponse } from './apiService';
import { GDPRData } from '@/types/api';

const GDPR_BASE_URL = '/gdpr';

export const gdprService = {
  exportUserData(userId: string): Promise<ApiResponse<string>> { // Backend returns string (JSON)
    return apiGet<string>(`${GDPR_BASE_URL}/export-data/${userId}`);
  },

  deleteUserData(userId: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${GDPR_BASE_URL}/delete-data/${userId}`);
  },
};
