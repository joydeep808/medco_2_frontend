import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse } from '@interfaces/response/common';

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

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  totalQuantity: number;
  couponCode?: string;
  couponDiscount: number;
  finalAmount: number;
  gstAmount: number;
  gstRate: number;
  freeDeliveryThreshold: number;
  totalSavings: number;
  deliveryCharge: number;
  minOrderAmount: number;
  isFreeDeliveryEligible: boolean;
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

export interface CartValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  updatedItems: any[];
  totalAmount: number;
}

export class CartService {
  private static readonly BASE_URL = '/cart';

  static async getCart(cartId: number): Promise<ApiResponse<Cart>> {
    return apiInstance.get(`${this.BASE_URL}/${cartId}`);
  }

  static async addToCart(
    request: AddToCartRequest,
  ): Promise<ApiResponse<Cart>> {
    return apiInstance.post(`${this.BASE_URL}/add`, request);
  }

  static async updateCartItem(
    request: UpdateCartRequest,
  ): Promise<ApiResponse<Cart>> {
    return apiInstance.put(`${this.BASE_URL}/update`, request);
  }

  static async removeFromCart(
    request: RemoveFromCartRequest,
  ): Promise<ApiResponse<Cart>> {
    return apiInstance.delete(`${this.BASE_URL}/remove`, { data: request });
  }

  static async clearCart(): Promise<ApiResponse<null>> {
    return apiInstance.delete(`${this.BASE_URL}`);
  }

  static async applyCoupon(
    request: ApplyCouponRequest,
  ): Promise<ApiResponse<Cart>> {
    return apiInstance.post(`${this.BASE_URL}/apply`, request);
  }

  static async removeCoupon(cartId: number): Promise<ApiResponse<Cart>> {
    return apiInstance.delete(`${this.BASE_URL}/remove/${cartId}`);
  }

  static async validateCart(
    cartId: number,
  ): Promise<ApiResponse<CartValidationResponse>> {
    return apiInstance.post(`${this.BASE_URL}/validate/${cartId}`);
  }
}
