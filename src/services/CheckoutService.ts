/**
 * Checkout Service
 * Handles checkout, payment, and order-related API calls
 */

import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

export interface CheckoutRequest {
  cartId: number;
  deliveryAddressId: string;
  paymentMethod: 'RAZORPAY' | 'COD';
  deliverySlot: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
  prescriptionImages?: string[];
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  pharmacyId: number;
  pharmacyName: string;
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  couponDiscount: number;
  offerDiscount: number;
  couponCode?: string;
  totalDiscount: number;
  paymentGatewayOrderId: string;
  razorpayOrderId: string;
  paymentStatus: string;
  orderDate: number;
  estimatedDeliveryTime: number;
  deliverySlot: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface CartValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  updatedItems: any[];
  totalAmount: number;
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
  paymentMethod: string;
  paymentStatus: string;
  paymentTransactionId?: string;
  status: string;
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

export interface OrderItem {
  id: number;
  medicineVariantId: number;
  medicineName: string;
  medicineImage: string;
  variantName: string;
  manufacturer: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  totalMrp: number;
  totalSellingPrice: number;
  discount: number;
  totalDiscount: number;
  specialInstructions?: string;
  prescriptionRequired: boolean;
}

export interface CancelOrderRequest {
  reason: string;
  notes?: string;
}

class CheckoutService {
  /**
   * Initiate checkout process
   */
  async checkout(
    checkoutData: CheckoutRequest,
  ): Promise<ApiResponse<CheckoutResponse>> {
    const response = await apiInstance.post<ApiResponse<CheckoutResponse>>(
      '/orders/checkout',
      checkoutData,
    );
    return response.data;
  }

  /**
   * Verify payment after successful Razorpay payment
   */
  async verifyPayment(
    paymentData: PaymentVerificationRequest,
  ): Promise<ApiResponse<Order>> {
    const response = await apiInstance.post<ApiResponse<Order>>(
      '/orders/verify-payment',
      paymentData,
    );
    return response.data;
  }

  /**
   * Validate cart before checkout
   */
  async validateCart(
    cartId: number,
  ): Promise<ApiResponse<CartValidationResponse>> {
    const response = await apiInstance.post<
      ApiResponse<CartValidationResponse>
    >(`/cart/validate/${cartId}`, {});
    return response.data;
  }

  /**
   * Get user's orders with pagination and filtering
   */
  async getMyOrders(
    page: number = 0,
    size: number = 20,
    status?: string,
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await apiInstance.get<
      ApiResponse<PaginatedResponse<Order>>
    >(`/orders/my?${params.toString()}`);
    return response.data;
  }

  /**
   * Get specific order details by order number
   */
  async getOrderDetails(orderNumber: string): Promise<ApiResponse<Order>> {
    const response = await apiInstance.get<ApiResponse<Order>>(
      `/orders/${orderNumber}`,
    );
    return response.data;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(
    orderNumber: string,
    cancelData: CancelOrderRequest,
  ): Promise<ApiResponse<null>> {
    const response = await apiInstance.post<ApiResponse<null>>(
      `/orders/${orderNumber}/cancel`,
      cancelData,
    );
    return response.data;
  }

  /**
   * Reorder from a previous order
   */
  async reorder(orderNumber: string): Promise<ApiResponse<Order>> {
    const response = await apiInstance.post<ApiResponse<Order>>(
      `/orders/${orderNumber}/reorder`,
      {},
    );
    return response.data;
  }

  /**
   * Track order status
   */
  async trackOrder(orderNumber: string): Promise<
    ApiResponse<{
      currentStatus: string;
      statusHistory: Array<{
        status: string;
        timestamp: number;
        notes?: string;
      }>;
      estimatedDeliveryTime?: number;
      deliveryAgent?: {
        name: string;
        phone: string;
        location?: {
          latitude: number;
          longitude: number;
        };
      };
    }>
  > {
    const response = await apiInstance.get(`/orders/${orderNumber}/track`);
    return response.data;
  }

  /**
   * Rate and review an order
   */
  async rateOrder(
    orderNumber: string,
    ratingData: {
      rating: number;
      pharmacyRating?: number;
      deliveryRating?: number;
      reviewComment?: string;
    },
  ): Promise<ApiResponse<null>> {
    const response = await apiInstance.post<ApiResponse<null>>(
      `/orders/${orderNumber}/rate`,
      ratingData,
    );
    return response.data;
  }

  /**
   * Get order invoice/receipt
   */
  async getOrderInvoice(orderNumber: string): Promise<
    ApiResponse<{
      invoiceUrl: string;
      invoiceNumber: string;
    }>
  > {
    const response = await apiInstance.get(`/orders/${orderNumber}/invoice`);
    return response.data;
  }

  /**
   * Request order refund
   */
  async requestRefund(
    orderNumber: string,
    refundData: {
      reason: string;
      items?: Array<{
        orderItemId: number;
        quantity: number;
        reason: string;
      }>;
      refundAmount?: number;
      notes?: string;
    },
  ): Promise<
    ApiResponse<{
      refundRequestId: string;
      estimatedRefundTime: string;
      refundAmount: number;
    }>
  > {
    const response = await apiInstance.post(
      `/orders/${orderNumber}/refund`,
      refundData,
    );
    return response.data;
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
