/**
 * Reusable Typography Components
 * Provides consistent text styling across the application
 */

import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/globalStyles';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'contrast'
  | 'success'
  | 'warning'
  | 'error'
  | 'white'
  | 'disabled';

export type TypographyWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold';

export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  size?: TypographySize;
  align?: TypographyAlign;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  size,
  align,
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles[variant],
    styles[`${color}Color`],
    weight && styles[`${weight}Weight`],
    size && styles[`${size}Size`],
    align && styles[`${align}Align`],
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// Individual typography components for convenience
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="h4" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = props => (
  <Typography variant="caption" {...props} />
);

const styles = StyleSheet.create({
  // Typography variants
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
  },

  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
  },

  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },

  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },

  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },

  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
  },

  // Color variants
  primaryColor: {
    color: colors.light.textPrimary,
  },

  secondaryColor: {
    color: colors.light.textSecondary,
  },

  mutedColor: {
    color: colors.light.textMuted,
  },

  contrastColor: {
    color: colors.light.textHighContrast,
  },

  successColor: {
    color: colors.success.DEFAULT,
  },

  warningColor: {
    color: colors.warning.DEFAULT,
  },

  errorColor: {
    color: colors.error.DEFAULT,
  },

  whiteColor: {
    color: colors.white,
  },

  disabledColor: {
    color: colors.light.textDisabled,
  },

  // Weight variants
  lightWeight: {
    fontWeight: typography.fontWeight.light,
  },

  normalWeight: {
    fontWeight: typography.fontWeight.normal,
  },

  mediumWeight: {
    fontWeight: typography.fontWeight.medium,
  },

  semiboldWeight: {
    fontWeight: typography.fontWeight.semibold,
  },

  boldWeight: {
    fontWeight: typography.fontWeight.bold,
  },

  // Size variants
  xsSize: {
    fontSize: typography.fontSize.xs,
  },

  smSize: {
    fontSize: typography.fontSize.sm,
  },

  mdSize: {
    fontSize: typography.fontSize.base,
  },

  lgSize: {
    fontSize: typography.fontSize.lg,
  },

  xlSize: {
    fontSize: typography.fontSize.xl,
  },

  // Alignment variants
  leftAlign: {
    textAlign: 'left',
  },

  centerAlign: {
    textAlign: 'center',
  },

  rightAlign: {
    textAlign: 'right',
  },

  justifyAlign: {
    textAlign: 'justify',
  },
});

export default Typography;
