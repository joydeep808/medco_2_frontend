/**
 * Enhanced Cart Screen
 * Handles both single pharmacy cart and all carts view
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import {
  Screen,
  BodyText,
  Caption,
  Button,
  Row,
  Column,
  Card,
  Divider,
  Heading1,
  Heading2,
  spacing,
  borderRadius,
} from '@components';

import { RootStackParamList } from '@interfaces/StackParams';
import { ThemeManager, createThemedStyles } from '../../styles/colors';
import { ShadowSystem } from '../../styles/shadows';
import useCartStore, {
  useCartLoading,
  useCartError,
} from '@store/CartStore.new';
import { CartData, CartItem } from '@services/CartService';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from '../../components/Toast/ToastManager';

// Helper function for showToast
const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      showSuccessToast(message);
      break;
    case 'error':
      showErrorToast(message);
      break;
    case 'info':
      showInfoToast(message);
      break;
  }
};

type CartScreenRouteProp = RouteProp<RootStackParamList, 'CartScreen'>;
type CartScreenNavigationProp = any; // TODO: Define proper navigation type

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  isUpdating: boolean;
}

const CartItemComponent: React.FC<CartItemComponentProps> = React.memo(
  ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => {
    const theme = ThemeManager.getCurrentThemeConfig();

    const handleQuantityChange = (delta: number) => {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0 && newQuantity <= item.stockQuantity) {
        onUpdateQuantity(item.id, newQuantity);
      }
    };

    const handleRemove = () => {
      Alert.alert('Remove Item', `Remove ${item.medicineName} from cart?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveItem(item.id),
        },
      ]);
    };

    return (
      <Card style={styles(theme).cartItem}>
        <Row style={styles(theme).itemHeader}>
          <View style={styles(theme).itemImage}>
            <BodyText style={styles(theme).itemImageText}>💊</BodyText>
          </View>

          <Column style={styles(theme).itemDetails}>
            <BodyText style={styles(theme).itemName} numberOfLines={2}>
              {item.medicineName}
            </BodyText>
            <Caption style={styles(theme).itemVariant}>
              {item.variantName}
            </Caption>
            <Caption style={styles(theme).itemPharmacy}>
              {item.pharmacyName}
            </Caption>
          </Column>

          <TouchableOpacity
            onPress={handleRemove}
            style={styles(theme).removeButton}
            disabled={isUpdating}
          >
            <BodyText style={styles(theme).removeButtonText}>×</BodyText>
          </TouchableOpacity>
        </Row>

        <Divider style={styles(theme).itemDivider} />

        <Row style={styles(theme).itemFooter}>
          <Column style={styles(theme).priceSection}>
            <Row style={styles(theme).priceRow}>
              <BodyText style={styles(theme).currentPrice}>
                ₹{item.sellingPrice.toFixed(0)}
              </BodyText>
              {item.mrp > item.sellingPrice && (
                <Caption style={styles(theme).originalPrice}>
                  ₹{item.mrp.toFixed(0)}
                </Caption>
              )}
            </Row>
            {item.savings > 0 && (
              <Caption style={styles(theme).savings}>
                Save ₹{item.savings.toFixed(0)}
              </Caption>
            )}
          </Column>

          <Row style={styles(theme).quantityControls}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              style={[
                styles(theme).quantityButton,
                item.quantity <= 1 && styles(theme).quantityButtonDisabled,
              ]}
              disabled={item.quantity <= 1 || isUpdating}
            >
              <BodyText style={styles(theme).quantityButtonText}>−</BodyText>
            </TouchableOpacity>

            <View style={styles(theme).quantityDisplay}>
              <BodyText style={styles(theme).quantityText}>
                {item.quantity}
              </BodyText>
            </View>

            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={[
                styles(theme).quantityButton,
                item.quantity >= item.stockQuantity &&
                  styles(theme).quantityButtonDisabled,
              ]}
              disabled={item.quantity >= item.stockQuantity || isUpdating}
            >
              <BodyText style={styles(theme).quantityButtonText}>+</BodyText>
            </TouchableOpacity>
          </Row>
        </Row>

        <Row style={styles(theme).itemTotal}>
          <BodyText style={styles(theme).itemTotalText}>
            Total: ₹{item.itemFinalAmount.toFixed(0)}
          </BodyText>
          {item.gstAmount > 0 && (
            <Caption style={styles(theme).gstText}>
              (incl. GST ₹{item.gstAmount.toFixed(0)})
            </Caption>
          )}
        </Row>
      </Card>
    );
  },
);

interface CartSummaryProps {
  cart: CartData;
  onApplyCoupon: (couponCode: string) => void;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
  isApplyingCoupon: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = React.memo(
  ({ cart, onApplyCoupon, onRemoveCoupon, onCheckout, isApplyingCoupon }) => {
    const theme = ThemeManager.getCurrentThemeConfig();
    const [couponCode, setCouponCode] = useState('');

    const handleApplyCoupon = () => {
      if (couponCode.trim()) {
        onApplyCoupon(couponCode.trim());
        setCouponCode('');
      }
    };

    return (
      <Card style={styles(theme).summaryCard}>
        <Heading1 style={styles(theme).summaryTitle}>Order Summary</Heading1>

        <View style={styles(theme).summaryRow}>
          <BodyText>Subtotal ({cart.totalQuantity} items)</BodyText>
          <BodyText>₹{cart.subtotal.toFixed(0)}</BodyText>
        </View>

        {cart.totalDiscount > 0 && (
          <View style={styles(theme).summaryRow}>
            <BodyText style={styles(theme).discountText}>
              Item Discount
            </BodyText>
            <BodyText style={styles(theme).discountText}>
              -₹{cart.totalDiscount.toFixed(0)}
            </BodyText>
          </View>
        )}

        {cart.couponDiscount > 0 && (
          <View style={styles(theme).summaryRow}>
            <BodyText style={styles(theme).discountText}>
              Coupon Discount ({cart.couponCode})
            </BodyText>
            <Row>
              <BodyText style={styles(theme).discountText}>
                -₹{cart.couponDiscount.toFixed(0)}
              </BodyText>
              <TouchableOpacity
                onPress={onRemoveCoupon}
                style={styles(theme).removeCouponButton}
              >
                <Caption style={styles(theme).removeCouponText}>Remove</Caption>
              </TouchableOpacity>
            </Row>
          </View>
        )}

        <View style={styles(theme).summaryRow}>
          <BodyText>Delivery Charge</BodyText>
          <BodyText>
            {cart.isFreeDeliveryEligible
              ? 'FREE'
              : `₹${cart.deliveryCharge.toFixed(0)}`}
          </BodyText>
        </View>

        {cart.gstAmount > 0 && (
          <View style={styles(theme).summaryRow}>
            <BodyText>GST ({cart.gstRate}%)</BodyText>
            <BodyText>₹{cart.gstAmount.toFixed(0)}</BodyText>
          </View>
        )}

        <Divider style={styles(theme).summaryDivider} />

        <View style={[styles(theme).summaryRow, styles(theme).totalRow]}>
          <Heading2 style={styles(theme).totalText}>Total</Heading2>
          <Heading2 style={styles(theme).totalAmount}>
            ₹{cart.finalAmount.toFixed(0)}
          </Heading2>
        </View>

        {cart.totalSavings > 0 && (
          <Caption style={styles(theme).totalSavings}>
            You saved ₹{cart.totalSavings.toFixed(0)} on this order
          </Caption>
        )}

        {!cart.couponCode && (
          <View style={styles(theme).couponSection}>
            <Row style={styles(theme).couponInput}>
              <View style={styles(theme).couponInputField}>
                <TextInput
                  style={styles(theme).couponInputText}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
              <Button
                title="Apply"
                onPress={handleApplyCoupon}
                disabled={!couponCode.trim() || isApplyingCoupon}
                loading={isApplyingCoupon}
                size="sm"
              />
            </Row>
          </View>
        )}

        <Button
          title="Proceed to Checkout"
          onPress={onCheckout}
          style={styles(theme).checkoutButton}
          disabled={cart.items.length === 0}
        />

        {!cart.isFreeDeliveryEligible &&
          cart.freeDeliveryThreshold > cart.subtotal && (
            <Caption style={styles(theme).freeDeliveryNote}>
              Add ₹{(cart.freeDeliveryThreshold - cart.subtotal).toFixed(0)}{' '}
              more for free delivery
            </Caption>
          )}
      </Card>
    );
  },
);

const CartScreen: React.FC = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const theme = ThemeManager.getCurrentThemeConfig();

  const { pharmacyId } = route.params || {};

  const {
    carts,
    loadAllCarts,
    loadCartByPharmacy,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const { isLoading, isUpdatingCart, isRemovingFromCart, isApplyingCoupon } =
    useCartLoading();
  const { error, clearError } = useCartError();

  const [refreshing, setRefreshing] = useState(false);

  // Get relevant carts based on pharmacyId parameter
  const relevantCarts = pharmacyId
    ? carts[pharmacyId]
      ? [carts[pharmacyId]]
      : []
    : Object.values(carts);

  const totalItems = relevantCarts.reduce(
    (sum, cart) => sum + cart.totalQuantity,
    0,
  );
  const totalAmount = relevantCarts.reduce(
    (sum, cart) => sum + cart.finalAmount,
    0,
  );

  // Simplified handlers without useCallback to prevent dependency issues
  const loadData = async () => {
    try {
      if (pharmacyId) {
        await loadCartByPharmacy(pharmacyId);
      } else {
        await loadAllCarts();
      }
    } catch (err) {
      console.error('Failed to load cart data:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    const success = await updateCartItem(itemId, quantity);
    if (!success && error) {
      showToast(error, 'error');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const success = await removeFromCart(itemId);
    if (success) {
      showToast('Item removed from cart', 'success');
    } else if (error) {
      showToast(error, 'error');
    }
  };

  const handleApplyCoupon = async (
    cartPharmacyId: number,
    couponCode: string,
  ) => {
    const success = await applyCoupon(cartPharmacyId, couponCode);
    if (success) {
      showToast('Coupon applied successfully', 'success');
    } else if (error) {
      showToast(error, 'error');
    }
  };

  const handleRemoveCoupon = async (cartPharmacyId: number) => {
    const success = await removeCoupon(cartPharmacyId);
    if (success) {
      showToast('Coupon removed', 'success');
    } else if (error) {
      showToast(error, 'error');
    }
  };

  const handleCheckout = (cart: CartData) => {
    navigation.navigate('CheckoutScreen', {
      pharmacyId: cart.pharmacyId.toString(),
    });
  };

  const handleClearCart = async (cartPharmacyId: number) => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear this cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearCart(cartPharmacyId);
          showToast('Cart cleared', 'success');
        },
      },
    ]);
  };

  // Load data only once when component mounts or pharmacyId changes
  useEffect(() => {
    loadData();
  }, [pharmacyId]); // Only depend on pharmacyId, not the function

  // Handle error cleanup with simpler logic
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemComponent
      item={item}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      isUpdating={isUpdatingCart || isRemovingFromCart}
    />
  );

  const renderCart = ({ item: cart }: { item: CartData }) => (
    <View style={styles(theme).cartContainer}>
      <Card style={styles(theme).cartHeader}>
        <Row style={styles(theme).cartHeaderContent}>
          <Column style={styles(theme).cartHeaderInfo}>
            <Heading2 style={styles(theme).pharmacyName}>
              {cart.items[0]?.pharmacyName || 'Unknown Pharmacy'}
            </Heading2>
            <Caption style={styles(theme).cartItemCount}>
              {cart.totalQuantity} items • ₹{cart.finalAmount.toFixed(0)}
            </Caption>
          </Column>

          <TouchableOpacity
            onPress={() => handleClearCart(cart.pharmacyId)}
            style={styles(theme).clearCartButton}
          >
            <Caption style={styles(theme).clearCartText}>Clear</Caption>
          </TouchableOpacity>
        </Row>
      </Card>

      <FlashList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
      />

      <CartSummary
        cart={cart}
        onApplyCoupon={couponCode =>
          handleApplyCoupon(cart.pharmacyId, couponCode)
        }
        onRemoveCoupon={() => handleRemoveCoupon(cart.pharmacyId)}
        onCheckout={() => handleCheckout(cart)}
        isApplyingCoupon={isApplyingCoupon}
      />
    </View>
  );

  if (isLoading) {
    return (
      <Screen>
        <View style={styles(theme).header}>
          <Heading1 style={styles(theme).headerTitle}>
            {pharmacyId ? 'Cart' : 'My Carts'}
          </Heading1>
        </View>
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.interactive.primary}
          />
          <BodyText style={styles(theme).loadingText}>Loading cart...</BodyText>
        </View>
      </Screen>
    );
  }

  if (relevantCarts.length === 0) {
    return (
      <Screen>
        <View style={styles(theme).header}>
          <Heading1 style={styles(theme).headerTitle}>
            {pharmacyId ? 'Cart' : 'My Carts'}
          </Heading1>
        </View>
        <View style={styles(theme).emptyContainer}>
          <Text style={styles(theme).emptyIcon}>🛒</Text>
          <Heading2 style={styles(theme).emptyTitle}>
            Your cart is empty
          </Heading2>
          <BodyText style={styles(theme).emptyDescription}>
            Add some medicines to get started
          </BodyText>
          <Button
            title="Browse Medicines"
            onPress={() => navigation.navigate('HomeScreen')}
            style={styles(theme).emptyAction}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles(theme).header}>
        <Heading1 style={styles(theme).headerTitle}>
          {pharmacyId ? 'Cart' : `My Carts (${relevantCarts.length})`}
        </Heading1>
        {!pharmacyId && relevantCarts.length > 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AllCartsScreen')}
          >
            <Caption style={styles(theme).headerAction}>View All</Caption>
          </TouchableOpacity>
        )}
      </View>

      <FlashList
        data={relevantCarts}
        renderItem={renderCart}
        keyExtractor={item => item.pharmacyId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles(theme).container}
      />

      {!pharmacyId && relevantCarts.length > 1 && (
        <View style={styles(theme).multiCartSummary}>
          <Card style={styles(theme).multiCartSummaryCard}>
            <Row style={styles(theme).multiCartSummaryContent}>
              <Column>
                <BodyText style={styles(theme).multiCartTotal}>
                  Total: ₹{totalAmount.toFixed(0)}
                </BodyText>
                <Caption style={styles(theme).multiCartItems}>
                  {totalItems} items from {relevantCarts.length} pharmacies
                </Caption>
              </Column>
              <Button
                title="Checkout All"
                onPress={() => {
                  // Navigate to a multi-pharmacy checkout or handle individually
                  showToast('Please checkout each pharmacy separately', 'info');
                }}
                size="sm"
              />
            </Row>
          </Card>
        </View>
      )}
    </Screen>
  );
};

const styles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      padding: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    headerAction: {
      color: theme.colors.interactive.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },
    loadingText: {
      color: theme.colors.text.secondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.md,
      color: theme.colors.text.primary,
    },
    emptyDescription: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: spacing.xl,
      color: theme.colors.text.secondary,
      lineHeight: 24,
    },
    emptyAction: {
      minWidth: 200,
    },

    // Cart Container
    cartContainer: {
      marginBottom: spacing.xl,
    },
    cartHeader: {
      marginBottom: spacing.md,
    },
    cartHeaderContent: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cartHeaderInfo: {
      flex: 1,
    },
    pharmacyName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    cartItemCount: {
      color: theme.colors.text.secondary,
      marginTop: spacing.xs,
    },
    clearCartButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: theme.colors.status.error,
      borderRadius: borderRadius.sm,
    },
    clearCartText: {
      color: theme.colors.text.inverse,
      fontWeight: '500',
    },

    // Cart Item
    cartItem: {
      marginBottom: spacing.md,
      padding: spacing.md,
    },
    itemHeader: {
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    itemImage: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemImageText: {
      fontSize: 24,
    },
    itemDetails: {
      flex: 1,
      gap: spacing.xs,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    itemVariant: {
      color: theme.colors.text.secondary,
    },
    itemPharmacy: {
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    removeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.status.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: theme.colors.text.inverse,
      fontSize: 18,
      fontWeight: '600',
    },
    itemDivider: {
      marginVertical: spacing.md,
    },
    itemFooter: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceSection: {
      gap: spacing.xs,
    },
    priceRow: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    currentPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    originalPrice: {
      textDecorationLine: 'line-through',
      color: theme.colors.text.secondary,
    },
    savings: {
      color: theme.colors.status.success,
      fontSize: 12,
    },
    quantityControls: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.interactive.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...ShadowSystem.depth1(),
    },
    quantityButtonDisabled: {
      backgroundColor: theme.colors.text.disabled,
    },
    quantityButtonText: {
      color: theme.colors.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    quantityDisplay: {
      minWidth: 40,
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.primary,
    },
    itemTotal: {
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
    },
    itemTotalText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    gstText: {
      color: theme.colors.text.secondary,
      fontSize: 12,
    },

    // Cart Summary
    summaryCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    discountText: {
      color: theme.colors.status.success,
    },
    removeCouponButton: {
      marginLeft: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: theme.colors.status.error,
      borderRadius: borderRadius.sm,
    },
    removeCouponText: {
      color: theme.colors.text.inverse,
      fontSize: 10,
    },
    summaryDivider: {
      marginVertical: spacing.md,
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
      paddingTop: spacing.md,
      marginTop: spacing.md,
    },
    totalText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.interactive.primary,
    },
    totalSavings: {
      color: theme.colors.status.success,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    couponSection: {
      marginTop: spacing.lg,
    },
    couponInput: {
      gap: spacing.md,
    },
    couponInputField: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border.secondary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: theme.colors.background.primary,
    },
    couponInputText: {
      color: theme.colors.text.primary,
    },
    checkoutButton: {
      marginTop: spacing.lg,
    },
    freeDeliveryNote: {
      textAlign: 'center',
      color: theme.colors.text.secondary,
      marginTop: spacing.md,
    },

    // Multi-cart summary
    multiCartSummary: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.primary,
      ...ShadowSystem.depth3(),
    },
    multiCartSummaryCard: {
      margin: spacing.md,
      padding: spacing.md,
    },
    multiCartSummaryContent: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    multiCartTotal: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    multiCartItems: {
      color: theme.colors.text.secondary,
      marginTop: spacing.xs,
    },
  }),
);

export default CartScreen;
