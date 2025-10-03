import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

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
  deliveryInstructions: string;
  prescriptionImages: string[];
  prescriptionVerified: boolean;
  prescriptionVerifiedBy?: string;
  specialInstructions: string;
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

export interface CheckoutRequest {
  cartId: number;
  deliveryAddressId: string;
  paymentMethod: string;
  deliverySlot: string;
  deliveryInstructions: string;
  specialInstructions: string;
  prescriptionImages: string[];
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
  deliveryInstructions: string;
  specialInstructions: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface CancelOrderRequest {
  reason: string;
  notes: string;
}

export class OrderService {
  private static readonly BASE_URL = '/orders';

  static async checkout(
    request: CheckoutRequest,
  ): Promise<ApiResponse<CheckoutResponse>> {
    return apiInstance.post(`${this.BASE_URL}/checkout`, request);
  }

  static async verifyPayment(
    request: VerifyPaymentRequest,
  ): Promise<ApiResponse<Order>> {
    return apiInstance.post(`${this.BASE_URL}/verify-payment`, request);
  }

  static async getMyOrders(
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

    return apiInstance.get(`${this.BASE_URL}/my?${params.toString()}`);
  }

  static async getOrderDetails(
    orderNumber: string,
  ): Promise<ApiResponse<Order>> {
    return apiInstance.get(`${this.BASE_URL}/${orderNumber}`);
  }

  static async cancelOrder(
    orderNumber: string,
    request: CancelOrderRequest,
  ): Promise<ApiResponse<null>> {
    return apiInstance.post(`${this.BASE_URL}/${orderNumber}/cancel`, request);
  }

  static async reorder(orderNumber: string): Promise<ApiResponse<Order>> {
    return apiInstance.post(`${this.BASE_URL}/${orderNumber}/reorder`);
  }
}
