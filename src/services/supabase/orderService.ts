import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type CreateOrderRequest = Database['public']['Tables']['orders']['Insert'];
export type UpdateOrderRequest = Database['public']['Tables']['orders']['Update'];

export const orderService = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(first_name, last_name, email),
        shops(name),
        order_items(
          *,
          products(name, image_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(first_name, last_name, email, phone),
        shops(name, description),
        order_items(
          *,
          products(name, image_url, description)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async getOrdersByShop(shopId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(first_name, last_name, email),
        order_items(
          *,
          products(name, image_url)
        )
      `)
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async getOrdersByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        shops(name),
        order_items(
          *,
          products(name, image_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async createOrder(orderData: { 
    shop_id: string; 
    total_amount: number; 
    items: { product_id: string; quantity: number; price: number }[] 
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        shop_id: orderData.shop_id,
        total_amount: orderData.total_amount,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { data: order, success: true };
  },

  async updateOrderStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateOrderTracking(id: string, trackingData: { 
    tracking_number?: string; 
    estimated_delivery_date?: string 
  }) {
    const { data, error } = await supabase
      .from('orders')
      .update(trackingData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },
};