/**
 * Reusable Button Component
 * Supports multiple variants and sizes with consistent theming
 * Matches design: outline, ghost (with light bg), and solid buttons
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles/colors';
import {
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../../styles/globalStyles';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Helper: Spinner color based on variant
const getSpinnerColor = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
    case 'success':
    case 'warning':
      return colors.white;
    case 'outline':
    case 'ghost':
    default:
      return colors.primary[500];
  }
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  // Determine if we need outline-specific padding adjustment
  const isOutline = variant === 'outline';

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    isOutline &&
      styles[`${variant}${size.charAt(0).toUpperCase() + size.slice(1)}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor(variant)} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base shared styles
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.6,
  },

  // === Variants ===
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  ghost: {
    backgroundColor: '#f5f5f5', // light gray background like in your screenshot
    borderWidth: 0,
  },
  danger: {
    backgroundColor: colors.error.DEFAULT,
  },
  success: {
    backgroundColor: colors.success.DEFAULT,
  },
  warning: {
    backgroundColor: colors.warning.DEFAULT,
  },

  // === Base Sizes (for solid & ghost) ===
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },

  // === Outline-specific size adjustments (to offset 2px border) ===
  outlineSm: {
    paddingVertical: spacing.xs + 2 - 1,
    paddingHorizontal: spacing.md - 1,
  },
  outlineMd: {
    paddingVertical: spacing.sm + 4 - 1,
    paddingHorizontal: spacing.lg - 1,
  },
  outlineLg: {
    paddingVertical: spacing.md - 1,
    paddingHorizontal: spacing.xl - 1,
  },

  // === Text base ===
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    includeFontPadding: false, // removes extra top/bottom padding on Android
  },

  // === Text colors ===
  primaryText: { color: colors.white },
  secondaryText: { color: colors.white },
  outlineText: { color: colors.primary[500] },
  ghostText: { color: colors.primary[500] },
  dangerText: { color: colors.white },
  successText: { color: colors.white },
  warningText: { color: colors.white },

  // Disabled text
  disabledText: {
    opacity: 0.8,
  },

  // === Text Sizes ===
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
});

export default Button;
