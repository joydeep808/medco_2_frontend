/**
 * Comprehensive Design System - Color Foundation
 * Enhanced HSL-based color system with real-time manipulation
 * Supports advanced color formats (HSL, OKLCH) and accessibility validation
 * Optimized for medical/healthcare applications with depth and visual hierarchy
 */

// ============================================================================
// HSL Color Foundation System
// ============================================================================

export interface HSLColor {
  hue: number; // 0-360
  saturation: number; // 0-100
  lightness: number; // 0-100
}

export interface OKLCHColor {
  lightness: number; // 0-1
  chroma: number; // 0-0.4 typically
  hue: number; // 0-360
}

export interface ColorScale {
  50: string; // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string; // Darkest
}

// Base color configuration - Medical theme
const BASE_HUE = 210; // Medical blue hue
const BASE_SATURATION = 75; // Optimized saturation for medical context
const ACCENT_HUE = 160; // Teal accent for medical theme

// ============================================================================
// Color Manipulation Utilities
// ============================================================================

export class ColorManipulator {
  /**
   * Parse HSL color string to HSLColor object
   */
  static parseHSL(hslString: string): HSLColor {
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) throw new Error(`Invalid HSL color: ${hslString}`);

    return {
      hue: parseInt(match[1]),
      saturation: parseInt(match[2]),
      lightness: parseInt(match[3]),
    };
  }

  /**
   * Convert HSLColor object to HSL string
   */
  static toHSL(color: HSLColor): string {
    return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
  }

  /**
   * Adjust hue of a color
   */
  static adjustHue(color: string, degrees: number): string {
    const hsl = this.parseHSL(color);
    hsl.hue = (hsl.hue + degrees) % 360;
    if (hsl.hue < 0) hsl.hue += 360;
    return this.toHSL(hsl);
  }

  /**
   * Adjust saturation of a color
   */
  static adjustSaturation(color: string, percentage: number): string {
    const hsl = this.parseHSL(color);
    hsl.saturation = Math.max(0, Math.min(100, hsl.saturation + percentage));
    return this.toHSL(hsl);
  }

  /**
   * Adjust lightness of a color
   */
  static adjustLightness(color: string, percentage: number): string {
    const hsl = this.parseHSL(color);
    hsl.lightness = Math.max(0, Math.min(100, hsl.lightness + percentage));
    return this.toHSL(hsl);
  }

  /**
   * Generate color scale from base color
   */
  static generateScale(baseColor: HSLColor, steps: number = 10): ColorScale {
    const scale: Partial<ColorScale> = {};
    const scaleKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    scaleKeys.forEach((key, index) => {
      const lightness =
        key === 500
          ? baseColor.lightness
          : key < 500
          ? 95 - index * 10 // Lighter shades
          : baseColor.lightness - (index - 5) * 8; // Darker shades

      scale[key as keyof ColorScale] = this.toHSL({
        ...baseColor,
        lightness: Math.max(5, Math.min(95, lightness)),
      });
    });

    return scale as ColorScale;
  }

  /**
   * Create complementary color
   */
  static createComplementary(baseColor: HSLColor): HSLColor {
    return {
      ...baseColor,
      hue: (baseColor.hue + 180) % 360,
    };
  }

  /**
   * Create analogous colors
   */
  static createAnalogous(baseColor: HSLColor): HSLColor[] {
    return [
      { ...baseColor, hue: (baseColor.hue - 30 + 360) % 360 },
      baseColor,
      { ...baseColor, hue: (baseColor.hue + 30) % 360 },
    ];
  }

  /**
   * Convert HSL to OKLCH (simplified conversion)
   */
  static hslToOKLCH(hsl: HSLColor): OKLCHColor {
    // Simplified conversion - in production, use proper color space conversion
    return {
      lightness: hsl.lightness / 100,
      chroma: (hsl.saturation / 100) * 0.4,
      hue: hsl.hue,
    };
  }

  /**
   * Convert OKLCH to HSL (simplified conversion)
   */
  static oklchToHSL(oklch: OKLCHColor): HSLColor {
    // Simplified conversion - in production, use proper color space conversion
    return {
      hue: oklch.hue,
      saturation: (oklch.chroma / 0.4) * 100,
      lightness: oklch.lightness * 100,
    };
  }
}

// ============================================================================
// Accessibility Validation System
// ============================================================================

