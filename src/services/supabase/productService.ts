import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type CreateProductRequest = Database['public']['Tables']['products']['Insert'];
export type UpdateProductRequest = Database['public']['Tables']['products']['Update'];

export const productService = {
  async getAllProducts(filters?: { 
    page?: number; 
    limit?: number; 
    shopId?: string;
    category?: string;
    sortBy?: string; 
    sortOrder?: string; 
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        shops(name, logo_url)
      `);

    if (filters?.shopId) {
      query = query.eq('shop_id', filters.shopId);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
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

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        shops(name, logo_url, description),
        reviews(
          id,
          rating,
          comment,
          created_at,
          profiles!reviews_user_id_fkey(first_name, last_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createProduct(product: CreateProductRequest) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateProduct(id: string, product: UpdateProductRequest) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};