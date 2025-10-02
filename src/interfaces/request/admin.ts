// requests/admin.ts

import { DateRange } from './common';

// User
export interface UpdateUserStatusQuery {
  status: 'ACTIVE' | 'INACTIVE';
}

// Pharmacy
export interface ApprovePharmacyRequest {}
export interface RejectPharmacyRequest {
  reason: string;
}

export interface UpdatePharmacyRequest {
  name: string;
  description: string;
  phone: string;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
}

// Coupon
export interface CreateCouponRequest {
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  usageLimit: number;
  userUsageLimit: number;
  validFrom: number; // timestamp
  validUntil: number; // timestamp
  isActive: boolean;
}

export interface UpdateCouponRequest extends CreateCouponRequest {
  id: number;
}

export interface DeactivateCouponRequest {}

// Analytics
export interface PlatformAnalyticsQuery extends DateRange {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

// Delivery Assignment
export interface AssignDeliveryAgentRequest {}