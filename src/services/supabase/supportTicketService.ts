import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type CreateSupportTicketRequest = Database['public']['Tables']['support_tickets']['Insert'];
export type UpdateSupportTicketRequest = Database['public']['Tables']['support_tickets']['Update'];

export const supportTicketService = {
  async getAllTickets() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email),
        assigned_profile:profiles!support_tickets_assigned_to_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },

  async getTicketById(id: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email),
        assigned_profile:profiles!support_tickets_assigned_to_fkey(first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async createTicket(ticket: CreateSupportTicketRequest) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ ...ticket, user_id: user.id })
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async updateTicket(id: string, ticket: UpdateSupportTicketRequest) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(ticket)
      .eq('id', id)
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email),
        assigned_profile:profiles!support_tickets_assigned_to_fkey(first_name, last_name, email)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async deleteTicket(id: string) {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async assignTicket(ticketId: string, userId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ assigned_to: userId })
      .eq('id', ticketId)
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email),
        assigned_profile:profiles!support_tickets_assigned_to_fkey(first_name, last_name, email)
      `)
      .single();

    if (error) throw error;
    return { data, success: true };
  },

  async getTicketsByUserId(userId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        profiles!support_tickets_user_id_fkey(first_name, last_name, email)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, success: true };
  },
};