import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type CreatePromotionRequest = Database['public']['Tables']['promotions']['Insert'];
export type UpdatePromotionRequest = Database['public']['Tables']['promotions']['Update'];

export const promotionService = {
  async getAllPromotions(filters?: { 
    page?: number; 
    limit?: number; 
    shopId?: string;
    isActive?: boolean; 
  }) {
    let query = supabase
      .from('promotions')
      .select(`
        *,
        shops(name)
      `);

    if (filters?.shopId) {
      query = query.eq('shop_id', filters.shopId);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      const from = ((filters.page || 1) - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, success: true };
  },

  async getPromotionById(id: string) {
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        shops(name, description)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createPromotion(promotion: CreatePromotionRequest) {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promotion)
      .select(`
        *,
        shops(name)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updatePromotion(id: string, promotion: UpdatePromotionRequest) {
    const { data, error } = await supabase
      .from('promotions')
      .update(promotion)
      .eq('id', id)
      .select(`
        *,
        shops(name)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deletePromotion(id: string) {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async getActivePromotions() {
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        shops(name)
      `)
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },
};