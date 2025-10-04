/**
 * Simplified Cart Screen - No infinite loops
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
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
  Heading1,
  Heading2,
  spacing,
  borderRadius,
} from '@components';

import { RootStackParamList } from '@interfaces/StackParams';
import { ThemeManager, createThemedStyles } from '../../styles/colors';
import useCartStore from '@store/CartStore.new';
import { CartData, CartItem } from '@services/CartService';
import {
  showSuccessToast,
  showErrorToast,
} from '../../components/Toast/ToastManager';
import { navigate } from '@utils/NavigationUtils';

type CartScreenRouteProp = RouteProp<RootStackParamList, 'CartScreen'>;

const CartScreen: React.FC = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation();
  const theme = ThemeManager.getCurrentThemeConfig();

  const { pharmacyId } = route.params || {};
  const {
    carts,
    loadAllCarts,
    loadCartByPharmacy,
    updateCartItem,
    removeFromCart,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get relevant carts
  const relevantCarts = pharmacyId
    ? carts[pharmacyId]
      ? [carts[pharmacyId]]
      : []
    : Object.values(carts);

  // Load cart data
  const loadData = async () => {
    try {
      setIsLoading(true);
      if (pharmacyId) {
        await loadCartByPharmacy(pharmacyId);
      } else {
        await loadAllCarts();
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Handle quantity update
  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
      showSuccessToast('Quantity updated');
    } catch (error) {
      showErrorToast('Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      showSuccessToast('Item removed from cart');
    } catch (error) {
      showErrorToast('Failed to remove item');
    }
  };

  // Handle checkout
  const handleCheckout = (cart: CartData) => {
   navigate('CheckoutScreen', {
      pharmacyId: cart.pharmacyId.toString(),
    });
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [pharmacyId]);

  // Render cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card style={styles(theme).cartItem}>
      <Row style={styles(theme).itemHeader}>
        <View style={styles(theme).itemImage}>
          <BodyText>💊</BodyText>
        </View>

        <Column style={styles(theme).itemDetails}>
          <BodyText style={styles(theme).itemName}>
            {item.medicineName}
          </BodyText>
          <Caption>{item.variantName}</Caption>
          <Caption>{item.pharmacyName}</Caption>
        </Column>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Remove Item', `Remove ${item.medicineName}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', onPress: () => handleRemoveItem(item.id) },
            ]);
          }}
          style={styles(theme).removeButton}
        >
          <BodyText style={styles(theme).removeButtonText}>×</BodyText>
        </TouchableOpacity>
      </Row>

      <Row style={styles(theme).itemFooter}>
        <BodyText style={styles(theme).price}>
          ₹{item.sellingPrice.toFixed(0)}
        </BodyText>

        <Row style={styles(theme).quantityControls}>
          <TouchableOpacity
            onPress={() => {
              if (item.quantity > 1) {
                handleUpdateQuantity(item.id, item.quantity - 1);
              }
            }}
            style={styles(theme).quantityButton}
            disabled={item.quantity <= 1}
          >
            <BodyText>−</BodyText>
          </TouchableOpacity>

          <BodyText style={styles(theme).quantity}>{item.quantity}</BodyText>

          <TouchableOpacity
            onPress={() => {
              if (item.quantity < item.stockQuantity) {
                handleUpdateQuantity(item.id, item.quantity + 1);
              }
            }}
            style={styles(theme).quantityButton}
            disabled={item.quantity >= item.stockQuantity}
          >
            <BodyText>+</BodyText>
          </TouchableOpacity>
        </Row>
      </Row>
    </Card>
  );

  // Render cart
  const renderCart = ({ item: cart }: { item: CartData }) => (
    <View style={styles(theme).cartContainer}>
      <Card style={styles(theme).cartHeader}>
        <Heading2>{cart.items[0]?.pharmacyName || 'Pharmacy'}</Heading2>
        <Caption>
          {cart.totalQuantity} items • ₹{cart.finalAmount.toFixed(0)}
        </Caption>
      </Card>

      <FlashList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
      />

      <Card style={styles(theme).summaryCard}>
        <Row style={styles(theme).summaryRow}>
          <BodyText>Subtotal:</BodyText>
          <BodyText>₹{cart.subtotal.toFixed(0)}</BodyText>
        </Row>

        <Row style={styles(theme).summaryRow}>
          <BodyText>Delivery:</BodyText>
          <BodyText>
            {cart.isFreeDeliveryEligible
              ? 'FREE'
              : `₹${cart.deliveryCharge.toFixed(0)}`}
          </BodyText>
        </Row>

        <Row style={[styles(theme).summaryRow, styles(theme).totalRow]}>
          <Heading2>Total:</Heading2>
          <Heading2>₹{cart.finalAmount.toFixed(0)}</Heading2>
        </Row>

        <Button
          title="Proceed to Checkout"
          onPress={() => handleCheckout(cart)}
          style={styles(theme).checkoutButton}
        />
      </Card>
    </View>
  );

  if (isLoading) {
    return (
      <Screen>
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.interactive.primary}
          />
          <BodyText>Loading cart...</BodyText>
        </View>
      </Screen>
    );
  }

  if (relevantCarts.length === 0) {
    return (
      <Screen>
        <View style={styles(theme).emptyContainer}>
          <Text style={styles(theme).emptyIcon}>🛒</Text>
          <Heading2>Your cart is empty</Heading2>
          <Button
            title="Browse Medicines"
            onPress={() => navigate('HomeScreen')}
            style={styles(theme).emptyAction}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles(theme).header}>
        <Heading1>
          {pharmacyId ? 'Cart' : `My Carts (${relevantCarts.length})`}
        </Heading1>
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
    </Screen>
  );
};

const styles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      padding: spacing.md,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.secondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
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
    emptyAction: {
      marginTop: spacing.xl,
    },
    cartContainer: {
      marginBottom: spacing.xl,
    },
    cartHeader: {
      marginBottom: spacing.md,
      padding: spacing.md,
    },
    cartItem: {
      marginBottom: spacing.md,
      padding: spacing.md,
    },
    itemHeader: {
      alignItems: 'flex-start',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    itemImage: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemDetails: {
      flex: 1,
      gap: spacing.xs,
    },
    itemName: {
      fontWeight: '500',
      color: theme.colors.text.primary,
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
    itemFooter: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
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
    },
    quantity: {
      minWidth: 40,
      textAlign: 'center',
      fontWeight: '500',
    },
    summaryCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.secondary,
      paddingTop: spacing.md,
      marginTop: spacing.md,
    },
    checkoutButton: {
      marginTop: spacing.lg,
    },
  }),
);

export default CartScreen;
