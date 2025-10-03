/**
 * Global Styles for React Native
 * Provides consistent styling across the application
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Spacing system (8pt grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Typography scale
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadow system
export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingHorizontal: spacing.md,
  },

  containerSafe: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  column: {
    flexDirection: 'column',
  },

  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Typography
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.light.textHighContrast,
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
  },

  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.light.textHighContrast,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
  },

  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.textPrimary,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },

  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.textPrimary,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.textPrimary,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },

  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.textPrimary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.textSecondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },

  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.textMuted,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
  },

  // Cards and surfaces
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },

  cardElevated: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 0,
    ...shadows.md,
  },

  cardHighlight: {
    backgroundColor: colors.light.surfaceHighlight,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.borderHighlight,
    ...shadows.lg,
  },

  cardCompact: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },

  surface: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },

  surfaceElevated: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },

  // Buttons (base styles)
  buttonBase: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...shadows.sm,
  },

  buttonPrimary: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },

  buttonSecondary: {
    backgroundColor: colors.secondary[500],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },

  // Form elements
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.light.textPrimary,
    minHeight: 52,
  },

  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.light.surface,
    ...shadows.sm,
  },

  inputError: {
    borderColor: colors.error.DEFAULT,
    backgroundColor: colors.error[50],
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.md,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: colors.light.border,
    marginHorizontal: spacing.md,
  },
});

// Screen dimensions
export const screen = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth < 375,
  isMedium: screenWidth >= 375 && screenWidth < 414,
  isLarge: screenWidth >= 414,
};

// Export all design tokens
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  screen,
};

export default globalStyles;
