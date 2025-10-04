/**
 * Enhanced Product Card Component
 * Displays medicine information with comprehensive design system
 * Features depth, shadows, and medical context colors
 */

import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  BodyText,
  Heading3,
  Caption,
  Button,
  Card,
  Row,
  Column,
  spacing,
  borderRadius,
} from '@components';
import { ThemeManager, createThemedStyles } from '../../styles/colors';
import {
  InteractiveShadows,
  MedicalShadows,
  ShadowSystem,
} from '../../styles/shadows';

interface ProductCardProps {
  medicine: {
    id: number;
    name: string;
    genericName: string;
    brandName: string;
    manufacturer: string;
    description: string;
    requiresPrescription: boolean;
    imageUrl: string;
  };
  variants: Array<{
    id: number;
    medicineId: number;
    variantName: string;
    strength: string;
    packSize: string;
    unit: string;
    sku: string;
    mrp: number;
    sellingPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    stockQuantity: number;
    minQuantity: number;
    maxQuantity: number;
    expiryDate: number;
    isAvailable: boolean;
  }>;
  onAddToCart: (medicine: any, variant: any) => void;
  addingToCart?: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  medicine,
  variants,
  onAddToCart,
  addingToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [showAllVariants, setShowAllVariants] = useState(false);

  const displayVariants = showAllVariants ? variants : variants.slice(0, 2);
  const hasMoreVariants = variants.length > 2;

  const calculateSavings = (variant: any) => {
    return variant.mrp - variant.discountedPrice;
  };

  const renderVariant = (variant: any) => {
    const isSelected = selectedVariant.id === variant.id;
    const savings = calculateSavings(variant);
    const theme = ThemeManager.getCurrentThemeConfig();

    return (
      <TouchableOpacity
        key={variant.id}
        style={[
          styles(theme).variantCard,
          isSelected && styles(theme).selectedVariant,
          variant.stockQuantity === 0 && styles(theme).outOfStockVariant,
        ]}
        onPress={() => setSelectedVariant(variant)}
        disabled={variant.stockQuantity === 0}
      >
        <Column style={styles(theme).variantContent}>
          <Row style={styles(theme).variantHeader}>
            <Column style={styles(theme).variantInfo}>
              <BodyText color="primary" style={styles(theme).variantName}>
                {variant.variantName}
              </BodyText>
              <Caption color="secondary">
                {variant.strength} • {variant.packSize}
              </Caption>
            </Column>

            {variant.stockQuantity === 0 && (
              <View style={styles(theme).outOfStockBadge}>
                <Caption color="error">Out of Stock</Caption>
              </View>
            )}
          </Row>

          <Row style={styles(theme).priceRow}>
            <Column style={styles(theme).priceInfo}>
              <Row style={styles(theme).priceContainer}>
                <BodyText color="primary" style={styles(theme).sellingPrice}>
                  ₹{variant.discountedPrice.toFixed(0)}
                </BodyText>
                {variant.mrp > variant.discountedPrice && (
                  <BodyText color="secondary" style={styles(theme).mrpPrice}>
                    ₹{variant.mrp.toFixed(0)}
                  </BodyText>
                )}
              </Row>

              {savings > 0 && (
                <Caption color="success">
                  Save ₹{savings.toFixed(0)} ({variant.discountPercentage}% off)
                </Caption>
              )}
            </Column>

            {variant.stockQuantity > 0 && (
              <Button
                title="Add"
                variant={isSelected ? 'primary' : 'ghost'}
                size="sm"
                style={styles(theme).addButton}
                onPress={() => onAddToCart(medicine, variant)}
                loading={addingToCart === `${medicine.id}_${variant.id}`}
                disabled={addingToCart === `${medicine.id}_${variant.id}`}
              />
            )}
          </Row>
        </Column>
      </TouchableOpacity>
    );
  };

  const theme = ThemeManager.getCurrentThemeConfig();

