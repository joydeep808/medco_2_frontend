/**
 * Payment Methods Component
 * Allows users to select payment method for checkout
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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

interface PaymentMethodsProps {
  selectedMethod: 'RAZORPAY' | 'COD';
  onMethodSelect: (method: 'RAZORPAY' | 'COD') => void;
  totalAmount: number;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodSelect,
  totalAmount,
}) => {
  const paymentMethods = [
    {
      id: 'RAZORPAY' as const,
      name: 'Pay Online',
      description: 'Credit/Debit Card, UPI, Net Banking, Wallets',
      icon: '💳',
      recommended: true,
      extraInfo: 'Secure payment via Razorpay',
    },
    {
      id: 'COD' as const,
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: '💵',
      recommended: false,
      extraInfo:
        totalAmount > 1000
          ? 'COD charges may apply for orders above ₹1000'
          : null,
    },
  ];

  const renderPaymentMethod = (method: (typeof paymentMethods)[0]) => {
    const isSelected = selectedMethod === method.id;

    return (
      <TouchableOpacity
        key={method.id}
        style={[styles.paymentCard, isSelected && styles.selectedPaymentCard]}
        onPress={() => onMethodSelect(method.id)}
      >
        <Row style={styles.paymentHeader}>
          <View style={styles.paymentIconContainer}>
            <BodyText style={styles.paymentIcon}>{method.icon}</BodyText>
          </View>

          <Column style={styles.paymentInfo}>
            <Row style={styles.paymentNameRow}>
              <BodyText color="primary" style={styles.paymentName}>
                {method.name}
              </BodyText>
              {method.recommended && (
                <View style={styles.recommendedBadge}>
                  <Caption style={styles.recommendedText}>Recommended</Caption>
                </View>
              )}
            </Row>

            <BodyText color="secondary" style={styles.paymentDescription}>
              {method.description}
            </BodyText>

            {method.extraInfo && (
              <Caption
                color={
                  method.id === 'COD' && totalAmount > 1000
                    ? 'warning'
                    : 'secondary'
                }
                style={styles.extraInfo}
              >
                {method.extraInfo}
              </Caption>
            )}
          </Column>

          <View style={styles.radioContainer}>
            <View
              style={[
                styles.radioButton,
                isSelected && styles.selectedRadioButton,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        <Heading3 color="primary" style={styles.title}>
          Payment Method
        </Heading3>

        <Column style={styles.methodsList}>
          {paymentMethods.map(renderPaymentMethod)}
        </Column>

        {/* Payment Security Info */}
        <View style={styles.securityInfo}>
          <Row style={styles.securityRow}>
            <BodyText style={styles.securityIcon}>🔒</BodyText>
            <Column style={styles.securityText}>
              <BodyText color="secondary" style={styles.securityTitle}>
                100% Secure Payments
              </BodyText>
              <Caption color="secondary">
                Your payment information is encrypted and secure
              </Caption>
            </Column>
          </Row>
        </View>

        {/* Payment Amount Summary */}
        <View style={styles.amountSummary}>
          <Row style={styles.amountRow}>
            <BodyText color="primary" style={styles.amountLabel}>
              Amount to be paid:
            </BodyText>
            <BodyText color="primary" style={styles.amountValue}>
              ₹{totalAmount.toFixed(0)}
            </BodyText>
          </Row>

          {selectedMethod === 'RAZORPAY' && (
            <Caption color="secondary" style={styles.paymentNote}>
              You will be redirected to secure payment gateway
            </Caption>
          )}

          {selectedMethod === 'COD' && (
            <Caption color="secondary" style={styles.paymentNote}>
              Please keep exact change ready for delivery
            </Caption>
          )}
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
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  methodsList: {
    gap: spacing.sm,
  },
  paymentCard: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  selectedPaymentCard: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  paymentHeader: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  paymentNameRow: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendedBadge: {
    backgroundColor: colors.success[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  recommendedText: {
    color: colors.success[700],
    fontSize: 10,
    fontWeight: '600',
  },
  paymentDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  extraInfo: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  radioContainer: {
    paddingTop: spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[500],
  },
  securityInfo: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  securityRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  securityIcon: {
    fontSize: 20,
  },
  securityText: {
    flex: 1,
    gap: spacing.xs,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountSummary: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  amountRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
  },
  paymentNote: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PaymentMethods;
