/**
 * Enhanced Cart Store with API Integration
 * Manages pharmacy-wise cart system using Zustand with API sync
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import cartService, {
  CartData,
  CartItem,
  AddToCartRequest,
  UpdateCartRequest,
} from '@services/CartService';

// MMKV instance for cart data persistence
const cartStorage = new MMKV({
  id: 'cart-storage-v2',
  encryptionKey: 'medco-cart-key-v2',
});

export interface CartState {
  // Cart data - pharmacy-wise
  carts: { [pharmacyId: number]: CartData };
  activePharmacyId: number | null;

  // Loading states
  isLoading: boolean;
  isAddingToCart: boolean;
  isUpdatingCart: boolean;
  isRemovingFromCart: boolean;
  isClearingCart: boolean;
  isApplyingCoupon: boolean;

  // Error handling
  error: string | null;
  lastError: string | null;

  // Cart summary
  totalItems: number;
  totalAmount: number;

  // Actions - Cart Management
  loadAllCarts: () => Promise<void>;
  loadCartByPharmacy: (pharmacyId: number) => Promise<void>;
  setActiveCart: (pharmacyId: number) => void;
  clearCart: (pharmacyId: number) => Promise<void>;
  clearAllCarts: () => void;

  // Actions - Item Management
  addToCart: (request: AddToCartRequest) => Promise<boolean>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (cartItemId: number) => Promise<boolean>;

  // Actions - Coupon Management
  applyCoupon: (pharmacyId: number, couponCode: string) => Promise<boolean>;
  removeCoupon: (pharmacyId: number) => Promise<boolean>;

  // Actions - Utility
  getCartItemCount: (pharmacyId?: number) => number;
  getCartTotal: (pharmacyId?: number) => number;
  hasItemInCart: (pharmacyId: number, medicineVariantId: number) => boolean;
  getItemQuantity: (pharmacyId: number, medicineVariantId: number) => number;
  getCartPreview: () => Array<{
    pharmacyId: number;
    pharmacyName: string;
    itemCount: number;
    total: number;
  }>;

  // Actions - Persistence
  persistCarts: () => void;
  loadPersistedCarts: () => void;

  // Actions - Error handling
  clearError: () => void;
  setError: (error: string) => void;
}

// Helper functions
const loadPersistedCarts = (): { [pharmacyId: number]: CartData } => {
  try {
    const stored = cartStorage.getString('carts');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const loadActivePharmacyId = (): number | null => {
  try {
    const stored = cartStorage.getString('activePharmacyId');
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const calculateTotals = (carts: { [pharmacyId: number]: CartData }) => {
  const totalItems = Object.values(carts).reduce(
    (total, cart) => total + cart.totalQuantity,
    0,
  );

  const totalAmount = Object.values(carts).reduce(
    (total, cart) => total + cart.finalAmount,
    0,
  );

  return { totalItems, totalAmount };
};

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  carts: loadPersistedCarts(),
  activePharmacyId: loadActivePharmacyId(),

  isLoading: false,
  isAddingToCart: false,
  isUpdatingCart: false,
  isRemovingFromCart: false,
  isClearingCart: false,
  isApplyingCoupon: false,

  error: null,
  lastError: null,

  totalItems: 0,
  totalAmount: 0,

  // Cart Management Actions
  loadAllCarts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await cartService.getAllCarts();

      if (response.success && response.data) {
        const cartsMap: { [pharmacyId: number]: CartData } = {};

        response.data.forEach(cart => {
          cartsMap[cart.pharmacyId] = cart;
        });

        const { totalItems, totalAmount } = calculateTotals(cartsMap);

        set({
          carts: cartsMap,
          totalItems,
          totalAmount,
          isLoading: false,
        });

        get().persistCarts();
      } else {
        set({
          error: response.message || 'Failed to load carts',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load carts',
        isLoading: false,
      });
    }
  },

  loadCartByPharmacy: async (pharmacyId: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await cartService.getCartByPharmacy(pharmacyId);

      if (response.success && response.data) {
        const { carts } = get();
        const updatedCarts = {
          ...carts,
          [pharmacyId]: response.data,
        };

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          isLoading: false,
        });

        get().persistCarts();
      } else {
        set({
          error: response.message || 'Failed to load cart',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load cart',
        isLoading: false,
      });
    }
  },

  setActiveCart: (pharmacyId: number) => {
    set({ activePharmacyId: pharmacyId });
    cartStorage.set('activePharmacyId', pharmacyId.toString());
  },

  clearCart: async (pharmacyId: number) => {
    set({ isClearingCart: true, error: null });

    try {
      const response = await cartService.clearCart(pharmacyId);

      if (response.success) {
        const { carts, activePharmacyId } = get();
        const updatedCarts = { ...carts };
        delete updatedCarts[pharmacyId];

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          activePharmacyId:
            activePharmacyId === pharmacyId ? null : activePharmacyId,
          isClearingCart: false,
        });

        get().persistCarts();
      } else {
        set({
          error: response.message || 'Failed to clear cart',
          isClearingCart: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear cart',
        isClearingCart: false,
      });
    }
  },

  clearAllCarts: () => {
    set({
      carts: {},
      activePharmacyId: null,
      totalItems: 0,
      totalAmount: 0,
    });

    cartStorage.delete('carts');
    cartStorage.delete('activePharmacyId');
  },

  // Item Management Actions
  addToCart: async (request: AddToCartRequest) => {
    set({ isAddingToCart: true, error: null });

    try {
      const response = await cartService.addToCart(request);

      if (response.success && response.data) {
        const { carts } = get();
        const updatedCarts = {
          ...carts,
          [request.pharmacyId]: response.data,
        };

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          activePharmacyId: request.pharmacyId,
          isAddingToCart: false,
        });

        get().persistCarts();
        return true;
      } else {
        set({
          error: response.message || 'Failed to add item to cart',
          lastError: response.message || 'Failed to add item to cart',
          isAddingToCart: false,
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add item to cart';
      set({
        error: errorMessage,
        lastError: errorMessage,
        isAddingToCart: false,
      });
      return false;
    }
  },

  updateCartItem: async (cartItemId: number, quantity: number) => {
    set({ isUpdatingCart: true, error: null });

    try {
      const response = await cartService.updateCartItem({
        cartItemId,
        quantity,
      });

      if (response.success && response.data) {
        const { carts } = get();
        const updatedCarts = {
          ...carts,
          [response.data.pharmacyId]: response.data,
        };

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          isUpdatingCart: false,
        });

        get().persistCarts();
        return true;
      } else {
        set({
          error: response.message || 'Failed to update cart item',
          isUpdatingCart: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update cart item',
        isUpdatingCart: false,
      });
      return false;
    }
  },

  removeFromCart: async (cartItemId: number) => {
    set({ isRemovingFromCart: true, error: null });

    try {
      const response = await cartService.removeFromCart({ cartItemId });

      if (response.success && response.data) {
        const { carts } = get();
        const updatedCarts = {
          ...carts,
          [response.data.pharmacyId]: response.data,
        };

        // If cart is empty, remove it from the store
        if (response.data.items.length === 0) {
          delete updatedCarts[response.data.pharmacyId];
        }

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          isRemovingFromCart: false,
        });

        get().persistCarts();
        return true;
      } else {
        set({
          error: response.message || 'Failed to remove item from cart',
          isRemovingFromCart: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to remove item from cart',
        isRemovingFromCart: false,
      });
      return false;
    }
  },

  // Coupon Management Actions
  applyCoupon: async (pharmacyId: number, couponCode: string) => {
    set({ isApplyingCoupon: true, error: null });

    try {
      const { carts } = get();
      const cart = carts[pharmacyId];

      if (!cart) {
        set({
          error: 'Cart not found',
          isApplyingCoupon: false,
        });
        return false;
      }

      const response = await cartService.applyCoupon({
        cartId: cart.id,
        couponCode,
      });

      if (response.success && response.data) {
        const updatedCarts = {
          ...carts,
          [pharmacyId]: response.data,
        };

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          isApplyingCoupon: false,
        });

        get().persistCarts();
        return true;
      } else {
        set({
          error: response.message || 'Failed to apply coupon',
          isApplyingCoupon: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to apply coupon',
        isApplyingCoupon: false,
      });
      return false;
    }
  },

  removeCoupon: async (pharmacyId: number) => {
    set({ isApplyingCoupon: true, error: null });

    try {
      const { carts } = get();
      const cart = carts[pharmacyId];

      if (!cart) {
        set({
          error: 'Cart not found',
          isApplyingCoupon: false,
        });
        return false;
      }

      const response = await cartService.removeCoupon(cart.id);

      if (response.success && response.data) {
        const updatedCarts = {
          ...carts,
          [pharmacyId]: response.data,
        };

        const { totalItems, totalAmount } = calculateTotals(updatedCarts);

        set({
          carts: updatedCarts,
          totalItems,
          totalAmount,
          isApplyingCoupon: false,
        });

        get().persistCarts();
        return true;
      } else {
        set({
          error: response.message || 'Failed to remove coupon',
          isApplyingCoupon: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to remove coupon',
        isApplyingCoupon: false,
      });
      return false;
    }
  },

  // Utility Actions
  getCartItemCount: (pharmacyId?: number) => {
    const { carts } = get();

    if (pharmacyId) {
      const cart = carts[pharmacyId];
      return cart ? cart.totalQuantity : 0;
    }

    return Object.values(carts).reduce(
      (total, cart) => total + cart.totalQuantity,
      0,
    );
  },

  getCartTotal: (pharmacyId?: number) => {
    const { carts } = get();

    if (pharmacyId) {
      const cart = carts[pharmacyId];
      return cart ? cart.finalAmount : 0;
    }

    return Object.values(carts).reduce(
      (total, cart) => total + cart.finalAmount,
      0,
    );
  },

  hasItemInCart: (pharmacyId: number, medicineVariantId: number) => {
    const { carts } = get();
    const cart = carts[pharmacyId];
    return cart
      ? cart.items.some(item => item.medicineVariantId === medicineVariantId)
      : false;
  },

  getItemQuantity: (pharmacyId: number, medicineVariantId: number) => {
    const { carts } = get();
    const cart = carts[pharmacyId];
    const item = cart?.items.find(
      item => item.medicineVariantId === medicineVariantId,
    );
    return item ? item.quantity : 0;
  },

  getCartPreview: () => {
    const { carts } = get();

    return Object.values(carts).map(cart => ({
      pharmacyId: cart.pharmacyId,
      pharmacyName: cart.items[0]?.pharmacyName || 'Unknown Pharmacy',
      itemCount: cart.totalQuantity,
      total: cart.finalAmount,
    }));
  },

  // Persistence Actions
  persistCarts: () => {
    const { carts, activePharmacyId } = get();

    cartStorage.set('carts', JSON.stringify(carts));
    if (activePharmacyId) {
      cartStorage.set('activePharmacyId', activePharmacyId.toString());
    }

    const { totalItems, totalAmount } = calculateTotals(carts);
    set({ totalItems, totalAmount });
  },

  loadPersistedCarts: () => {
    const carts = loadPersistedCarts();
    const activePharmacyId = loadActivePharmacyId();
    const { totalItems, totalAmount } = calculateTotals(carts);

    set({
      carts,
      activePharmacyId,
      totalItems,
      totalAmount,
    });
  },

  // Error handling
  clearError: () => {
    set({ error: null, lastError: null });
  },

  setError: (error: string) => {
    set({ error, lastError: error });
  },
}));

// Selector hooks for easy access
export const useActiveCarts = () =>
  useCartStore(state =>
    Object.values(state.carts).filter(cart => cart.items.length > 0),
  );

export const useActiveCart = () =>
  useCartStore(state => {
    const { carts, activePharmacyId } = state;
    return activePharmacyId ? carts[activePharmacyId] : null;
  });

export const useCartItemCount = (pharmacyId?: number) =>
  useCartStore(state => state.getCartItemCount(pharmacyId));

export const useCartTotal = (pharmacyId?: number) =>
  useCartStore(state => state.getCartTotal(pharmacyId));

export const useCartLoading = () =>
  useCartStore(state => ({
    isLoading: state.isLoading,
    isAddingToCart: state.isAddingToCart,
    isUpdatingCart: state.isUpdatingCart,
    isRemovingFromCart: state.isRemovingFromCart,
    isClearingCart: state.isClearingCart,
    isApplyingCoupon: state.isApplyingCoupon,
  }));

export const useCartError = () =>
  useCartStore(state => ({
    error: state.error,
    lastError: state.lastError,
    clearError: state.clearError,
  }));

// Initialize store on app start
export const initializeCartStore = () => {
  const store = useCartStore.getState();
  store.loadPersistedCarts();
  store.loadAllCarts();
};

export default useCartStore;