  return (
    <Card style={styles(theme).container}>
      <Column style={styles(theme).content}>
        {/* Medicine Header */}
        <Row style={styles(theme).header}>
          {medicine.imageUrl && (
            <Image
              source={{ uri: medicine.imageUrl }}
              style={styles(theme).medicineImage}
              resizeMode="cover"
            />
          )}

          <Column style={styles(theme).medicineInfo}>
            <Heading3 color="primary" style={styles(theme).medicineName}>
              {medicine.name}
            </Heading3>

            <BodyText color="secondary" style={styles(theme).brandName}>
              {medicine.brandName} • {medicine.manufacturer}
            </BodyText>

            <Caption color="secondary" style={styles(theme).genericName}>
              {medicine.genericName}
            </Caption>

            {medicine.requiresPrescription && (
              <View style={styles(theme).prescriptionBadge}>
                <Caption color="warning">Prescription Required</Caption>
              </View>
            )}
          </Column>
        </Row>

        {/* Medicine Description */}
        {medicine.description && (
          <BodyText color="secondary" style={styles(theme).description}>
            {medicine.description}
          </BodyText>
        )}

        {/* Variants */}
        <View style={styles(theme).variantsSection}>
          <BodyText color="primary" style={styles(theme).variantsTitle}>
            Available Options:
          </BodyText>

          <Column style={styles(theme).variantsList}>
            {displayVariants.map(renderVariant)}

            {hasMoreVariants && !showAllVariants && (
              <TouchableOpacity
                style={styles(theme).showMoreButton}
                onPress={() => setShowAllVariants(true)}
              >
                <BodyText color="primary" style={styles(theme).showMoreText}>
                  +{variants.length - 2} more options
                </BodyText>
              </TouchableOpacity>
            )}
          </Column>
        </View>
      </Column>
    </Card>
  );
};

const styles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      marginHorizontal: spacing.lg,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      ...InteractiveShadows.card('default', 2),
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    header: {
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    medicineImage: {
      width: 70,
      height: 70,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...ShadowSystem.depth1(theme.colors.background.secondary),
    },
    medicineInfo: {
      flex: 1,
      gap: spacing.sm,
    },
    medicineName: {
      lineHeight: 22,
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.contrast,
    },
    brandName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    genericName: {
      fontStyle: 'italic',
      fontSize: 13,
      color: theme.colors.text.secondary,
    },
    prescriptionBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
      ...MedicalShadows.prescription(),
    },
    description: {
      lineHeight: 20,
      fontSize: 14,
      color: theme.colors.text.secondary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      ...ShadowSystem.depth1(theme.colors.background.tertiary),
    },
    variantsSection: {
      gap: spacing.md,
    },
    variantsTitle: {
      fontWeight: '700',
      fontSize: 16,
      color: theme.colors.text.contrast,
    },
    variantsList: {
      gap: spacing.md,
    },
    variantCard: {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...ShadowSystem.depth1(theme.colors.background.secondary),
    },
    selectedVariant: {
      borderWidth: 2,
      borderColor: theme.colors.interactive.primary,
      ...InteractiveShadows.card('selected', 2),
    },
    outOfStockVariant: {
      opacity: 0.5,
      borderColor: theme.colors.status.errorBorder,
      backgroundColor: theme.colors.background.primary,
    },
    variantContent: {
      gap: spacing.md,
    },
    variantHeader: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    variantInfo: {
      flex: 1,
      gap: spacing.sm,
    },
    variantName: {
      fontWeight: '600',
      fontSize: 16,
      color: theme.colors.text.contrast,
    },
    outOfStockBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.colors.status.errorBackground,
      borderWidth: 1,
      borderColor: theme.colors.status.errorBorder,
    },
    priceRow: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    priceInfo: {
      flex: 1,
      gap: spacing.sm,
    },
    priceContainer: {
      alignItems: 'center',
      gap: spacing.md,
    },
    sellingPrice: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.status.success,
    },
    mrpPrice: {
      fontSize: 15,
      textDecorationLine: 'line-through',
      color: theme.colors.text.muted,
    },
    addButton: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      minWidth: 80,
    },
    showMoreButton: {
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.colors.interactive.primary,
      borderStyle: 'dashed',
      alignItems: 'center',
      backgroundColor: theme.colors.background.tertiary,
      ...ShadowSystem.depth1(),
    },
    showMoreText: {
      fontWeight: '600',
      color: theme.colors.interactive.primary,
      fontSize: 15,
    },
  }),
);

export default ProductCard;
