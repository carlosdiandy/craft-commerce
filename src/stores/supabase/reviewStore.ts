import { create } from 'zustand';
import { reviewService, Review } from '@/services/supabase/reviewService';

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  averageRating: number;
}

interface ReviewActions {
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (review: { product_id: string; rating: number; comment?: string }) => Promise<{ success: boolean; error?: string }>;
  updateReview: (id: string, review: { rating: number; comment?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteReview: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

type ReviewStore = ReviewState & ReviewActions;

export const useReviewStore = create<ReviewStore>()((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,
  averageRating: 0,

  fetchReviews: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reviewService.getProductReviews(productId);
      const reviews = data || [];
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      set({
        reviews,
        averageRating,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  addReview: async (review) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reviewService.createReview(review as any);
      set((state) => {
        const newReviews = [...state.reviews, data];
        const averageRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          reviews: newReviews,
          averageRating,
          isLoading: false,
        };
      });
      return { success: true };
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  updateReview: async (id: string, review) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reviewService.updateReview(id, review);
      set((state) => {
        const updatedReviews = state.reviews.map((r) =>
          r.id === id ? { ...r, ...data } : r
        );
        const averageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          reviews: updatedReviews,
          averageRating,
          isLoading: false,
        };
      });
      return { success: true };
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  deleteReview: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await reviewService.deleteReview(id);
      set((state) => {
        const filteredReviews = state.reviews.filter((r) => r.id !== id);
        const averageRating = filteredReviews.length > 0 
          ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length 
          : 0;
        return {
          reviews: filteredReviews,
          averageRating,
          isLoading: false,
        };
      });
      return { success: true };
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));