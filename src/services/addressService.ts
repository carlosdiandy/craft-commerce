import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Address } from '@/types/api';

const ADDRESSES_BASE_URL = '/addresses';

export const addressService = {
  getAllAddresses(): Promise<ApiResponse<Address[]>> {
    return apiGet<Address[]>(ADDRESSES_BASE_URL);
  },

  getAddressById(id: string): Promise<ApiResponse<Address>> {
    return apiGet<Address>(`${ADDRESSES_BASE_URL}/${id}`);
  },

  createAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    return apiPost<Address>(ADDRESSES_BASE_URL, address);
  },

  updateAddress(id: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return apiPut<Address>(`${ADDRESSES_BASE_URL}/${id}`, address);
  },

  deleteAddress(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${ADDRESSES_BASE_URL}/${id}`);
  },
};