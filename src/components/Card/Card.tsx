/**
 * Reusable Card Component
 * Provides consistent surface styling with elevation and theming
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, shadows } from '../../styles/globalStyles';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
  },

  default: {
    backgroundColor: colors.light.surface,
    ...shadows.md,
  },

  elevated: {
    backgroundColor: colors.light.surface,
    ...shadows.lg,
  },

  outlined: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },

  filled: {
    backgroundColor: colors.light.surfaceHighlight,
    ...shadows.sm,
  },
});

export default Card;
