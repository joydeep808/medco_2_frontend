/**
 * Modern Pharmacy Card Component
 * Displays pharmacy information in a clean, modern card layout
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import {
  BodyText,
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from '@components';

export interface PharmacyCardProps {
  pharmacy: {
    id: string | number;
    name: string;
    address?:
      | string
      | {
          street: string;
          area: string;
          city: string;
          state: string;
          pincode: string;
          latitude: number;
          longitude: number;
        };
    rating: number;
    totalRatings: number;
    distance?: number;
    isOpen: boolean;
    deliveryFee: number;
    averageDeliveryTime?: number;
    estimatedDeliveryTime?: number;
    freeDeliveryAbove?: number;
    pharmacyImageUrl?: string;
    isOpen24x7?: boolean;
    hasPrescriptionUpload?: boolean;
    hasCodPayment?: boolean;
  };
  onPress?: (pharmacy: any) => void;
  compact?: boolean;
  showDistance?: boolean;
  style?: ViewStyle;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  onPress,
  compact = false,
  showDistance = true,
  style,
}) => {
  const handlePress = () => {
    onPress?.(pharmacy);
  };

  const cardStyle = compact ? styles.compactCard : styles.fullCard;

  return (
    <TouchableOpacity
      style={[cardStyle, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Pharmacy Image */}
      <View style={styles.imageContainer}>
        {pharmacy.pharmacyImageUrl ? (
          <Image
            source={{ uri: pharmacy.pharmacyImageUrl }}
            style={styles.pharmacyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <BodyText style={styles.placeholderIcon}>🏥</BodyText>
          </View>
        )}

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: pharmacy.isOpen
                ? colors.success.DEFAULT
                : colors.error.DEFAULT,
            },
          ]}
        >
          <BodyText color="white" size="xs" weight="bold">
            {pharmacy.isOpen ? 'Open' : 'Closed'}
          </BodyText>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Pharmacy Name */}
        <BodyText
          color="primary"
          weight="bold"
          size={compact ? 'sm' : 'md'}
          numberOfLines={1}
          style={styles.pharmacyName}
        >
          {pharmacy.name}
        </BodyText>

        {/* Address */}
        <BodyText
          color="secondary"
          size="xs"
          numberOfLines={compact ? 1 : 2}
          style={styles.address}
        >
          📍{' '}
          {typeof pharmacy.address === 'string'
            ? pharmacy.address
            : pharmacy.address
            ? `${pharmacy.address.area}, ${pharmacy.address.city}`
            : 'Address not available'}
        </BodyText>

        {/* Rating and Distance */}
        <View style={styles.metaRow}>
          <View style={styles.ratingContainer}>
            <BodyText color="warning" size="xs">
              ⭐
            </BodyText>
            <BodyText color="secondary" size="xs">
              {pharmacy.rating.toFixed(1)} ({pharmacy.totalRatings})
            </BodyText>
          </View>
          {showDistance && pharmacy.distance && (
            <BodyText color="secondary" size="xs">
              {pharmacy.distance.toFixed(1)} km
            </BodyText>
          )}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryContainer}>
          <BodyText color="primary" size="xs" weight="medium">
            🚚 ₹{pharmacy.deliveryFee} •{' '}
            {pharmacy.averageDeliveryTime ||
              pharmacy.estimatedDeliveryTime ||
              30}
            min
          </BodyText>
        </View>

        {/* Free Delivery Badge */}
        {pharmacy.freeDeliveryAbove && (
          <BodyText color="success" size="xs" style={styles.freeDelivery}>
            Free delivery above ₹{pharmacy.freeDeliveryAbove}
          </BodyText>
        )}

        {/* Features */}
        {!compact && (
          <View style={styles.featuresContainer}>
            {pharmacy.isOpen24x7 && (
              <View style={styles.featureBadge}>
                <BodyText color="primary" size="xs">
                  24/7
                </BodyText>
              </View>
            )}
            {pharmacy.hasPrescriptionUpload && (
              <View style={styles.featureBadge}>
                <BodyText color="primary" size="xs">
                  📋 Rx
                </BodyText>
              </View>
            )}
            {pharmacy.hasCodPayment && (
              <View style={styles.featureBadge}>
                <BodyText color="primary" size="xs">
                  💰 COD
                </BodyText>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  compactCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    height: 100,
    position: 'relative',
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    color: colors.light.textSecondary,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  cardContent: {
    padding: spacing.md,
  },
  pharmacyName: {
    marginBottom: spacing.xs,
  },
  address: {
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deliveryContainer: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  freeDelivery: {
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  featureBadge: {
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
});

export default PharmacyCard;
