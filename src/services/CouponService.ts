import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  type: string;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: number;
  validUntil: number;
  isActive: boolean;
  isExpired: boolean;
  isValid: boolean;
  totalUsageLimit: number;
  usagePerUserLimit: number;
  currentUsageCount: number;
  remainingUsage: number;
  applicableZones: number[];
  applicablePharmacies: number[];
  applicableCategories: number[];
  userUsageCount: number;
  canUserUse: boolean;
  calculatedDiscount: number;
  discountText: string;
  createdAt: number;
  updatedAt: number;
}

export interface ValidateCouponRequest {
  couponCode: string;
  cartId: number;
  orderAmount: number;
}

export interface ValidateCouponResponse {
  isValid: boolean;
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
  message: string;
  errors: string[];
}

export class CouponService {
  private static readonly BASE_URL = '/coupons';

  static async getActiveCoupons(
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<Coupon>>> {
    return apiInstance.get(`${this.BASE_URL}/active?page=${page}&size=${size}`);
  }

  static async getCouponByCode(code: string): Promise<ApiResponse<Coupon>> {
    return apiInstance.get(`${this.BASE_URL}/code/${code}`);
  }

  static async validateCoupon(
    request: ValidateCouponRequest,
  ): Promise<ApiResponse<ValidateCouponResponse>> {
    return apiInstance.post(`${this.BASE_URL}/validate`, request);
  }

  static async applyCouponToCart(
    cartId: number,
    couponCode: string,
  ): Promise<ApiResponse<ValidateCouponResponse>> {
    return apiInstance.post(
      `${this.BASE_URL}/apply/${cartId}?couponCode=${couponCode}`,
    );
  }
}