export class AccessibilityChecker {
  /**
   * Calculate contrast ratio between two colors
   */
  static calculateContrastRatio(
    foreground: string,
    background: string,
  ): number {
    // Simplified calculation - in production, use proper luminance calculation
    const fgHSL = ColorManipulator.parseHSL(foreground);
    const bgHSL = ColorManipulator.parseHSL(background);

    const fgLuminance = fgHSL.lightness / 100;
    const bgLuminance = bgHSL.lightness / 100;

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Validate contrast ratio against WCAG standards
   */
  static validateContrast(
    foreground: string,
    background: string,
  ): {
    ratio: number;
    wcagAA: boolean;
    wcagAAA: boolean;
  } {
    const ratio = this.calculateContrastRatio(foreground, background);

    return {
      ratio,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
    };
  }

  /**
   * Suggest alternative colors for better contrast
   */
  static suggestAlternatives(
    failedColor: string,
    background: string,
  ): string[] {
    const alternatives: string[] = [];
    const bgHSL = ColorManipulator.parseHSL(background);
    const fgHSL = ColorManipulator.parseHSL(failedColor);

    // Suggest darker or lighter versions
    for (let adjustment = 10; adjustment <= 50; adjustment += 10) {
      const darker = ColorManipulator.adjustLightness(failedColor, -adjustment);
      const lighter = ColorManipulator.adjustLightness(failedColor, adjustment);

      if (this.validateContrast(darker, background).wcagAA) {
        alternatives.push(darker);
      }
      if (this.validateContrast(lighter, background).wcagAA) {
        alternatives.push(lighter);
      }
    }

    return alternatives;
  }
}

// ============================================================================
// Enhanced Neutral Color System
// ============================================================================

/**
 * Generate neutral color palette with proper contrast ratios
 */
const generateNeutralPalette = (isDark: boolean = false) => {
  const baseHue = 210; // Medical blue tint
  const baseSaturation = isDark ? 15 : 20; // Slightly desaturated for neutrals

  if (isDark) {
    return {
      // Dark mode - inverted lightness values with manual adjustments
      background: `hsl(${baseHue}, ${baseSaturation}%, 6%)`,
      surface: `hsl(${baseHue}, ${baseSaturation + 3}%, 10%)`,
      surfaceHighlight: `hsl(${baseHue}, ${baseSaturation + 5}%, 14%)`,
      surfaceElevated: `hsl(${baseHue}, ${baseSaturation + 7}%, 18%)`,
      surfaceOverlay: `hsl(${baseHue}, ${baseSaturation + 5}%, 23%)`, // +5% lightness overlay
      border: `hsl(${baseHue}, ${baseSaturation}%, 22%)`,
      borderHighlight: `hsl(${baseHue}, ${baseSaturation + 3}%, 28%)`,
      borderFocus: `hsl(${baseHue}, 60%, 45%)`, // High contrast focus

      // Text colors with proper contrast
      textHighContrast: `hsl(${baseHue}, 20%, 98%)`,
      textPrimary: `hsl(${baseHue}, 15%, 90%)`,
      textSecondary: `hsl(${baseHue}, 12%, 70%)`,
      textMuted: `hsl(${baseHue}, 10%, 50%)`,
      textDisabled: `hsl(${baseHue}, 8%, 35%)`,
      textInverse: `hsl(${baseHue}, 15%, 8%)`, // For light backgrounds in dark mode
    };
  } else {
    return {
      // Light mode - optimized lightness values
      background: `hsl(${baseHue}, ${baseSaturation}%, 98%)`,
      surface: `hsl(${baseHue}, ${baseSaturation + 5}%, 96%)`,
      surfaceHighlight: `hsl(${baseHue}, ${baseSaturation + 10}%, 94%)`,
      surfaceElevated: `hsl(${baseHue}, ${baseSaturation + 15}%, 92%)`,
      surfaceOverlay: `hsl(${baseHue}, ${baseSaturation + 10}%, 87%)`, // +5% lightness overlay
      border: `hsl(${baseHue}, ${baseSaturation}%, 88%)`,
      borderHighlight: `hsl(${baseHue}, ${baseSaturation + 5}%, 82%)`,
      borderFocus: `hsl(${baseHue}, 60%, 55%)`, // High contrast focus

      // Text colors with proper contrast
      textHighContrast: `hsl(${baseHue}, 15%, 8%)`,
      textPrimary: `hsl(${baseHue}, 12%, 16%)`,
      textSecondary: `hsl(${baseHue}, 10%, 40%)`,
      textMuted: `hsl(${baseHue}, 8%, 60%)`,
      textDisabled: `hsl(${baseHue}, 5%, 75%)`,
      textInverse: `hsl(${baseHue}, 20%, 98%)`, // For dark backgrounds in light mode
    };
  }
};

const neutralsLight = generateNeutralPalette(false);
const neutralsDark = generateNeutralPalette(true);

// ============================================================================
// Enhanced Brand Color System
// ============================================================================

/**
 * Generate medical-optimized color scales
 */
const generateMedicalColorScale = (
  hue: number,
  saturation: number,
  baseLightness: number,
): ColorScale => {
  return ColorManipulator.generateScale({
    hue,
    saturation,
    lightness: baseLightness,
  });
};

// Primary Brand Colors - Medical Blue (Hue: 210°, Saturation: 75%)
const primary = generateMedicalColorScale(210, 75, 55);

// Secondary Colors - Medical Teal (Hue: 160°, Saturation: 60%)
const secondary = generateMedicalColorScale(160, 60, 48);

// Accent Colors - Medical Purple for special highlights
const accent = generateMedicalColorScale(280, 70, 60);

// ============================================================================
// Enhanced Semantic Color System - Medical Context
// ============================================================================

/**
 * Medical-context semantic colors with accessibility validation
 */
const semantic = {
  // Success (Medical Green - Hue: 145°)
  success: {
    ...generateMedicalColorScale(145, 70, 45),
    light: 'hsl(145, 75%, 52%)',
    DEFAULT: 'hsl(145, 70%, 45%)',
    dark: 'hsl(145, 80%, 32%)',
    background: 'hsl(145, 85%, 95%)',
    border: 'hsl(145, 75%, 70%)',
  },

  // Warning (Medical Amber - Hue: 45°)
  warning: {
    ...generateMedicalColorScale(45, 85, 55),
    light: 'hsl(45, 90%, 62%)',
    DEFAULT: 'hsl(45, 85%, 55%)',
    dark: 'hsl(45, 75%, 40%)',
    background: 'hsl(45, 95%, 95%)',
    border: 'hsl(45, 80%, 70%)',
  },

  // Error (Medical Red - Hue: 0°)
  error: {
    ...generateMedicalColorScale(0, 75, 55),
    light: 'hsl(0, 80%, 62%)',
    DEFAULT: 'hsl(0, 75%, 55%)',
    dark: 'hsl(0, 85%, 40%)',
    background: 'hsl(0, 90%, 95%)',
    border: 'hsl(0, 75%, 70%)',
  },

  // Info (Light Blue - Hue: 200°)
  info: {
    ...generateMedicalColorScale(200, 85, 60),
    light: 'hsl(200, 90%, 68%)',
    DEFAULT: 'hsl(200, 85%, 60%)',
    dark: 'hsl(200, 75%, 44%)',
    background: 'hsl(200, 95%, 95%)',
    border: 'hsl(200, 80%, 70%)',
  },
};

// ============================================================================
// Medical Context Specific Colors
// ============================================================================

const medicalContext = {
  // Emergency - High visibility red for critical situations
  emergency: {
    primary: 'hsl(0, 85%, 50%)',
    background: 'hsl(0, 90%, 95%)',
    border: 'hsl(0, 75%, 70%)',
    text: 'hsl(0, 85%, 25%)',
  },

  // Safe - Medical green for safety indicators
  safe: {
    primary: 'hsl(145, 70%, 45%)',
    background: 'hsl(145, 85%, 95%)',
    border: 'hsl(145, 75%, 70%)',
    text: 'hsl(145, 80%, 25%)',
  },

  // Prescription - Medical blue for prescription-related elements
  prescription: {
    primary: 'hsl(210, 75%, 55%)',
    background: 'hsl(210, 90%, 95%)',
    border: 'hsl(210, 80%, 70%)',
    text: 'hsl(210, 85%, 25%)',
  },

  // Dosage - Amber for dosage warnings and instructions
  dosage: {
    primary: 'hsl(45, 85%, 55%)',
    background: 'hsl(45, 95%, 95%)',
    border: 'hsl(45, 80%, 70%)',
    text: 'hsl(45, 85%, 25%)',
  },
};

// ============================================================================
// Shadow and Depth System
// ============================================================================

export interface ShadowTokens {
  small: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
    elevation?: number; // Android
  };
  medium: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
    elevation?: number;
  };
  large: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
    elevation?: number;
  };
  overlay: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
    elevation?: number;
  };
}

