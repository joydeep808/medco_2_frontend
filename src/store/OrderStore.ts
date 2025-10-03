import { create } from 'zustand';
import {
  OrderService,
  Order,
  CheckoutRequest,
  CheckoutResponse,
  VerifyPaymentRequest,
  CancelOrderRequest,
} from '@services/OrderService';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  checkoutData: CheckoutResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  checkout: (request: CheckoutRequest) => Promise<CheckoutResponse | null>;
  verifyPayment: (request: VerifyPaymentRequest) => Promise<Order | null>;
  getMyOrders: (page?: number, size?: number, status?: string) => Promise<void>;
  getOrderDetails: (orderNumber: string) => Promise<void>;
  cancelOrder: (
    orderNumber: string,
    request: CancelOrderRequest,
  ) => Promise<void>;
  reorder: (orderNumber: string) => Promise<Order | null>;
  clearCurrentOrder: () => void;
  clearCheckoutData: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  checkoutData: null,
  loading: false,
  error: null,

  checkout: async (request: CheckoutRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.checkout(request);
      if (response.success && response.data) {
        set({ checkoutData: response.data, loading: false });
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({ error: error.message || 'Checkout failed', loading: false });
      return null;
    }
  },

  verifyPayment: async (request: VerifyPaymentRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.verifyPayment(request);
      if (response.success && response.data) {
        set({
          currentOrder: response.data,
          checkoutData: null,
          loading: false,
        });
        // Add to orders list
        const { orders } = get();
        set({ orders: [response.data, ...orders] });
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Payment verification failed',
        loading: false,
      });
      return null;
    }
  },

  getMyOrders: async (page: number = 0, size: number = 20, status?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.getMyOrders(page, size, status);
      console.log(response);
      if (response.success && response.data) {
        if (page === 0) {
          set({ orders: response.data.content, loading: false });
        } else {
          // Append for pagination
          const { orders } = get();
          set({
            orders: [...orders, ...response.data.content],
            loading: false,
          });
        }
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch orders',
        loading: false,
      });
    }
  },

  getOrderDetails: async (orderNumber: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.getOrderDetails(orderNumber);
      if (response.success && response.data) {
        set({ currentOrder: response.data, loading: false });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch order details',
        loading: false,
      });
    }
  },

  cancelOrder: async (orderNumber: string, request: CancelOrderRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.cancelOrder(orderNumber, request);
      if (response.success) {
        // Update order status in the list
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, status: 'CANCELLED', cancelledAt: Date.now() }
            : order,
        );
        set({ orders: updatedOrders, loading: false });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to cancel order',
        loading: false,
      });
    }
  },

  reorder: async (orderNumber: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.reorder(orderNumber);
      if (response.success && response.data) {
        const { orders } = get();
        set({
          orders: [response.data, ...orders],
          currentOrder: response.data,
          loading: false,
        });
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({ error: error.message || 'Failed to reorder', loading: false });
      return null;
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },

  clearCheckoutData: () => {
    set({ checkoutData: null });
  },
}));
