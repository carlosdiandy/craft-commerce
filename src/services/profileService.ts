import { apiGet, apiPut, ApiResponse } from './apiService';
import { UserResponse } from '@/types/api';

const PROFILE_BASE_URL = '/profile';

export const profileService = {
  getProfile(): Promise<ApiResponse<UserResponse>> {
    return apiGet<UserResponse>(PROFILE_BASE_URL);
  },

  updateProfile(data: Partial<UserResponse>): Promise<ApiResponse<UserResponse>> {
    return apiPut<UserResponse>(PROFILE_BASE_URL, data);
  },
};