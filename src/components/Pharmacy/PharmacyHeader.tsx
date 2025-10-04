/**
 * Pharmacy Header Component
 * Displays pharmacy information at the top of pharmacy screen
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  BodyText,
  Heading2,
  Heading3,
  Caption,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';

interface PharmacyHeaderProps {
  pharmacy: {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    isOpen: boolean;
    operatingHours: string;
    deliveryRadiusKm: number;
    minimumOrderAmount: number;
    deliveryFee: number;
    freeDeliveryAbove: number;
    averageDeliveryTime: number;
    isDeliveryAvailable: boolean;
    rating: number;
    totalRatings: number;
  };
}

export const PharmacyHeader: React.FC<PharmacyHeaderProps> = ({ pharmacy }) => {
  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        {/* Pharmacy Name and Status */}
        <Row style={styles.headerRow}>
          <Column style={styles.nameSection}>
            <Heading2 color="primary">{pharmacy.name}</Heading2>
            <Row style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: pharmacy.isOpen
                      ? colors.success[500]
                      : colors.error[500],
                  },
                ]}
              />
              <BodyText color={pharmacy.isOpen ? 'success' : 'error'}>
                {pharmacy.isOpen ? 'Open' : 'Closed'}
              </BodyText>
              <BodyText color="secondary">• {pharmacy.operatingHours}</BodyText>
            </Row>
          </Column>

          {pharmacy.rating > 0 && (
            <View style={styles.ratingSection}>
              <Row style={styles.ratingRow}>
                <BodyText style={styles.ratingText}>
                  ⭐ {pharmacy.rating.toFixed(1)}
                </BodyText>
              </Row>
              <Caption color="secondary">
                {pharmacy.totalRatings} reviews
              </Caption>
            </View>
          )}
        </Row>

        {/* Description */}
        <BodyText color="secondary" style={styles.description}>
          {pharmacy.description}
        </BodyText>

        {/* Address */}
        <Row style={styles.addressRow}>
          <BodyText style={styles.addressIcon}>📍</BodyText>
          <Column style={styles.addressContent}>
            <BodyText color="primary">{pharmacy.address}</BodyText>
            <BodyText color="secondary">
              {pharmacy.city}, {pharmacy.state} - {pharmacy.pincode}
            </BodyText>
          </Column>
        </Row>

        {/* Delivery Info */}
        <View style={styles.deliverySection}>
          <Heading3 color="primary" style={styles.deliveryTitle}>
            Delivery Information
          </Heading3>

          <Row style={styles.deliveryRow}>
            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Delivery Time</BodyText>
              <BodyText color="primary">
                {pharmacy.averageDeliveryTime} mins
              </BodyText>
            </Column>

            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Delivery Fee</BodyText>
              <BodyText color="primary">₹{pharmacy.deliveryFee}</BodyText>
            </Column>

            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Free Delivery</BodyText>
              <BodyText color="primary">
                Above ₹{pharmacy.freeDeliveryAbove}
              </BodyText>
            </Column>
          </Row>

          <Row style={styles.deliveryRow}>
            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Min Order</BodyText>
              <BodyText color="primary">
                ₹{pharmacy.minimumOrderAmount}
              </BodyText>
            </Column>

            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Delivery Radius</BodyText>
              <BodyText color="primary">
                {pharmacy.deliveryRadiusKm} km
              </BodyText>
            </Column>

            <Column style={styles.deliveryItem}>
              <BodyText color="secondary">Contact</BodyText>
              <BodyText color="primary">{pharmacy.phoneNumber}</BodyText>
            </Column>
          </Row>
        </View>
      </Column>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.lg,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameSection: {
    flex: 1,
    gap: spacing.sm,
  },
  statusRow: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ratingSection: {
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  ratingRow: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingText: {
    fontWeight: '700',
    color: colors.warning[700],
    fontSize: 16,
  },
  description: {
    lineHeight: 22,
    fontSize: 15,
    backgroundColor: colors.light.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  addressRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primary[50],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  addressIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
    gap: spacing.sm,
  },
  deliverySection: {
    backgroundColor: colors.success[50],
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  deliveryTitle: {
    marginBottom: spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    color: colors.success[700],
  },
  deliveryRow: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  deliveryItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.success[200],
    ...shadows.sm,
  },
});

export default PharmacyHeader;
