import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Review, ReviewResponse, CreateReviewRequest } from '@/types/api';

const REVIEWS_BASE_URL = '/reviews';

export const reviewService = {
  getProductReviews(productId: string): Promise<ApiResponse<ReviewResponse[]>> {
    return apiGet<ReviewResponse[]>(`${REVIEWS_BASE_URL}/product/${productId}`);
  },

  createReview(review: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> {
    return apiPost<ReviewResponse>(REVIEWS_BASE_URL, review);
  },

  updateReview(id: string, review: Partial<CreateReviewRequest>): Promise<ApiResponse<ReviewResponse>> {
    return apiPut<ReviewResponse>(`${REVIEWS_BASE_URL}/${id}`, review);
  },

  deleteReview(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${REVIEWS_BASE_URL}/${id}`);
  },
};