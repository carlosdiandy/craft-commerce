import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Address = Database['public']['Tables']['addresses']['Row'];
export type CreateAddressRequest = Database['public']['Tables']['addresses']['Insert'];
export type UpdateAddressRequest = Database['public']['Tables']['addresses']['Update'];

export const addressService = {
  async getAllAddresses() {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async getAddressById(id: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createAddress(address: CreateAddressRequest) {
    const { data, error } = await supabase
      .from('addresses')
      .insert(address)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateAddress(id: string, address: UpdateAddressRequest) {
    const { data, error } = await supabase
      .from('addresses')
      .update(address)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteAddress(id: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};