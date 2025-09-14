import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Shop = Database['public']['Tables']['shops']['Row'];
export type CreateShopRequest = Database['public']['Tables']['shops']['Insert'];
export type UpdateShopRequest = Database['public']['Tables']['shops']['Update'];

export const shopService = {
  async getAllShops(filters?: { 
    page?: number; 
    limit?: number; 
    isFeatured?: boolean; 
    sortBy?: string; 
    sortOrder?: string; 
  }) {
    let query = supabase
      .from('shops')
      .select(`
        *,
        profiles!shops_owner_id_fkey(first_name, last_name, email)
      `);

    if (filters?.isFeatured) {
      query = query.eq('is_featured', filters.isFeatured);
    }

    if (filters?.sortBy) {
      const ascending = filters.sortOrder === 'asc';
      query = query.order(filters.sortBy, { ascending });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (filters?.limit) {
      const from = ((filters.page || 1) - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, success: true };
  },

  async getShopById(id: string) {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        profiles!shops_owner_id_fkey(first_name, last_name, email),
        products(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createShop(shop: CreateShopRequest) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('shops')
      .insert({ ...shop, owner_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateShop(id: string, shop: UpdateShopRequest) {
    const { data, error } = await supabase
      .from('shops')
      .update(shop)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteShop(id: string) {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async getShopUsers(shopId: string) {
    const { data, error } = await supabase
      .from('shop_users')
      .select(`
        *,
        profiles!shop_users_user_id_fkey(first_name, last_name, email)
      `)
      .eq('shop_id', shopId);

    if (error) throw error;
    return { data, success: true };
  },

  async addUserToShop(shopId: string, userData: { user_id: string; role?: string; permissions?: string[] }) {
    const { data, error } = await supabase
      .from('shop_users')
      .insert({ ...userData, shop_id: shopId })
      .select(`
        *,
        profiles!shop_users_user_id_fkey(first_name, last_name, email)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateShopUser(shopId: string, shopUserId: string, userData: { role?: string; permissions?: string[] }) {
    const { data, error } = await supabase
      .from('shop_users')
      .update(userData)
      .eq('id', shopUserId)
      .eq('shop_id', shopId)
      .select(`
        *,
        profiles!shop_users_user_id_fkey(first_name, last_name, email)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async removeUserFromShop(shopId: string, shopUserId: string) {
    const { error } = await supabase
      .from('shop_users')
      .delete()
      .eq('id', shopUserId)
      .eq('shop_id', shopId);

    if (error) throw error;
    return { success: true };
  },
};