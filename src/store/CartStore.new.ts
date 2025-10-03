import { create } from 'zustand';
import {
  CartService,
  Cart,
  AddToCartRequest,
  UpdateCartRequest,
  RemoveFromCartRequest,
} from '@services/CartService';

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

export interface CartPreview {
  pharmacyId: number;
  pharmacyName: string;
  itemCount: number;
  totalAmount: number;
  items: CartItem[];
}

interface CartState {
  carts: Record<number, Cart>;
  cartPreview: CartPreview[];
  loading: boolean;
  error: string | null;

  // Actions
  addToCart: (request: AddToCartRequest) => Promise<void>;
  removeFromCart: (request: RemoveFromCartRequest) => Promise<void>;
  updateQuantity: (request: UpdateCartRequest) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: (cartId: number) => Promise<void>;
  applyCoupon: (cartId: number, couponCode: string) => Promise<void>;
  removeCoupon: (cartId: number) => Promise<void>;
  validateCart: (cartId: number) => Promise<any>;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  generateCartPreview: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  carts: {},
  cartPreview: [],
  loading: false,
  error: null,

  addToCart: async (request: AddToCartRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.addToCart(request);
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[response.data.id] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to add item to cart' });
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (request: RemoveFromCartRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.removeFromCart(request);
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[response.data.id] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to remove item from cart' });
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (request: UpdateCartRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.updateCartItem(request);
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[response.data.id] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to update cart item' });
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await CartService.clearCart();
      set({ carts: {}, cartPreview: [] });
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear cart' });
    } finally {
      set({ loading: false });
    }
  },

  getCart: async (cartId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.getCart(cartId);
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[cartId] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch cart' });
    } finally {
      set({ loading: false });
    }
  },

  applyCoupon: async (cartId: number, couponCode: string) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.applyCoupon({
        cartId,
        couponCode,
      });
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[cartId] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to apply coupon' });
    } finally {
      set({ loading: false });
    }
  },

  removeCoupon: async (cartId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.removeCoupon(cartId);
      if (response.success && response.data) {
        const updatedCarts = { ...get().carts };
        updatedCarts[cartId] = response.data;
        set({ carts: updatedCarts });
        get().generateCartPreview();
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to remove coupon' });
    } finally {
      set({ loading: false });
    }
  },

  validateCart: async (cartId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await CartService.validateCart(cartId);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to validate cart' });
    } finally {
      set({ loading: false });
    }
  },

  getTotalItems: () => {
    return Object.values(get().carts).reduce(
      (total, cart) =>
        total +
        cart.items.reduce((cartTotal, item) => cartTotal + item.quantity, 0),
      0,
    );
  },

  getTotalAmount: () => {
    return Object.values(get().carts).reduce(
      (total, cart) => total + cart.finalAmount,
      0,
    );
  },

  generateCartPreview: () => {
    const carts = get().carts;
    const preview: CartPreview[] = Object.values(carts).map(cart => ({
      pharmacyId: cart.items[0]?.pharmacyId || 0,
      pharmacyName: cart.items[0]?.pharmacyName || '',
      itemCount: cart.totalQuantity,
      totalAmount: cart.finalAmount,
      items: cart.items,
    }));
    set({ cartPreview: preview });
  },
}));
