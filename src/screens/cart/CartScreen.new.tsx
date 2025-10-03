import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BodyText, Heading2, Button } from '@components';
import { useCartStore } from '@store/CartStore.new';
import { navigate } from '@utils/NavigationUtils';

const CartScreen: React.FC = () => {
  const {
    cartPreview,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    validateCart,
    getTotalItems,
    getTotalAmount,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  useEffect(() => {
    // Validate cart when component mounts
    if (cartPreview.length > 0) {
      validateAllCarts();
    }
  }, []);

  const validateAllCarts = async () => {
    const errors: any[] = [];
    for (const cart of cartPreview) {
      try {
        const validation = await validateCart(cart.pharmacyId);
        if (validation && !validation.isValid) {
          errors.push(...validation.errors);
        }
      } catch (error) {
        console.error('Cart validation error:', error);
      }
    }
    setValidationErrors(errors);
  };

  const handleQuantityUpdate = async (cartItemId: number, quantity: number) => {
    try {
      await updateQuantity({ cartItemId, quantity });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCart({ cartItemId });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleApplyCoupon = async (cartId: number) => {
    if (couponCode.trim()) {
      try {
        await applyCoupon(cartId, couponCode.trim());
        setCouponCode('');
      } catch (error) {
        console.error('Failed to apply coupon:', error);
      }
    }
  };

  const handleRemoveCoupon = async (cartId: number) => {
    try {
      await removeCoupon(cartId);
    } catch (error) {
      console.error('Failed to remove coupon:', error);
    }
  };

  const handleCheckout = (cartId: number) => {
    navigate('Checkout', { cartId });
  };

  const renderCartItem = (item: any) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Heading2 size="sm" color="primary">
          {item.medicineName}
        </Heading2>
        <BodyText color="secondary" size="sm">
          {item.variantName}
        </BodyText>
        <BodyText color="secondary" size="sm">
          {item.pharmacyName}
        </BodyText>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityUpdate(item.id, item.quantity - 1)}
            disabled={loading}
          >
            <BodyText color="primary" weight="bold">
              -
            </BodyText>
          </TouchableOpacity>
          <BodyText color="primary" style={styles.quantityText}>
            {item.quantity}
          </BodyText>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityUpdate(item.id, item.quantity + 1)}
            disabled={loading}
          >
            <BodyText color="primary" weight="bold">
              +
            </BodyText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
          disabled={loading}
        >
          <BodyText color="error" size="sm">
            Remove
          </BodyText>
        </TouchableOpacity>
      </View>

      <View style={styles.itemPricing}>
        <View style={styles.priceRow}>
          <BodyText color="primary" weight="bold">
            ₹{item.itemFinalAmount}
          </BodyText>
          {item.totalDiscount > 0 && (
            <BodyText color="secondary" size="sm" style={styles.originalPrice}>
              ₹{item.totalMrp}
            </BodyText>
          )}
        </View>
        {item.totalDiscount > 0 && (
          <BodyText color="success" size="sm">
            You save ₹{item.savings}
          </BodyText>
        )}
      </View>
    </View>
  );

  const renderCartSummary = (cart: any) => (
    <View key={cart.pharmacyId} style={styles.cartContainer}>
      <View style={styles.cartHeader}>
        <Heading2 color="primary" size="md">
          {cart.pharmacyName}
        </Heading2>
        <BodyText color="secondary" size="sm">
          {cart.itemCount} items
        </BodyText>
      </View>

      {cart.items.map(renderCartItem)}

      {/* Coupon Section */}
      <View style={styles.couponSection}>
        <View style={styles.couponInput}>
          <BodyText color="secondary" size="sm">
            Apply Coupon:
          </BodyText>
          {/* Add TextInput component here */}
          <Button
            title="Apply"
            size="sm"
            onPress={() => handleApplyCoupon(cart.pharmacyId)}
            disabled={!couponCode.trim() || loading}
          />
        </View>
      </View>

      {/* Cart Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <BodyText color="secondary">Subtotal</BodyText>
          <BodyText color="primary">₹{cart.totalAmount}</BodyText>
        </View>
        <View style={styles.summaryRow}>
          <BodyText color="secondary">Delivery Fee</BodyText>
          <BodyText color="primary">₹0</BodyText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Heading2 color="primary" size="md">
            Total
          </Heading2>
          <Heading2 color="primary" size="md">
            ₹{cart.totalAmount}
          </Heading2>
        </View>
      </View>

      <Button
        title="Proceed to Checkout"
        onPress={() => handleCheckout(cart.pharmacyId)}
        style={styles.checkoutButton}
        disabled={loading}
      />
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <BodyText color="secondary" align="center" size="lg">
        🛒
      </BodyText>
      <Heading2 color="primary" align="center" style={styles.emptyTitle}>
        Your cart is empty
      </Heading2>
      <BodyText color="secondary" align="center" size="sm">
        Add medicines to your cart to get started
      </BodyText>
      <Button
        title="Start Shopping"
        style={styles.emptyButton}
        onPress={() => navigate('HomeScreen')}
      />
    </View>
  );

  if (cartPreview.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Button
            title="← Back"
            variant="ghost"
            size="sm"
            onPress={() => navigate('HomeScreen')}
          />
          <View style={styles.headerContent}>
            <Heading2 color="primary">My Cart</Heading2>
          </View>
          <View style={{ width: 60 }} />
        </View>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Button
          title="← Back"
          variant="ghost"
          size="sm"
          onPress={() => navigate('HomeScreen')}
        />
        <View style={styles.headerContent}>
          <Heading2 color="primary">My Cart</Heading2>
          <BodyText color="secondary">{getTotalItems()} items</BodyText>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <BodyText color="secondary" style={styles.loadingText}>
            Updating cart...
          </BodyText>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <BodyText color="error" align="center">
            {error}
          </BodyText>
        </View>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <View style={styles.errorContainer}>
          {validationErrors.map((error, index) => (
            <BodyText key={index} color="error" size="sm">
              • {error}
            </BodyText>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {cartPreview.map(renderCartSummary)}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  cartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityText: {
    paddingHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  couponSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summarySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyButton: {
    marginTop: 24,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CartScreen;
