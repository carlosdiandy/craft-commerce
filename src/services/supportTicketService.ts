import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { SupportTicket } from '@/types/api';

const SUPPORT_TICKETS_BASE_URL = '/support-tickets';

export const supportTicketService = {
  getAllTickets(): Promise<ApiResponse<SupportTicket[]>> {
    return apiGet<SupportTicket[]>(SUPPORT_TICKETS_BASE_URL);
  },

  getTicketById(id: string): Promise<ApiResponse<SupportTicket>> {
    return apiGet<SupportTicket>(`${SUPPORT_TICKETS_BASE_URL}/${id}`);
  },

  createTicket(ticket: SupportTicket): Promise<ApiResponse<SupportTicket>> {
    return apiPost<SupportTicket>(SUPPORT_TICKETS_BASE_URL, ticket);
  },

  updateTicket(id: string, ticket: SupportTicket): Promise<ApiResponse<SupportTicket>> {
    return apiPut<SupportTicket>(`${SUPPORT_TICKETS_BASE_URL}/${id}`, ticket);
  },

  deleteTicket(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${SUPPORT_TICKETS_BASE_URL}/${id}`);
  },

  assignTicket(ticketId: string, userId: string): Promise<ApiResponse<SupportTicket>> {
    return apiPost<SupportTicket>(`${SUPPORT_TICKETS_BASE_URL}/${ticketId}/assign/${userId}`);
  },

  getTicketsByUserId(userId: string): Promise<ApiResponse<SupportTicket[]>> {
    return apiGet<SupportTicket[]>(`${SUPPORT_TICKETS_BASE_URL}/user/${userId}`);
  },
};
