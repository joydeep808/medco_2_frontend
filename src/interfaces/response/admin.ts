// types/admin.ts

import { Address, ApiResponse, PaginatedResponse, UserBase, Medicine, OrderItem } from '@interfaces/response/common';

export interface AdminUser extends UserBase {}

export interface PharmacyOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AdminPharmacy {
  id: number;
  name: string;
  description: string;
  licenseNumber: string;
  email: string;
  phone: string;
  owner: PharmacyOwner;
  address: Address;
  isOpen: boolean;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  totalRatings: number;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  pharmacy: {
    id: number;
    name: string;
    phone: string;
    address: {
      street: string;
      city: string;
      pincode: string;
    };
  };
  deliveryAgent?: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  status: string;
  totalAmount: number;
  deliveryFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: string;
  deliveryAddress: Address;
  items: OrderItem[];
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCoupon {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  usageLimit: number;
  userUsageLimit: number;
  usedCount: number;
  validFrom: number;
  validUntil: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponUsageStats {
  totalUsage: number;
  totalDiscount: number;
  uniqueUsers: number;
  usageByDate: { date: string; usage: number; discount: number }[];
  topUsers: { userId: number; userName: string; usageCount: number; totalDiscount: number }[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalPharmacies: number;
  totalDeliveryAgents: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  pendingPharmacyApprovals: number;
  activeDeliveryAgents: number;
  averageOrderValue: number;
  platformCommission: number;
  userGrowth: { date: string; newUsers: number; totalUsers: number }[];
  revenueByDate: { date: string; revenue: number; orders: number }[];
  topPharmacies: { pharmacyId: number; pharmacyName: string; totalOrders: number; totalRevenue: number }[];
}

export interface PlatformAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalPharmacies: number;
  totalDeliveryAgents: number;
  averageOrderValue: number;
  orderCompletionRate: number;
  customerRetentionRate: number;
  revenueGrowth: number;
  userGrowth: number;
  topCategories: { categoryId: number; categoryName: string; totalOrders: number; totalRevenue: number }[];
  geographicDistribution: { city: string; orders: number; revenue: number; pharmacies: number }[];
  period: { startDate: string; endDate: string };
}