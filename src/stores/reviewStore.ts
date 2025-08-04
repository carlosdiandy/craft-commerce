import { create } from 'zustand';
import axios from 'axios';
import { ReviewResponse, CreateReviewRequest, ApiResponse } from '@/types/api';
import { apiGet, apiPost, handleApiError } from '@/services/apiService';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  userName: string;
  createdAt?: string;
}

interface ReviewState {
  reviews: Review[];
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'userName'>) => Promise<void>;
  averageRating: number;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  averageRating: 0,

  fetchReviews: async (productId: string) => {
    try {
      const response = await apiGet<ReviewResponse[]>(`/reviews/product/${productId}`);
      if (response.success && response.data) {
        const fetchedReviews: Review[] = response.data;
        const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = fetchedReviews.length > 0 ? totalRating / fetchedReviews.length : 0;
        set({ reviews: fetchedReviews, averageRating: avgRating });
      } else {
        set({ reviews: [], averageRating: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      set({ reviews: [], averageRating: 0 });
    }
  },

  addReview: async (review) => {
    try {
      // Mock user data for now
      const userId = "user-1";
      const userName = "User";

      const reviewToSend: CreateReviewRequest = {
        rating: review.rating,
        comment: review.comment,
        productId: review.productId,
      };
      
      const response = await apiPost<ReviewResponse>("/reviews/", reviewToSend);
      if (response.success && response.data) {
        const newReview: Review = {
          ...response.data,
          userId,
          userName,
        };
        set(state => ({
          reviews: [...state.reviews, newReview],
          averageRating: (state.reviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating) / (state.reviews.length + 1),
        }));
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  },
}));
