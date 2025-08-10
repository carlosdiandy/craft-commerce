import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';
import { Coupon } from '@/types/api';

const COUPONS_BASE_URL = '/coupons';

export const couponService = {
  getAllCoupons(): Promise<ApiResponse<Coupon[]>> {
    return apiGet<Coupon[]>(COUPONS_BASE_URL);
  },

  getCouponById(id: string): Promise<ApiResponse<Coupon>> {
    return apiGet<Coupon>(`${COUPONS_BASE_URL}/${id}`);
  },

  createCoupon(coupon: Coupon): Promise<ApiResponse<Coupon>> {
    return apiPost<Coupon>(COUPONS_BASE_URL, coupon);
  },

  updateCoupon(id: string, coupon: Coupon): Promise<ApiResponse<Coupon>> {
    return apiPut<Coupon>(`${COUPONS_BASE_URL}/${id}`, coupon);
  },

  deleteCoupon(id: string): Promise<ApiResponse<void>> {
    return apiDelete<void>(`${COUPONS_BASE_URL}/${id}`);
  },

  applyCoupon(code: string): Promise<ApiResponse<Coupon>> {
    return apiPost<Coupon>(`${COUPONS_BASE_URL}/apply/${code}`);
  },
};
