/**
 * Cart Service
 * Handles all cart-related API operations
 */

import { ApiResponse } from '@interfaces/response/common';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from '@utils/AxiosUtil';

// Cart API Types based on the provided response structure
export interface CartItem {
  id: number;
  medicineVariantId: number;
  medicineName: string;
  medicineImage: string;
  variantName: string;
  pharmacyId: number;
  pharmacyName: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  totalMrp: number;
  totalPrice: number;
  discount: number;
  totalDiscount: number;
  gstRate: number;
  gstAmount: number;
  itemFinalAmount: number;
  savings: number;
  stockQuantity: number;
  isAvailable: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface CartData {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  totalQuantity: number;
  couponCode: string | null;
  couponDiscount: number;
  finalAmount: number;
  gstAmount: number;
  gstRate: number;
  freeDeliveryThreshold: number;
  totalSavings: number;
  deliveryCharge: number;
  minOrderAmount: number;
  isFreeDeliveryEligible: boolean;
  pharmacyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  medicineVariantId: number;
  quantity: number;
  pharmacyId: number;
}

export interface UpdateCartRequest {
  cartItemId: number;
  quantity: number;
}

export interface RemoveFromCartRequest {
  cartItemId: number;
}

export interface ApplyCouponRequest {
  cartId: number;
  couponCode: string;
}

export interface CouponValidationResponse {
  isValid: boolean;
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
  message: string;
  errors: string[];
}

class CartService {
  /**
   * Get all carts for the user (pharmacy-wise)
   */
  async getAllCarts(): Promise<ApiResponse<CartData[]>> {
    return getRequest<CartData[]>('/cart/user/all');
  }

  /**
   * Get cart by pharmacy ID
   */
  async getCartByPharmacy(pharmacyId: number): Promise<ApiResponse<CartData>> {
    return getRequest<CartData>(`/cart/${pharmacyId}`);
  }

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<ApiResponse<CartData>> {
    return postRequest<CartData, AddToCartRequest>('/cart/add', request);
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    request: UpdateCartRequest,
  ): Promise<ApiResponse<CartData>> {
    return putRequest<CartData, UpdateCartRequest>('/cart/update', request);
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(
    request: RemoveFromCartRequest,
  ): Promise<ApiResponse<CartData>> {
    return deleteRequest<CartData>('/cart/remove', request);
  }

  /**
   * Clear entire cart for a pharmacy
   */
  async clearCart(pharmacyId: number): Promise<ApiResponse<null>> {
    return deleteRequest<null>(`/cart/${pharmacyId}`);
  }

  /**
   * Apply coupon to cart
   */
  async applyCoupon(
    request: ApplyCouponRequest,
  ): Promise<ApiResponse<CartData>> {
    return postRequest<CartData, ApplyCouponRequest>('/cart/apply', request);
  }

  /**
   * Remove coupon from cart
   */
  async removeCoupon(cartId: number): Promise<ApiResponse<CartData>> {
    return deleteRequest<CartData>(`/cart/remove/${cartId}`);
  }

  /**
   * Validate cart before checkout
   */
  async validateCart(cartId: number): Promise<
    ApiResponse<{
      isValid: boolean;
      errors: string[];
      warnings: string[];
      updatedItems: CartItem[];
      totalAmount: number;
    }>
  > {
    return postRequest<
      {
        isValid: boolean;
        errors: string[];
        warnings: string[];
        updatedItems: CartItem[];
        totalAmount: number;
      },
      {}
    >(`/cart/validate/${cartId}`, {});
  }

  /**
   * Validate coupon
   */
  async validateCoupon(
    couponCode: string,
    cartId: number,
    orderAmount: number,
  ): Promise<ApiResponse<CouponValidationResponse>> {
    return postRequest<
      CouponValidationResponse,
      {
        couponCode: string;
        cartId: number;
        orderAmount: number;
      }
    >('/coupons/validate', {
      couponCode,
      cartId,
      orderAmount,
    });
  }
}

const cartService = new CartService();
export default cartService;
