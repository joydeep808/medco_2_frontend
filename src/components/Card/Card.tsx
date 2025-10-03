/**
 * Modern Card Component
 * Provides consistent card styling with multiple variants
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, shadows } from '../../styles/globalStyles';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'compact';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  padding,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    padding && { padding: spacing[padding] },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },

  default: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },

  elevated: {
    backgroundColor: colors.white,
    borderWidth: 0,
    ...shadows.md,
  },

  outlined: {
    backgroundColor: colors.light.surface,
    borderWidth: 2,
    borderColor: colors.light.borderHighlight,
  },

  compact: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
});

export default Card;
