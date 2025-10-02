// requests/customer.ts

import { Coordinates, DateRange } from './common';

// Auth
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'CUSTOMER';
}

export interface GenerateOtpRequest {
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenQuery {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Profile
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: number; // timestamp
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

// Address
export interface CreateAddressRequest {
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions?: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}

// Cart
export interface AddToCartRequest {
  medicineVariantId: number;
  quantity: number;
  pharmacyId: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartItemId: number;
}

export interface ApplyCouponRequest {
  cartId: number;
  couponCode: string;
}

// Order
export interface CheckoutRequest {
  cartId: number;
  deliveryAddressId: string;
  paymentMethod: 'RAZORPAY' | string;
  deliverySlot: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
  prescriptionImages?: string[];
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface CancelOrderRequest {
  reason: string;
  notes?: string;
}

// Coupon
export interface ValidateCouponRequest {
  couponCode: string;
  cartId: number;
  orderAmount: number;
}

// Analytics
export interface UserOrderAnalyticsRequest extends DateRange {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}