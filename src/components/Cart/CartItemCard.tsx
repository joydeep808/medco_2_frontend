/**
 * Cart Item Card Component
 * Individual cart item with quantity controls and remove functionality
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { CartItem } from '@store/CartStore';

export interface CartItemCardProps {
  item: CartItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  style?: any;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onQuantityChange,
  onRemove,
  style,
}) => {
  const handleQuantityDecrease = () => {
    if (item.quantity > item.minQuantity) {
      onQuantityChange?.(item.quantity - 1);
    } else if (item.quantity === 1) {
      handleRemove();
    }
  };

  const handleQuantityIncrease = () => {
    if (item.quantity < item.maxQuantity) {
      onQuantityChange?.(item.quantity + 1);
    } else {
      Alert.alert(
        'Maximum Quantity',
        `You can only add up to ${item.maxQuantity} units of this item.`,
      );
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${item.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ],
    );
  };

  const calculateItemTotal = () => {
    const discountAmount =
      item.discountType === 'PERCENTAGE'
        ? (item.price * item.discount) / 100
        : item.discount;
    return (item.price - discountAmount) * item.quantity;
  };

  const renderPrescriptionBadge = () => {
    if (!item.requiresPrescription) return null;

    return (
      <View
        style={[
          styles.prescriptionBadge,
          {
            backgroundColor: item.prescriptionUploaded ? '#4CAF50' : '#F44336',
          },
        ]}
      >
        <Text style={styles.prescriptionText}>
          {item.prescriptionUploaded ? '✓ Rx' : 'Rx Required'}
        </Text>
      </View>
    );
  };

  const renderStockStatus = () => {
    if (item.inStock) return null;

    return (
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>Out of Stock</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>💊</Text>
          </View>
        )}
        {renderPrescriptionBadge()}
        {renderStockStatus()}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.brand && <Text style={styles.brandName}>{item.brand}</Text>}
            {item.strength && (
              <Text style={styles.strength}>{item.strength}</Text>
            )}
            <Text style={styles.form}>{item.form}</Text>
          </View>

          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pricing}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              ₹
              {(
                item.price -
                (item.discountType === 'PERCENTAGE'
                  ? (item.price * item.discount) / 100
                  : item.discount)
              ).toFixed(2)}
            </Text>
            {item.discount > 0 && (
              <>
                <Text style={styles.originalPrice}>
                  ₹{item.price.toFixed(2)}
                </Text>
                <Text style={styles.discountText}>
                  {item.discountType === 'PERCENTAGE'
                    ? `${item.discount}% OFF`
                    : `₹${item.discount} OFF`}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                item.quantity <= item.minQuantity && styles.disabledButton,
              ]}
              onPress={handleQuantityDecrease}
              disabled={!item.inStock}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  item.quantity <= item.minQuantity &&
                    styles.disabledButtonText,
                ]}
              >
                {item.quantity === 1 ? '🗑️' : '−'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                (item.quantity >= item.maxQuantity || !item.inStock) &&
                  styles.disabledButton,
              ]}
              onPress={handleQuantityIncrease}
              disabled={item.quantity >= item.maxQuantity || !item.inStock}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  (item.quantity >= item.maxQuantity || !item.inStock) &&
                    styles.disabledButtonText,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>
            ₹{calculateItemTotal().toFixed(2)}
          </Text>
        </View>

        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>
              This item is currently out of stock
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  prescriptionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescriptionText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  stockBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#F44336',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  strength: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  form: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  pricing: {
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  disabledButtonText: {
    color: '#ccc',
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  outOfStockText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CartItemCard;
