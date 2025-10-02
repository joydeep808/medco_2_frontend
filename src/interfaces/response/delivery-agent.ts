// types/delivery-agent.ts

import { Address, ApiResponse, PaginatedResponse } from './common';

export interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  pharmacy: {
    id: number;
    name: string;
    phone: string;
    address: Address;
  };
  status: 'READY_FOR_PICKUP' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  deliveryAddress: Address;
  distance: number;
  estimatedDeliveryTime: string; // ISO string
  createdAt: string;
}

export interface DeliveryDashboard {
  todayDeliveries: number;
  todayEarnings: number;
  pendingPickups: number;
  completedDeliveries: number;
  totalDistance: number;
  averageRating: number;
  currentStatus: 'AVAILABLE' | 'BUSY';
  recentDeliveries: {
    orderNumber: string;
    customerName: string;
    deliveryFee: number;
    status: string;
    completedAt: string;
  }[];
  weeklyEarnings: { date: string; earnings: number; deliveries: number }[];
}