/**
 * Generate shadow system for depth creation
 */
const generateShadowSystem = (isDark: boolean = false): ShadowTokens => {
  const shadowColor = isDark ? 'hsl(0, 0%, 0%)' : 'hsl(210, 20%, 20%)';

  return {
    small: {
      color: shadowColor,
      offset: { width: 0, height: 1 },
      opacity: isDark ? 0.3 : 0.1,
      radius: 3,
      elevation: 2,
    },
    medium: {
      color: shadowColor,
      offset: { width: 0, height: 4 },
      opacity: isDark ? 0.4 : 0.15,
      radius: 12,
      elevation: 4,
    },
    large: {
      color: shadowColor,
      offset: { width: 0, height: 8 },
      opacity: isDark ? 0.5 : 0.2,
      radius: 24,
      elevation: 8,
    },
    overlay: {
      color: shadowColor,
      offset: { width: 0, height: 16 },
      opacity: isDark ? 0.6 : 0.25,
      radius: 40,
      elevation: 16,
    },
  };
};

const shadowsLight = generateShadowSystem(false);
const shadowsDark = generateShadowSystem(true);

// ============================================================================
// Comprehensive Color System Export
// ============================================================================

export const colors = {
  // Theme-based neutrals
  light: neutralsLight,
  dark: neutralsDark,

  // Brand colors
  primary,
  secondary,
  accent,

  // Semantic colors
  ...semantic,

  // Medical context colors
  medical: medicalContext,

  // Shadow systems
  shadows: {
    light: shadowsLight,
    dark: shadowsDark,
  },

  // Utility colors
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
};

