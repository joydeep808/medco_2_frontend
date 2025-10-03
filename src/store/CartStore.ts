/**
 * Cart Store
 * Manages pharmacy-wise cart system with multiple cart support using Zustand
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// MMKV instance for cart data persistence
const cartStorage = new MMKV({
  id: 'cart-storage',
  encryptionKey: 'medco-cart-key',
});

export interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  brand?: string;
  genericName?: string;
  strength?: string;
  form: string; // tablet, capsule, syrup, etc.

  // Pricing
  price: number;
  mrp: number;
  discount: number;
  discountType: 'PERCENTAGE' | 'AMOUNT';

  // Quantity and availability
  quantity: number;
  maxQuantity: number;
  minQuantity: number;
  inStock: boolean;

  // Prescription requirements
  requiresPrescription: boolean;
  prescriptionUploaded?: boolean;

  // Images and details
  image?: string;
  description?: string;

  // Pharmacy specific
  pharmacyId: string;
  pharmacyName: string;

  // Added timestamp
  addedAt: string;
  updatedAt: string;
}

export interface PharmacyCart {
  pharmacyId: string;
  pharmacyName: string;
  items: CartItem[];

  // Cart totals
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  total: number;

  // Cart status
  isValid: boolean;
  validationErrors: string[];

  // Delivery info
  deliveryAvailable: boolean;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CartValidationError {
  type:
    | 'OUT_OF_STOCK'
    | 'MIN_ORDER'
    | 'PRESCRIPTION_REQUIRED'
    | 'DELIVERY_UNAVAILABLE';
  message: string;
  itemId?: string;
}

export interface CartState {
  // Multiple pharmacy carts
  carts: { [pharmacyId: string]: PharmacyCart };
  activePharmacyId: string | null;

  // Cart operations
  isLoading: boolean;
  error: string | null;

  // Cart summary
  totalItems: number;
  totalAmount: number;

  // Actions - Cart Management
  createCart: (pharmacyId: string, pharmacyName: string) => void;
  setActiveCart: (pharmacyId: string) => void;
  clearCart: (pharmacyId: string) => void;
  clearAllCarts: () => void;

  // Actions - Item Management
  addItem: (
    pharmacyId: string,
    item: Omit<CartItem, 'addedAt' | 'updatedAt'>,
  ) => void;
  updateItemQuantity: (
    pharmacyId: string,
    itemId: string,
    quantity: number,
  ) => void;
  removeItem: (pharmacyId: string, itemId: string) => void;

  // Actions - Cart Operations
  validateCart: (pharmacyId: string) => CartValidationError[];
  calculateCartTotals: (pharmacyId: string) => void;
  syncCartWithPharmacy: (pharmacyId: string) => Promise<void>;

  // Actions - Utility
  getCartItemCount: (pharmacyId?: string) => number;
  getCartTotal: (pharmacyId?: string) => number;
  hasItemInCart: (pharmacyId: string, medicineId: string) => boolean;
  getItemQuantity: (pharmacyId: string, medicineId: string) => number;

  // Actions - Persistence
  loadPersistedCarts: () => void;
  persistCarts: () => void;

  // Actions - Cart Preview
  getCartPreview: () => {
    pharmacyId: string;
    pharmacyName: string;
    itemCount: number;
    total: number;
  }[];
}

// Helper functions
const calculateItemTotal = (item: CartItem): number => {
  const discountAmount =
    item.discountType === 'PERCENTAGE'
      ? (item.price * item.discount) / 100
      : item.discount;
  return (item.price - discountAmount) * item.quantity;
};

const calculateCartTotals = (
  cart: PharmacyCart,
): Omit<
  PharmacyCart,
  | 'pharmacyId'
  | 'pharmacyName'
  | 'items'
  | 'createdAt'
  | 'updatedAt'
  | 'isValid'
  | 'validationErrors'
  | 'deliveryAvailable'
  | 'minOrderAmount'
  | 'freeDeliveryThreshold'
  | 'estimatedDeliveryTime'
> => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0,
  );
  const discount = cart.items.reduce((sum, item) => {
    const discountAmount =
      item.discountType === 'PERCENTAGE'
        ? (item.price * item.discount) / 100
        : item.discount;
    return sum + discountAmount * item.quantity;
  }, 0);

  // Calculate delivery fee
  let deliveryFee = 0;
  if (cart.deliveryAvailable && subtotal < cart.freeDeliveryThreshold) {
    deliveryFee = 50; // Default delivery fee
  }

  // Calculate taxes (assuming 5% GST on medicines)
  const taxes = subtotal * 0.05;

  const total = subtotal + deliveryFee + taxes;

  return {
    subtotal,
    discount,
    deliveryFee,
    taxes,
    total,
  };
};

// Load persisted carts
const loadPersistedCarts = (): { [pharmacyId: string]: PharmacyCart } => {
  try {
    const stored = cartStorage.getString('carts');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const loadActivePharmacyId = (): string | null => {
  try {
    return cartStorage.getString('activePharmacyId') || null;
  } catch {
    return null;
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  carts: loadPersistedCarts(),
  activePharmacyId: loadActivePharmacyId(),

  isLoading: false,
  error: null,

  totalItems: 0,
  totalAmount: 0,

  // Cart Management
  createCart: (pharmacyId, pharmacyName) => {
    const { carts } = get();

    if (!carts[pharmacyId]) {
      const newCart: PharmacyCart = {
        pharmacyId,
        pharmacyName,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryFee: 0,
        taxes: 0,
        total: 0,
        isValid: true,
        validationErrors: [],
        deliveryAvailable: true,
        minOrderAmount: 0,
        freeDeliveryThreshold: 500,
        estimatedDeliveryTime: '30-45 mins',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set({
        carts: { ...carts, [pharmacyId]: newCart },
        activePharmacyId: pharmacyId,
      });

      get().persistCarts();
    }
  },

  setActiveCart: pharmacyId => {
    set({ activePharmacyId: pharmacyId });
    cartStorage.set('activePharmacyId', pharmacyId);
  },

  clearCart: pharmacyId => {
    const { carts, activePharmacyId } = get();
    const updatedCarts = { ...carts };
    delete updatedCarts[pharmacyId];

    set({
      carts: updatedCarts,
      activePharmacyId:
        activePharmacyId === pharmacyId ? null : activePharmacyId,
    });

    get().persistCarts();
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

  // Item Management
  addItem: (pharmacyId, itemData) => {
    const { carts } = get();

    // Create cart if it doesn't exist
    if (!carts[pharmacyId]) {
      get().createCart(pharmacyId, itemData.pharmacyName);
    }

    const cart = carts[pharmacyId];
    const existingItemIndex = cart.items.findIndex(
      item => item.medicineId === itemData.medicineId,
    );

    const now = new Date().toISOString();
    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = cart.items.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + itemData.quantity,
                item.maxQuantity,
              ),
              updatedAt: now,
            }
          : item,
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        ...itemData,
        id: `${pharmacyId}_${itemData.medicineId}_${Date.now()}`,
        addedAt: now,
        updatedAt: now,
      };
      updatedItems = [...cart.items, newItem];
    }

    const updatedCart = {
      ...cart,
      items: updatedItems,
      updatedAt: now,
    };

    // Recalculate totals
    const totals = calculateCartTotals(updatedCart);
    const finalCart = { ...updatedCart, ...totals };

    set({
      carts: { ...carts, [pharmacyId]: finalCart },
      activePharmacyId: pharmacyId,
    });

    get().persistCarts();
  },

  updateItemQuantity: (pharmacyId, itemId, quantity) => {
    const { carts } = get();
    const cart = carts[pharmacyId];

    if (!cart) return;

    const updatedItems = cart.items
      .map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(
                item.minQuantity,
                Math.min(quantity, item.maxQuantity),
              ),
              updatedAt: new Date().toISOString(),
            }
          : item,
      )
      .filter(item => item.quantity > 0); // Remove items with 0 quantity

    const updatedCart = {
      ...cart,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals
    const totals = calculateCartTotals(updatedCart);
    const finalCart = { ...updatedCart, ...totals };

    set({
      carts: { ...carts, [pharmacyId]: finalCart },
    });

    get().persistCarts();
  },

  removeItem: (pharmacyId, itemId) => {
    const { carts } = get();
    const cart = carts[pharmacyId];

    if (!cart) return;

    const updatedItems = cart.items.filter(item => item.id !== itemId);

    const updatedCart = {
      ...cart,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals
    const totals = calculateCartTotals(updatedCart);
    const finalCart = { ...updatedCart, ...totals };

    set({
      carts: { ...carts, [pharmacyId]: finalCart },
    });

    get().persistCarts();
  },

  // Cart Operations
  validateCart: pharmacyId => {
    const { carts } = get();
    const cart = carts[pharmacyId];

    if (!cart) return [];

    const errors: CartValidationError[] = [];

    // Check stock availability
    cart.items.forEach(item => {
      if (!item.inStock) {
        errors.push({
          type: 'OUT_OF_STOCK',
          message: `${item.name} is currently out of stock`,
          itemId: item.id,
        });
      }

      if (item.requiresPrescription && !item.prescriptionUploaded) {
        errors.push({
          type: 'PRESCRIPTION_REQUIRED',
          message: `${item.name} requires a prescription`,
          itemId: item.id,
        });
      }
    });

    // Check minimum order amount
    if (cart.subtotal < cart.minOrderAmount) {
      errors.push({
        type: 'MIN_ORDER',
        message: `Minimum order amount is ₹${cart.minOrderAmount}`,
      });
    }

    // Check delivery availability
    if (!cart.deliveryAvailable) {
      errors.push({
        type: 'DELIVERY_UNAVAILABLE',
        message: 'Delivery is not available for this pharmacy',
      });
    }

    return errors;
  },

  calculateCartTotals: pharmacyId => {
    const { carts } = get();
    const cart = carts[pharmacyId];

    if (!cart) return;

    const totals = calculateCartTotals(cart);
    const updatedCart = { ...cart, ...totals };

    set({
      carts: { ...carts, [pharmacyId]: updatedCart },
    });
  },

  syncCartWithPharmacy: async pharmacyId => {
    // This would sync cart with pharmacy's real-time inventory
    console.log('Syncing cart with pharmacy:', pharmacyId);
    // Implementation would involve API calls
  },

  // Utility functions
  getCartItemCount: pharmacyId => {
    const { carts } = get();

    if (pharmacyId) {
      const cart = carts[pharmacyId];
      return cart
        ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
    }

    // Return total items across all carts
    return Object.values(carts).reduce(
      (total, cart) =>
        total + cart.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );
  },

  getCartTotal: pharmacyId => {
    const { carts } = get();

    if (pharmacyId) {
      const cart = carts[pharmacyId];
      return cart ? cart.total : 0;
    }

    // Return total amount across all carts
    return Object.values(carts).reduce((total, cart) => total + cart.total, 0);
  },

  hasItemInCart: (pharmacyId, medicineId) => {
    const { carts } = get();
    const cart = carts[pharmacyId];
    return cart
      ? cart.items.some(item => item.medicineId === medicineId)
      : false;
  },

  getItemQuantity: (pharmacyId, medicineId) => {
    const { carts } = get();
    const cart = carts[pharmacyId];
    const item = cart?.items.find(item => item.medicineId === medicineId);
    return item ? item.quantity : 0;
  },

  // Persistence
  loadPersistedCarts: () => {
    const carts = loadPersistedCarts();
    const activePharmacyId = loadActivePharmacyId();

    // Calculate totals
    const totalItems = Object.values(carts).reduce(
      (total, cart) =>
        total + cart.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );

    const totalAmount = Object.values(carts).reduce(
      (total, cart) => total + cart.total,
      0,
    );

    set({
      carts,
      activePharmacyId,
      totalItems,
      totalAmount,
    });
  },

  persistCarts: () => {
    const { carts, activePharmacyId } = get();

    cartStorage.set('carts', JSON.stringify(carts));
    if (activePharmacyId) {
      cartStorage.set('activePharmacyId', activePharmacyId);
    }

    // Update totals
    const totalItems = Object.values(carts).reduce(
      (total, cart) =>
        total + cart.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );

    const totalAmount = Object.values(carts).reduce(
      (total, cart) => total + cart.total,
      0,
    );

    set({ totalItems, totalAmount });
  },

  // Cart Preview
  getCartPreview: () => {
    const { carts } = get();

    return Object.values(carts).map(cart => ({
      pharmacyId: cart.pharmacyId,
      pharmacyName: cart.pharmacyName,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      total: cart.total,
    }));
  },
}));

// Selector functions for easy access
export const useActiveCarts = () =>
  useCartStore(state =>
    Object.values(state.carts).filter(cart => cart.items.length > 0),
  );

export const useActiveCart = () =>
  useCartStore(state => {
    const { carts, activePharmacyId } = state;
    return activePharmacyId ? carts[activePharmacyId] : null;
  });

export const useCartItemCount = (pharmacyId?: string) =>
  useCartStore(state => state.getCartItemCount(pharmacyId));

export const useCartTotal = (pharmacyId?: string) =>
  useCartStore(state => state.getCartTotal(pharmacyId));

// Action functions for external use
export const addItemToCart = (
  pharmacyId: string,
  item: Omit<CartItem, 'addedAt' | 'updatedAt'>,
) => useCartStore.getState().addItem(pharmacyId, item);

export const updateCartItemQuantity = (
  pharmacyId: string,
  itemId: string,
  quantity: number,
) => useCartStore.getState().updateItemQuantity(pharmacyId, itemId, quantity);

export const removeCartItem = (pharmacyId: string, itemId: string) =>
  useCartStore.getState().removeItem(pharmacyId, itemId);

export default useCartStore;
