/**
 * Enhanced Floating Cart Button Component
 * Shows cart summary with comprehensive design system
 * Features depth, shadows, and medical context colors
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BodyText,
  Caption,
  Row,
  Column,
  spacing,
  borderRadius,
} from '@components';
import { ThemeManager, createThemedStyles } from '../../styles/colors';
import { InteractiveShadows, ShadowSystem } from '../../styles/shadows';
import useCartStore from '@store/CartStore.new';

import { navigate } from '@utils/NavigationUtils';

interface FloatingCartButtonProps {
  pharmacyId?: string;
  pharmacyName?: string;
  itemCount?: number;
  totalAmount?: number;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  pharmacyId,
  pharmacyName,
  itemCount,
  totalAmount,
}) => {
  const { getCartPreview, getCartItemCount, getCartTotal } = useCartStore();
  const cartPreview = getCartPreview();

  // Use store data if no props provided
  const totalItems = itemCount ?? getCartItemCount();
  const totalAmountValue = totalAmount ?? getCartTotal();

  if (totalItems === 0) {
    return null;
  }

  const handlePress = () => {
    if (pharmacyId) {
      navigate('CartScreen', { pharmacyId: parseInt(pharmacyId) });
    } else {
      navigate('CartScreen', {});
    }
  };

  const theme = ThemeManager.getCurrentThemeConfig();

  return (
    <View style={styles(theme).container}>
      <TouchableOpacity
        style={styles(theme).button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Row style={styles(theme).content}>
          {/* Cart Icon and Count */}
          <View style={styles(theme).iconSection}>
            <View style={styles(theme).cartIcon}>
              <BodyText style={styles(theme).cartEmoji}>🛒</BodyText>
              {totalItems > 0 && (
                <View style={styles(theme).badge}>
                  <Caption style={styles(theme).badgeText}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </Caption>
                </View>
              )}
            </View>
          </View>

          {/* Cart Details */}
          <Column style={styles(theme).detailsSection}>
            <BodyText color="contrast" style={styles(theme).itemCount}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </BodyText>
            <Caption style={styles(theme).pharmacyName}>
              {pharmacyName ||
                (cartPreview.length > 1
                  ? `${cartPreview.length} pharmacies`
                  : cartPreview[0]?.pharmacyName || 'Cart')}
            </Caption>
          </Column>

          {/* Total and Action */}
          <Column style={styles(theme).actionSection}>
            <BodyText color="contrast" style={styles(theme).total}>
              ₹{totalAmountValue.toFixed(0)}
            </BodyText>
            <Caption style={styles(theme).actionText}>View Cart</Caption>
          </Column>

          {/* Arrow Icon */}
          <View style={styles(theme).arrowSection}>
            <BodyText style={styles(theme).arrow}>→</BodyText>
          </View>
        </Row>
      </TouchableOpacity>
    </View>
  );
};

const styles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: spacing.lg,
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 1000,
    },
    button: {
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...InteractiveShadows.button('primary', 'default'),
      // Enhanced depth with overlay shadow
      ...ShadowSystem.overlay(theme.colors.interactive.primary),
    },
    content: {
      alignItems: 'center',
      gap: spacing.md,
    },
    iconSection: {
      position: 'relative',
    },
    cartIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      ...ShadowSystem.depth1(),
    },
    cartEmoji: {
      fontSize: 18,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.status.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.interactive.primary,
      ...ShadowSystem.depth2(),
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 12,
    },
    detailsSection: {
      flex: 1,
      gap: spacing.xs,
    },
    itemCount: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.inverse,
    },
    pharmacyName: {
      color: theme.colors.text.inverse,
      fontSize: 12,
      opacity: 0.8,
    },
    actionSection: {
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    total: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.inverse,
    },
    actionText: {
      color: theme.colors.text.inverse,
      fontSize: 12,
      opacity: 0.8,
    },
    arrowSection: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.overlay,
      borderRadius: 12,
      ...ShadowSystem.depth1(),
    },
    arrow: {
      fontSize: 16,
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
  }),
);

export default FloatingCartButton;
