/**
 * Order Summary Component
 * Displays order details and pricing breakdown
 */

import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import {
  BodyText,
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

interface CartData {
  id: number;
  items: Array<{
    id: number;
    medicineName: string;
    medicineImage: string;
    variantName: string;
    pharmacyName: string;
    quantity: number;
    mrp: number;
    sellingPrice: number;
    totalPrice: number;
    savings: number;
  }>;
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  totalQuantity: number;
  couponCode?: string;
  couponDiscount: number;
  finalAmount: number;
  gstAmount: number;
  deliveryCharge: number;
  totalSavings: number;
}

interface OrderSummaryProps {
  cartData: CartData;
  specialInstructions: string;
  onSpecialInstructionsChange: (instructions: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartData,
  specialInstructions,
  onSpecialInstructionsChange,
}) => {
  const renderOrderItem = (item: any) => (
    <Row key={item.id} style={styles.orderItem}>
      <Column style={styles.itemInfo}>
        <BodyText color="primary" style={styles.itemName}>
          {item.medicineName}
        </BodyText>
        <Caption color="secondary">
          {item.variantName} • Qty: {item.quantity}
        </Caption>
        <Caption color="secondary">From {item.pharmacyName}</Caption>
      </Column>

      <Column style={styles.itemPricing}>
        <Row style={styles.priceRow}>
          <BodyText color="primary" style={styles.sellingPrice}>
            ₹{item.totalPrice.toFixed(0)}
          </BodyText>
          {item.mrp > item.sellingPrice && (
            <BodyText color="secondary" style={styles.mrpPrice}>
              ₹{(item.mrp * item.quantity).toFixed(0)}
            </BodyText>
          )}
        </Row>
        {item.savings > 0 && (
          <Caption color="success">Save ₹{item.savings.toFixed(0)}</Caption>
        )}
      </Column>
    </Row>
  );

  const renderPricingRow = (
    label: string,
    value: number,
    isDiscount = false,
    isTotal = false,
  ) => (
    <Row style={[styles.pricingRow, isTotal ? styles.totalRow : null]}>
      <BodyText
        color={isTotal ? 'primary' : 'secondary'}
        style={isTotal ? styles.totalLabel : styles.pricingLabel}
      >
        {label}
      </BodyText>
      <BodyText
        color={isDiscount ? 'success' : isTotal ? 'primary' : 'primary'}
        style={isTotal ? styles.totalValue : styles.pricingValue}
      >
        {isDiscount ? '-' : ''}₹{Math.abs(value).toFixed(0)}
      </BodyText>
    </Row>
  );

  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        <Heading3 color="primary" style={styles.title}>
          Order Summary
        </Heading3>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <BodyText color="primary" style={styles.sectionTitle}>
            Items ({cartData.totalQuantity})
          </BodyText>
          <Column style={styles.itemsList}>
            {cartData.items.map(renderOrderItem)}
          </Column>
        </View>

        {/* Special Instructions */}
        <View style={styles.instructionsSection}>
          <BodyText color="primary" style={styles.sectionTitle}>
            Special Instructions (Optional)
          </BodyText>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Any special instructions for the pharmacy or delivery agent..."
            placeholderTextColor={colors.light.textSecondary}
            value={specialInstructions}
            onChangeText={onSpecialInstructionsChange}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.pricingSection}>
          <BodyText color="primary" style={styles.sectionTitle}>
            Bill Details
          </BodyText>

          <Column style={styles.pricingList}>
            {renderPricingRow('Item Total', cartData.subtotal)}

            {cartData.totalDiscount > 0 &&
              renderPricingRow('Item Discount', cartData.totalDiscount, true)}

            {cartData.couponDiscount > 0 && (
              <>
                {renderPricingRow(
                  'Coupon Discount',
                  cartData.couponDiscount,
                  true,
                )}
                {cartData.couponCode && (
                  <Row style={styles.couponRow}>
                    <Caption color="success">
                      Coupon "{cartData.couponCode}" applied
                    </Caption>
                  </Row>
                )}
              </>
            )}

            {renderPricingRow('Delivery Fee', cartData.deliveryCharge)}
            {renderPricingRow('Taxes & Fees', cartData.gstAmount)}

            {renderPricingRow(
              'Total Amount',
              cartData.finalAmount,
              false,
              true,
            )}

            {cartData.totalSavings > 0 && (
              <Row style={styles.savingsRow}>
                <BodyText color="success" style={styles.savingsText}>
                  🎉 You're saving ₹{cartData.totalSavings.toFixed(0)} on this
                  order!
                </BodyText>
              </Row>
            )}
          </Column>
        </View>
      </Column>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  itemsSection: {
    gap: spacing.sm,
  },
  itemsList: {
    gap: spacing.md,
  },
  orderItem: {
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  itemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
  },
  itemPricing: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  priceRow: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  sellingPrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  mrpPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  instructionsSection: {
    gap: spacing.sm,
  },
  instructionsInput: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.light.textHighContrast,
    minHeight: 80,
  },
  pricingSection: {
    gap: spacing.sm,
  },
  pricingList: {
    gap: spacing.sm,
  },
  pricingRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  pricingLabel: {
    fontSize: 14,
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  couponRow: {
    justifyContent: 'flex-end',
    marginTop: -spacing.xs,
  },
  savingsRow: {
    backgroundColor: colors.success[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});

export default OrderSummary;
