/**
 * Cart Screen
 * Pharmacy-wise cart management with switching between different pharmacy carts
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BodyText,
  Heading2,
  Heading3,
  Typography,
  Caption,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
  typography,
} from '@components';
import { useCartStore } from '@store/CartStore';
import CartItemCard from '../../components/Cart/CartItemCard';

export const CartScreen: React.FC = () => {
  const {
    carts,
    activePharmacyId,
    setActiveCart,
    getCartPreview,
    updateItemQuantity,
    removeItem,
  } = useCartStore();

  const [selectedPharmacyId, setSelectedPharmacyId] = useState(
    activePharmacyId || Object.keys(carts)[0] || null,
  );

  const cartPreview = getCartPreview();
  const selectedCart = selectedPharmacyId ? carts[selectedPharmacyId] : null;

  const handlePharmacySwitch = (pharmacyId: string) => {
    setSelectedPharmacyId(pharmacyId);
    setActiveCart(pharmacyId);
  };

  const handleQuantityUpdate = (itemId: string, quantity: number) => {
    if (selectedPharmacyId) {
      updateItemQuantity(selectedPharmacyId, itemId, quantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (selectedPharmacyId) {
      removeItem(selectedPharmacyId, itemId);
    }
  };

  const renderPharmacyTabs = () => {
    if (cartPreview.length <= 1) return null;

    return (
      <View style={styles.pharmacyTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cartPreview.map(cart => (
            <Button
              key={cart.pharmacyId}
              variant={
                selectedPharmacyId === cart.pharmacyId ? 'primary' : 'ghost'
              }
              style={[
                styles.pharmacyTab,
                selectedPharmacyId === cart.pharmacyId &&
                  styles.activePharmacyTab,
              ]}
              onPress={() => handlePharmacySwitch(cart.pharmacyId)}
            >
              <Column>
                <BodyText
                  color={
                    selectedPharmacyId === cart.pharmacyId
                      ? 'contrast'
                      : 'primary'
                  }
                >
                  {cart.pharmacyName}
                </BodyText>
                <Caption
                  color={
                    selectedPharmacyId === cart.pharmacyId
                      ? 'contrast'
                      : 'secondary'
                  }
                >
                  {cart.itemCount} items
                </Caption>
              </Column>
            </Button>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <Card style={styles.emptyContainer}>
      <Typography variant="h1" style={styles.emptyIcon}>
        🛒
      </Typography>
      <Heading2 color="primary" style={styles.emptyTitle}>
        Your cart is empty
      </Heading2>
      <BodyText color="secondary" style={styles.emptyMessage}>
        Add medicines to your cart to see them here
      </BodyText>
      <Button variant="primary" style={styles.shopButton}>
        Start Shopping
      </Button>
    </Card>
  );

  const renderCartSummary = () => {
    if (!selectedCart) return null;

    return (
      <Card style={styles.summaryContainer}>
        <Heading3 color="primary" style={styles.summaryTitle}>
          Order Summary
        </Heading3>

        <Row style={styles.summaryRow}>
          <BodyText color="secondary">Subtotal</BodyText>
          <BodyText color="primary">
            ₹{selectedCart.subtotal.toFixed(2)}
          </BodyText>
        </Row>

        <Row style={styles.summaryRow}>
          <BodyText color="secondary">Discount</BodyText>
          <BodyText color="success">
            -₹{selectedCart.discount.toFixed(2)}
          </BodyText>
        </Row>

        <Row style={styles.summaryRow}>
          <BodyText color="secondary">Delivery Fee</BodyText>
          <BodyText color="primary">
            {selectedCart.deliveryFee === 0
              ? 'FREE'
              : `₹${selectedCart.deliveryFee.toFixed(2)}`}
          </BodyText>
        </Row>

        <Row style={styles.summaryRow}>
          <BodyText color="secondary">Taxes</BodyText>
          <BodyText color="primary">₹{selectedCart.taxes.toFixed(2)}</BodyText>
        </Row>

        <Row style={[styles.summaryRow, styles.totalRow]}>
          <Heading3 color="primary">Total</Heading3>
          <Heading3 color="primary">₹{selectedCart.total.toFixed(2)}</Heading3>
        </Row>
      </Card>
    );
  };

  if (cartPreview.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <Heading2 color="primary">My Cart</Heading2>
        </View>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Heading2 color="primary">My Cart</Heading2>
        <BodyText color="secondary">
          {cartPreview.reduce((sum, cart) => sum + cart.itemCount, 0)} items
        </BodyText>
      </View>

      {renderPharmacyTabs()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedCart && (
          <>
            <Card style={styles.pharmacyHeader}>
              <Heading3 color="primary">{selectedCart.pharmacyName}</Heading3>
              <BodyText color="secondary">
                {selectedCart.deliveryAvailable
                  ? `Delivery in ${selectedCart.estimatedDeliveryTime}`
                  : 'Pickup only'}
              </BodyText>
            </Card>

            <View style={styles.itemsContainer}>
              {selectedCart.items.map(item => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={quantity =>
                    handleQuantityUpdate(item.id, quantity)
                  }
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </View>

            {renderCartSummary()}
          </>
        )}
      </ScrollView>

      {selectedCart && (
        <View style={styles.checkoutContainer}>
          <Button
            variant="primary"
            size="lg"
            style={styles.checkoutButton}
            onPress={() => console.log('Proceed to checkout')}
          >
            Proceed to Checkout • ₹{selectedCart.total.toFixed(0)}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.light.textHighContrast,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  pharmacyTabs: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  pharmacyTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  activePharmacyTab: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    ...shadows.sm,
  },
  pharmacyTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activePharmacyTabText: {
    color: '#fff',
  },
  pharmacyTabCount: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  pharmacyHeader: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  pharmacyName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.textHighContrast,
    marginBottom: spacing.xs,
  },
  deliveryInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
  },
  itemsContainer: {
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    ...shadows.lg,
  },
  checkoutButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.textHighContrast,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: typography.fontSize.base,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  shopButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default CartScreen;
