/**
 * Global Color System
 * Based on HSL color format for intuitive palette creation
 * Supports both light and dark modes with semantic color naming
 */

// Base color configuration
const BASE_HUE = 220; // Blue-ish hue for primary colors
const BASE_SATURATION = 85; // High saturation for vibrant colors
const NEUTRAL_SATURATION = 0; // No saturation for neutral grays

// Neutral Color Palette (Dark Mode Base)
const neutralsDark = {
  // Background shades (darkest to lightest)
  background: `hsl(${BASE_HUE}, 5%, 0%)`, // Pure black base
  surface: `hsl(${BASE_HUE}, 5%, 5%)`, // Surface elements
  surfaceHighlight: `hsl(${BASE_HUE}, 5%, 10%)`, // Highlighted surfaces
  border: `hsl(${BASE_HUE}, 5%, 15%)`, // Borders and dividers
  borderHighlight: `hsl(${BASE_HUE}, 5%, 20%)`, // Active borders

  // Text shades (muted to high contrast)
  textMuted: `hsl(${BASE_HUE}, 5%, 50%)`, // Secondary text
  textSecondary: `hsl(${BASE_HUE}, 5%, 70%)`, // Regular text
  textPrimary: `hsl(${BASE_HUE}, 5%, 90%)`, // Primary text
  textHighContrast: `hsl(${BASE_HUE}, 5%, 100%)`, // Headings
};

// Neutral Color Palette (Light Mode - inverted lightness)
const neutralsLight = {
  background: `hsl(${BASE_HUE}, 5%, 100%)`, // Pure white base
  surface: `hsl(${BASE_HUE}, 5%, 95%)`, // Surface elements
  surfaceHighlight: `hsl(${BASE_HUE}, 5%, 90%)`, // Highlighted surfaces
  border: `hsl(${BASE_HUE}, 5%, 85%)`, // Borders and dividers
  borderHighlight: `hsl(${BASE_HUE}, 5%, 80%)`, // Active borders

  textMuted: `hsl(${BASE_HUE}, 5%, 50%)`, // Secondary text
  textSecondary: `hsl(${BASE_HUE}, 5%, 30%)`, // Regular text
  textPrimary: `hsl(${BASE_HUE}, 5%, 10%)`, // Primary text
  textHighContrast: `hsl(${BASE_HUE}, 5%, 0%)`, // Headings
};

// Primary Brand Colors
const primary = {
  50: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 95%)`,
  100: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 90%)`,
  200: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 80%)`,
  300: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 70%)`,
  400: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 60%)`,
  500: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 50%)`, // Base primary
  600: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 40%)`,
  700: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 30%)`,
  800: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 20%)`,
  900: `hsl(${BASE_HUE}, ${BASE_SATURATION}%, 10%)`,
};

// Semantic Colors
const semantic = {
  // Success (Green)
  success: {
    light: 'hsl(142, 76%, 36%)',
    DEFAULT: 'hsl(142, 71%, 45%)',
    dark: 'hsl(142, 76%, 36%)',
  },

  // Warning (Amber)
  warning: {
    light: 'hsl(43, 96%, 56%)',
    DEFAULT: 'hsl(38, 92%, 50%)',
    dark: 'hsl(32, 95%, 44%)',
  },

  // Error (Red)
  error: {
    light: 'hsl(0, 84%, 60%)',
    DEFAULT: 'hsl(0, 72%, 51%)',
    dark: 'hsl(0, 74%, 42%)',
  },

  // Info (Blue)
  info: {
    light: 'hsl(204, 94%, 94%)',
    DEFAULT: 'hsl(204, 100%, 97%)',
    dark: 'hsl(204, 94%, 94%)',
  },
};

// Export color palettes
export const colors = {
  // Theme-based neutrals
  light: neutralsLight,
  dark: neutralsDark,

  // Brand colors
  primary,

  // Semantic colors
  ...semantic,

  // Utility colors
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

// Color tokens for easy access
export const colorTokens = {
  // Background tokens
  bg: {
    primary: 'background',
    secondary: 'surface',
    tertiary: 'surfaceHighlight',
  },

  // Text tokens
  text: {
    primary: 'textPrimary',
    secondary: 'textSecondary',
    muted: 'textMuted',
    contrast: 'textHighContrast',
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
  },
};

export default colors;
