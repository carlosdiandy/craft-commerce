import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Review = Database['public']['Tables']['reviews']['Row'];
export type CreateReviewRequest = Database['public']['Tables']['reviews']['Insert'];
export type UpdateReviewRequest = Database['public']['Tables']['reviews']['Update'];

export const reviewService = {
  async getProductReviews(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey(first_name, last_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async createReview(review: CreateReviewRequest) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...review, user_id: user.id })
      .select(`
        *,
        profiles!reviews_user_id_fkey(first_name, last_name)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateReview(id: string, review: UpdateReviewRequest) {
    const { data, error } = await supabase
      .from('reviews')
      .update(review)
      .eq('id', id)
      .select(`
        *,
        profiles!reviews_user_id_fkey(first_name, last_name)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};