// ============================================================================
// Enhanced Semantic Color Tokens
// ============================================================================

export interface ColorTokens {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
    inverse: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    contrast: string;
    disabled: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  interactive: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primaryDisabled: string;
    secondary: string;
    secondaryHover: string;
    secondaryActive: string;
    accent: string;
    accentHover: string;
  };
  status: {
    success: string;
    successBackground: string;
    successBorder: string;
    warning: string;
    warningBackground: string;
    warningBorder: string;
    error: string;
    errorBackground: string;
    errorBorder: string;
    info: string;
    infoBackground: string;
    infoBorder: string;
  };
  medical: {
    emergency: string;
    emergencyBackground: string;
    safe: string;
    safeBackground: string;
    prescription: string;
    prescriptionBackground: string;
    dosage: string;
    dosageBackground: string;
  };
}

/**
 * Generate theme-specific color tokens
 */
const generateColorTokens = (isDark: boolean = false): ColorTokens => {
  const neutrals = isDark ? neutralsDark : neutralsLight;

  return {
    background: {
      primary: neutrals.background,
      secondary: neutrals.surface,
      tertiary: neutrals.surfaceHighlight,
      elevated: neutrals.surfaceElevated,
      overlay: neutrals.surfaceOverlay,
      inverse: neutrals.textInverse,
    },
    text: {
      primary: neutrals.textPrimary,
      secondary: neutrals.textSecondary,
      muted: neutrals.textMuted,
      contrast: neutrals.textHighContrast,
      disabled: neutrals.textDisabled,
      inverse: neutrals.textInverse,
    },
    border: {
      primary: neutrals.border,
      secondary: neutrals.borderHighlight,
      focus: neutrals.borderFocus,
    },
    interactive: {
      primary: primary[500],
      primaryHover: primary[600],
      primaryActive: primary[700],
      primaryDisabled: primary[300],
      secondary: secondary[500],
      secondaryHover: secondary[600],
      secondaryActive: secondary[700],
      accent: accent[500],
      accentHover: accent[600],
    },
    status: {
      success: semantic.success.DEFAULT,
      successBackground: semantic.success.background,
      successBorder: semantic.success.border,
      warning: semantic.warning.DEFAULT,
      warningBackground: semantic.warning.background,
      warningBorder: semantic.warning.border,
      error: semantic.error.DEFAULT,
      errorBackground: semantic.error.background,
      errorBorder: semantic.error.border,
      info: semantic.info.DEFAULT,
      infoBackground: semantic.info.background,
      infoBorder: semantic.info.border,
    },
    medical: {
      emergency: medicalContext.emergency.primary,
      emergencyBackground: medicalContext.emergency.background,
      safe: medicalContext.safe.primary,
      safeBackground: medicalContext.safe.background,
      prescription: medicalContext.prescription.primary,
      prescriptionBackground: medicalContext.prescription.background,
      dosage: medicalContext.dosage.primary,
      dosageBackground: medicalContext.dosage.background,
    },
  };
};

export const colorTokens = {
  light: generateColorTokens(false),
  dark: generateColorTokens(true),
};

// ============================================================================
// Theme Configuration Interface
// ============================================================================

