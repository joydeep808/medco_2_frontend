/**
 * Floating Cart Widget Component
 * Zomato-like floating cart widget with item count and quick access
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useCartStore } from '@store/CartStore';

export interface FloatingCartWidgetProps {
  onPress?: () => void;
  style?: any;
}

export const FloatingCartWidget: React.FC<FloatingCartWidgetProps> = ({
  onPress,
  style,
}) => {
  const { totalItems, totalAmount, carts, getCartPreview } = useCartStore();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (totalItems > 0) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(slideAnim, {
          toValue: 100,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [totalItems]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const cartPreview = getCartPreview();
  const activeCartsCount = cartPreview.length;

  if (totalItems === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cartWidget}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.itemBadge}>
            <Text style={styles.itemCount}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
          <View style={styles.cartInfo}>
            <Text style={styles.itemsText}>
              {totalItems} item{totalItems > 1 ? 's' : ''}
            </Text>
            {activeCartsCount > 1 && (
              <Text style={styles.pharmaciesText}>
                from {activeCartsCount} pharmacies
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.totalAmount}>₹{totalAmount.toFixed(0)}</Text>
          <Text style={styles.viewCartText}>View Cart →</Text>
        </View>
      </TouchableOpacity>

      {/* Cart Preview */}
      {cartPreview.length > 1 && (
        <View style={styles.previewContainer}>
          {cartPreview.slice(0, 2).map((cart, index) => (
            <View key={cart.pharmacyId} style={styles.previewItem}>
              <Text style={styles.previewPharmacy} numberOfLines={1}>
                {cart.pharmacyName}
              </Text>
              <Text style={styles.previewDetails}>
                {cart.itemCount} items • ₹{cart.total.toFixed(0)}
              </Text>
            </View>
          ))}
          {cartPreview.length > 2 && (
            <Text style={styles.moreText}>+{cartPreview.length - 2} more</Text>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  cartWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBadge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemCount: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartInfo: {
    flex: 1,
  },
  itemsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pharmaciesText: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCartText: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  previewItem: {
    marginBottom: 8,
  },
  previewPharmacy: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  previewDetails: {
    fontSize: 10,
    color: '#666',
  },
  moreText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default FloatingCartWidget;
