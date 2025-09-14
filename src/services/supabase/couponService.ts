import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type CreateCouponRequest = Database['public']['Tables']['coupons']['Insert'];
export type UpdateCouponRequest = Database['public']['Tables']['coupons']['Update'];

export const couponService = {
  async getAllCoupons() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async getCouponById(id: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createCoupon(coupon: CreateCouponRequest) {
    const { data, error } = await supabase
      .from('coupons')
      .insert(coupon)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateCoupon(id: string, coupon: UpdateCouponRequest) {
    const { data, error } = await supabase
      .from('coupons')
      .update(coupon)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteCoupon(id: string) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async applyCoupon(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    
    // Check if coupon is still valid
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('Coupon has expired');
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      throw new Error('Coupon usage limit reached');
    }

    return { data, success: true };
  },
};