export interface ThemeConfig {
  name: string;
  colors: ColorTokens;
  shadows: ShadowTokens;
}

export const themes: { light: ThemeConfig; dark: ThemeConfig } = {
  light: {
    name: 'light',
    colors: colorTokens.light,
    shadows: shadowsLight,
  },
  dark: {
    name: 'dark',
    colors: colorTokens.dark,
    shadows: shadowsDark,
  },
};

// ============================================================================
// Theme Management Utilities
// ============================================================================

export class ThemeManager {
  private static currentTheme: 'light' | 'dark' = 'light';
  private static listeners: ((theme: 'light' | 'dark') => void)[] = [];

  /**
   * Get current theme
   */
  static getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  static setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    this.notifyListeners();
  }

  /**
   * Toggle theme
   */
  static toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  /**
   * Get current theme configuration
   */
  static getCurrentThemeConfig(): ThemeConfig {
    return themes[this.currentTheme];
  }

  /**
   * Subscribe to theme changes
   */
  static subscribe(listener: (theme: 'light' | 'dark') => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of theme change
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }

  /**
   * Get color token for current theme
   */
  static getColor(tokenPath: string): string {
    const config = this.getCurrentThemeConfig();
    const pathParts = tokenPath.split('.');

    let value: any = config.colors;
    for (const part of pathParts) {
      value = value?.[part];
    }

    return value || '#000000'; // Fallback color
  }

  /**
   * Get shadow token for current theme
   */
  static getShadow(
    shadowType: keyof ShadowTokens,
  ): ShadowTokens[keyof ShadowTokens] {
    const config = this.getCurrentThemeConfig();
    return config.shadows[shadowType];
  }

  /**
   * Validate color contrast for current theme
   */
  static validateContrast(
    foregroundToken: string,
    backgroundToken: string,
  ): {
    ratio: number;
    wcagAA: boolean;
    wcagAAA: boolean;
  } {
    const foreground = this.getColor(foregroundToken);
    const background = this.getColor(backgroundToken);
    return AccessibilityChecker.validateContrast(foreground, background);
  }
}

// ============================================================================
// React Native StyleSheet Integration Utilities
// ============================================================================

export interface ThemedStyleSheet {
  [key: string]: any;
}

/**
 * Create themed styles that automatically update with theme changes
 */
export const createThemedStyles = (
  styleFactory: (theme: ThemeConfig) => ThemedStyleSheet,
) => {
  return (theme?: ThemeConfig) => {
    const currentTheme = theme || ThemeManager.getCurrentThemeConfig();
    return styleFactory(currentTheme);
  };
};

/**
 * Helper function to create depth styles
 */
export const createDepthStyle = (
  depthLevel: keyof ShadowTokens,
  backgroundColor?: string,
  theme?: ThemeConfig,
) => {
  const currentTheme = theme || ThemeManager.getCurrentThemeConfig();
  const shadow = currentTheme.shadows[depthLevel];

  return {
    backgroundColor:
      backgroundColor || currentTheme.colors.background.secondary,
    shadowColor: shadow.color,
    shadowOffset: shadow.offset,
    shadowOpacity: shadow.opacity,
    shadowRadius: shadow.radius,
    elevation: shadow.elevation, // Android
  };
};

/**
 * Helper function to create interactive button styles
 */
export const createInteractiveStyle = (
  variant: 'primary' | 'secondary' | 'accent' = 'primary',
  state: 'default' | 'hover' | 'active' | 'disabled' = 'default',
  theme?: ThemeConfig,
) => {
  const currentTheme = theme || ThemeManager.getCurrentThemeConfig();
  const { interactive, text } = currentTheme.colors;

  const getBackgroundColor = () => {
    if (state === 'disabled') return interactive.primaryDisabled;

    switch (variant) {
      case 'primary':
        return state === 'hover'
          ? interactive.primaryHover
          : state === 'active'
          ? interactive.primaryActive
          : interactive.primary;
      case 'secondary':
        return state === 'hover'
          ? interactive.secondaryHover
          : state === 'active'
          ? interactive.secondaryActive
          : interactive.secondary;
      case 'accent':
        return state === 'hover' ? interactive.accentHover : interactive.accent;
      default:
        return interactive.primary;
    }
  };

  const depthStyle = createDepthStyle(
    state === 'hover' ? 'medium' : 'small',
    undefined,
    theme,
  );

  return {
    ...depthStyle,
    backgroundColor: getBackgroundColor(),
    color: text.inverse,
    opacity: state === 'disabled' ? 0.6 : 1,
  };
};

export default colors;
