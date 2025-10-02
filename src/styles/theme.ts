/**
 * Theme System
 * Manages light/dark mode and provides theme-aware styling
 */

import { colors } from './colors';
import {
  globalStyles,
  spacing,
  typography,
  borderRadius,
  shadows,
} from './globalStyles';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof colors.light;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

// Light theme
export const lightTheme: Theme = {
  mode: 'light',
  colors: colors.light,
  spacing,
  typography,
  borderRadius,
  shadows,
};

// Dark theme
export const darkTheme: Theme = {
  mode: 'dark',
  colors: colors.dark,
  spacing,
  typography,
  borderRadius,
  shadows,
};

// Theme-aware style generator
export const createThemedStyles = (theme: Theme) => ({
  // Override global styles with theme colors
  container: {
    ...globalStyles.container,
    backgroundColor: theme.colors.background,
  },

  containerPadded: {
    ...globalStyles.containerPadded,
    backgroundColor: theme.colors.background,
  },

  // Typography with theme colors
  h1: {
    ...globalStyles.h1,
    color: theme.colors.textHighContrast,
  },

  h2: {
    ...globalStyles.h2,
    color: theme.colors.textHighContrast,
  },

  h3: {
    ...globalStyles.h3,
    color: theme.colors.textPrimary,
  },

  h4: {
    ...globalStyles.h4,
    color: theme.colors.textPrimary,
  },

  bodyLarge: {
    ...globalStyles.bodyLarge,
    color: theme.colors.textPrimary,
  },

  body: {
    ...globalStyles.body,
    color: theme.colors.textPrimary,
  },

  bodySmall: {
    ...globalStyles.bodySmall,
    color: theme.colors.textSecondary,
  },

  caption: {
    ...globalStyles.caption,
    color: theme.colors.textMuted,
  },

  // Cards with theme colors
  card: {
    ...globalStyles.card,
    backgroundColor: theme.colors.surface,
  },

  cardHighlight: {
    ...globalStyles.cardHighlight,
    backgroundColor: theme.colors.surfaceHighlight,
  },

  // Form elements with theme colors
  input: {
    ...globalStyles.input,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },

  inputFocused: {
    ...globalStyles.inputFocused,
    borderColor: colors.primary[500],
  },

  // Dividers with theme colors
  divider: {
    ...globalStyles.divider,
    backgroundColor: theme.colors.border,
  },

  dividerVertical: {
    ...globalStyles.dividerVertical,
    backgroundColor: theme.colors.border,
  },
});

// Default theme
export const defaultTheme = lightTheme;

export { colors, globalStyles, spacing, typography, borderRadius, shadows };
