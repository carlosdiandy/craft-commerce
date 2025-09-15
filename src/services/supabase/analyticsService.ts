import { supabase } from '@/integrations/supabase/client';

export const analyticsService = {
  async getTotalOrders() {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { data: count || 0, success: true };
  },

  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed');

    if (error) throw error;
    
    const total = data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    return { data: total, success: true };
  },

  async getTotalProducts() {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { data: count || 0, success: true };
  },

  async getTotalUsers() {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { data: count || 0, success: true };
  },

  async getTotalShops() {
    const { count, error } = await supabase
      .from('shops')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { data: count || 0, success: true };
  },

  async getOrderStatusDistribution() {
    const { data, error } = await supabase
      .from('orders')
      .select('status');

    if (error) throw error;

    const distribution = data?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }) || {};

    return { data: distribution, success: true };
  },
};