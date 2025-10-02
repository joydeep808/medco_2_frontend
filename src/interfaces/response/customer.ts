// types/customer.ts

import { Address, ApiResponse, PaginatedResponse, Medicine, OrderItem } from './common';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CustomerAddress extends Address {
  id: string;
  label: string;
  landmark?: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions?: string;
  createdAt: number;
}

export interface CartItem {
  id: number;
  medicineVariantId: number;
  medicineName: string;
  medicineImage?: string;
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

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
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

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  pharmacyId: number;
  pharmacyName: string;
  deliveryAddressId: string;
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  deliveryFee: number;
  minimumOrderFee: number;
  packagingFee: number;
  cgst: number;
  sgst: number;
  totalTax: number;
  totalAmount: number;
  couponDiscount: number;
  offerDiscount: number;
  totalSavings: number;
  totalQuantity: number;
  couponCode?: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  deliveryAddress: string;
  paymentMethod: 'RAZORPAY' | string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentTransactionId?: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARED'
    | 'READY_FOR_PICKUP'
    | 'ASSIGNED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  orderDate: number;
  confirmedAt?: number;
  preparedAt?: number;
  pickedUpAt?: number;
  deliveredAt?: number;
  cancelledAt?: number;
  deliveryAgentId?: number;
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
  estimatedDeliveryTime: number;
  actualDeliveryTime?: number;
  deliverySlot: string;
  deliveryInstructions?: string;
  prescriptionImages?: string[];
  prescriptionVerified: boolean;
  prescriptionVerifiedBy?: string;
  specialInstructions?: string;
  pharmacyNotes?: string;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancelledBy?: string;
  rating?: number;
  pharmacyRating?: number;
  deliveryRating?: number;
  reviewComment?: string;
  reviewDate?: number;
  items: OrderItem[];
  createdAt: number;
  updatedAt: number;
}

export interface UserOrderAnalytics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  totalSavings: number;
  completedOrders: number;
  cancelledOrders: number;
  favoritePharmacies: { pharmacyId: number; pharmacyName: string; orderCount: number; totalSpent: number }[];
  topMedicines: { medicineId: number; medicineName: string; orderCount: number; totalQuantity: number }[];
  spendingByMonth: { month: string; amount: number; orders: number }[];
  period: { startDate: string; endDate: string };
}