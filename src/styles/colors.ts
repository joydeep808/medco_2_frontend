/**
 * Modern Color System
 * Based on HSL color format for intuitive palette creation
 * Supports both light and dark modes with semantic color naming
 * Optimized for medical/healthcare applications
 */

// Base color configuration - Medical blue theme
const BASE_HUE = 210; // Medical blue hue
const BASE_SATURATION = 90; // High saturation for vibrant colors
const ACCENT_HUE = 160; // Teal accent for medical theme

// Neutral Color Palette (Light Mode - Primary)
const neutralsLight = {
  // Background shades (lightest to darker)
  background: 'hsl(210, 20%, 98%)', // Soft white with blue tint
  surface: 'hsl(210, 25%, 96%)', // Card surfaces
  surfaceHighlight: 'hsl(210, 30%, 94%)', // Highlighted surfaces
  surfaceElevated: 'hsl(210, 35%, 92%)', // Elevated surfaces
  border: 'hsl(210, 20%, 88%)', // Subtle borders
  borderHighlight: 'hsl(210, 25%, 82%)', // Active borders

  // Text shades (high contrast to muted)
  textHighContrast: 'hsl(210, 15%, 8%)', // Headings
  textPrimary: 'hsl(210, 12%, 16%)', // Primary text
  textSecondary: 'hsl(210, 10%, 40%)', // Secondary text
  textMuted: 'hsl(210, 8%, 60%)', // Muted text
  textDisabled: 'hsl(210, 5%, 75%)', // Disabled text
};

// Neutral Color Palette (Dark Mode)
const neutralsDark = {
  background: 'hsl(210, 15%, 6%)', // Deep dark blue
  surface: 'hsl(210, 18%, 10%)', // Surface elements
  surfaceHighlight: 'hsl(210, 20%, 14%)', // Highlighted surfaces
  surfaceElevated: 'hsl(210, 22%, 18%)', // Elevated surfaces
  border: 'hsl(210, 15%, 22%)', // Borders and dividers
  borderHighlight: 'hsl(210, 18%, 28%)', // Active borders

  textHighContrast: 'hsl(210, 20%, 98%)', // Headings
  textPrimary: 'hsl(210, 15%, 90%)', // Primary text
  textSecondary: 'hsl(210, 12%, 70%)', // Secondary text
  textMuted: 'hsl(210, 10%, 50%)', // Muted text
  textDisabled: 'hsl(210, 8%, 35%)', // Disabled text
};

// Primary Brand Colors - Medical Blue
const primary = {
  50: 'hsl(210, 100%, 97%)',
  100: 'hsl(210, 95%, 93%)',
  200: 'hsl(210, 90%, 85%)',
  300: 'hsl(210, 85%, 75%)',
  400: 'hsl(210, 80%, 65%)',
  500: 'hsl(210, 75%, 55%)', // Base primary - medical blue
  600: 'hsl(210, 70%, 48%)',
  700: 'hsl(210, 65%, 40%)',
  800: 'hsl(210, 60%, 32%)',
  900: 'hsl(210, 55%, 24%)',
};

// Secondary Colors - Medical Teal
const secondary = {
  50: 'hsl(160, 85%, 95%)',
  100: 'hsl(160, 80%, 88%)',
  200: 'hsl(160, 75%, 78%)',
  300: 'hsl(160, 70%, 68%)',
  400: 'hsl(160, 65%, 58%)',
  500: 'hsl(160, 60%, 48%)', // Base secondary
  600: 'hsl(160, 55%, 40%)',
  700: 'hsl(160, 50%, 32%)',
  800: 'hsl(160, 45%, 24%)',
  900: 'hsl(160, 40%, 18%)',
};

// Semantic Colors - Enhanced for medical context
const semantic = {
  // Success (Medical Green)
  success: {
    50: 'hsl(145, 85%, 95%)',
    100: 'hsl(145, 80%, 88%)',
    500: 'hsl(145, 70%, 45%)', // Default
    600: 'hsl(145, 75%, 38%)',
    700: 'hsl(145, 80%, 32%)',
    light: 'hsl(145, 75%, 52%)',
    DEFAULT: 'hsl(145, 70%, 45%)',
    dark: 'hsl(145, 80%, 32%)',
  },

  // Warning (Medical Amber)
  warning: {
    50: 'hsl(45, 95%, 95%)',
    100: 'hsl(45, 90%, 88%)',
    500: 'hsl(45, 85%, 55%)', // Default
    600: 'hsl(45, 80%, 48%)',
    700: 'hsl(45, 75%, 40%)',
    light: 'hsl(45, 90%, 62%)',
    DEFAULT: 'hsl(45, 85%, 55%)',
    dark: 'hsl(45, 75%, 40%)',
  },

  // Error (Medical Red)
  error: {
    50: 'hsl(0, 90%, 95%)',
    100: 'hsl(0, 85%, 88%)',
    500: 'hsl(0, 75%, 55%)', // Default
    600: 'hsl(0, 80%, 48%)',
    700: 'hsl(0, 85%, 40%)',
    light: 'hsl(0, 80%, 62%)',
    DEFAULT: 'hsl(0, 75%, 55%)',
    dark: 'hsl(0, 85%, 40%)',
  },

  // Info (Light Blue)
  info: {
    50: 'hsl(200, 95%, 95%)',
    100: 'hsl(200, 90%, 88%)',
    500: 'hsl(200, 85%, 60%)', // Default
    600: 'hsl(200, 80%, 52%)',
    700: 'hsl(200, 75%, 44%)',
    light: 'hsl(200, 90%, 68%)',
    DEFAULT: 'hsl(200, 85%, 60%)',
    dark: 'hsl(200, 75%, 44%)',
  },
};

// Export comprehensive color system
export const colors = {
  // Theme-based neutrals
  light: neutralsLight,
  dark: neutralsDark,

  // Brand colors
  primary,
  secondary,

  // Semantic colors
  ...semantic,

  // Utility colors
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  // Medical theme specific colors
  medical: {
    primary: primary[500],
    secondary: secondary[500],
    accent: 'hsl(280, 70%, 60%)', // Purple accent
    emergency: 'hsl(0, 85%, 50%)', // Emergency red
    safe: 'hsl(145, 70%, 45%)', // Safe green
  },
};

// Enhanced color tokens for easy access
export const colorTokens = {
  // Background tokens
  bg: {
    primary: 'background',
    secondary: 'surface',
    tertiary: 'surfaceHighlight',
    elevated: 'surfaceElevated',
  },

  // Text tokens
  text: {
    primary: 'textPrimary',
    secondary: 'textSecondary',
    muted: 'textMuted',
    contrast: 'textHighContrast',
    disabled: 'textDisabled',
  },

  // Border tokens
  border: {
    primary: 'border',
    secondary: 'borderHighlight',
  },

  // Interactive tokens
  interactive: {
    primary: 'primary.500',
    primaryHover: 'primary.600',
    primaryActive: 'primary.700',
    secondary: 'secondary.500',
    secondaryHover: 'secondary.600',
  },

  // Status tokens
  status: {
    success: 'success.DEFAULT',
    warning: 'warning.DEFAULT',
    error: 'error.DEFAULT',
    info: 'info.DEFAULT',
  },
};

export default colors;
