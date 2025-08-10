import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Promotion } from '@/types/api';

const PROMOTIONS_BASE_URL = '/promotions';

export const promotionService = {
  getAllPromotions(): Promise<ApiResponse<Promotion[]>> {
    return apiGet<Promotion[]>(PROMOTIONS_BASE_URL);
  },

  getPromotionById(id: string): Promise<ApiResponse<Promotion>> {
    return apiGet<Promotion>(`${PROMOTIONS_BASE_URL}/${id}`);
  },

  createPromotion(promotion: Promotion): Promise<ApiResponse<Promotion>> {
    return apiPost<Promotion>(PROMOTIONS_BASE_URL, promotion);
  },

  updatePromotion(id: string, promotion: Promotion): Promise<ApiResponse<Promotion>> {
    return apiPut<Promotion>(`${PROMOTIONS_BASE_URL}/${id}`, promotion);
  },

  deletePromotion(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${PROMOTIONS_BASE_URL}/${id}`);
  },
};
