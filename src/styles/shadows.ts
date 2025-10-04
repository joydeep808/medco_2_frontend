/**
 * Comprehensive Shadow and Depth System
 * Creates visual hierarchy through layered shadows and color overlays
 * Optimized for React Native with cross-platform support
 */

import { ViewStyle } from 'react-native';
import { ThemeManager } from './colors';

// ============================================================================
// Shadow Utility Classes
// ============================================================================

export interface DepthStyle extends ViewStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export class ShadowSystem {
  /**
   * Create depth-1 shadow (small natural shadow)
   * Used for: Small cards, buttons, form elements
   */
  static depth1(backgroundColor?: string): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();
    const shadow = theme.shadows.small;

    return {
      backgroundColor: backgroundColor || theme.colors.background.secondary,
      shadowColor: shadow.color,
      shadowOffset: shadow.offset,
      shadowOpacity: shadow.opacity,
      shadowRadius: shadow.radius,
      elevation: shadow.elevation || 2,
    };
  }

  /**
   * Create depth-2 shadow (medium depth for cards)
   * Used for: Cards, modals, dropdowns
   */
  static depth2(backgroundColor?: string): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();
    const shadow = theme.shadows.medium;

    return {
      backgroundColor: backgroundColor || theme.colors.background.elevated,
      shadowColor: shadow.color,
      shadowOffset: shadow.offset,
      shadowOpacity: shadow.opacity,
      shadowRadius: shadow.radius,
      elevation: shadow.elevation || 4,
    };
  }

  /**
   * Create depth-3 shadow (high depth for modals/overlays)
   * Used for: Modals, overlays, floating elements
   */
  static depth3(backgroundColor?: string): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();
    const shadow = theme.shadows.large;

    return {
      backgroundColor: backgroundColor || theme.colors.background.elevated,
      shadowColor: shadow.color,
      shadowOffset: shadow.offset,
      shadowOpacity: shadow.opacity,
      shadowRadius: shadow.radius,
      elevation: shadow.elevation || 8,
    };
  }

  /**
   * Create overlay shadow (maximum depth)
   * Used for: Full-screen overlays, important modals
   */
  static overlay(backgroundColor?: string): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();
    const shadow = theme.shadows.overlay;

    return {
      backgroundColor: backgroundColor || theme.colors.background.elevated,
      shadowColor: shadow.color,
      shadowOffset: shadow.offset,
      shadowOpacity: shadow.opacity,
      shadowRadius: shadow.radius,
      elevation: shadow.elevation || 16,
    };
  }

  /**
   * Create hover shadow (enhanced depth for interactions)
   * Used for: Hover states, pressed states
   */
  static hover(
    baseDepth: 'depth1' | 'depth2' | 'depth3' = 'depth1',
    backgroundColor?: string,
  ): DepthStyle {
    const baseStyle = this[baseDepth](backgroundColor);

    return {
      ...baseStyle,
      shadowOpacity: baseStyle.shadowOpacity * 1.5,
      shadowRadius: baseStyle.shadowRadius * 1.2,
      elevation: (baseStyle.elevation || 2) * 1.5,
    };
  }

  /**
   * Create inset shadow effect (for pressed/active states)
   * Used for: Active buttons, selected items
   */
  static inset(backgroundColor?: string): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    return {
      backgroundColor: backgroundColor || theme.colors.background.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
      // Note: React Native doesn't support inset shadows natively
      // This creates a visual effect through reduced shadow
      opacity: 0.9,
    };
  }
}

// ============================================================================
// Color Overlay System for Depth
// ============================================================================

export class ColorOverlaySystem {
  /**
   * Create light overlay (+5% lightness) for subtle elevation
   */
  static lightOverlay(baseColor?: string): string {
    const theme = ThemeManager.getCurrentThemeConfig();
    return baseColor || theme.colors.background.overlay;
  }

  /**
   * Create highlight overlay (+10% lightness) for selected states
   */
  static highlightOverlay(baseColor?: string): string {
    const theme = ThemeManager.getCurrentThemeConfig();
    return baseColor || theme.colors.background.tertiary;
  }

  /**
   * Create surface elevation effect
   */
  static elevatedSurface(level: 1 | 2 | 3 = 1): ViewStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    const backgroundColors = {
      1: theme.colors.background.secondary,
      2: theme.colors.background.tertiary,
      3: theme.colors.background.elevated,
    };

    const shadows = {
      1: ShadowSystem.depth1(),
      2: ShadowSystem.depth2(),
      3: ShadowSystem.depth3(),
    };

    return {
      backgroundColor: backgroundColors[level],
      ...shadows[level],
    };
  }
}

// ============================================================================
// Interactive Element Shadows
// ============================================================================

export class InteractiveShadows {
  /**
   * Button shadow system with states
   */
  static button(
    variant: 'primary' | 'secondary' | 'accent' = 'primary',
    state: 'default' | 'hover' | 'active' | 'disabled' = 'default',
  ): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    const getBackgroundColor = () => {
      switch (variant) {
        case 'primary':
          return state === 'disabled'
            ? theme.colors.interactive.primaryDisabled
            : state === 'hover'
            ? theme.colors.interactive.primaryHover
            : state === 'active'
            ? theme.colors.interactive.primaryActive
            : theme.colors.interactive.primary;
        case 'secondary':
          return state === 'hover'
            ? theme.colors.interactive.secondaryHover
            : state === 'active'
            ? theme.colors.interactive.secondaryActive
            : theme.colors.interactive.secondary;
        case 'accent':
          return state === 'hover'
            ? theme.colors.interactive.accentHover
            : theme.colors.interactive.accent;
        default:
          return theme.colors.interactive.primary;
      }
    };

    const getShadowStyle = () => {
      if (state === 'disabled') return ShadowSystem.depth1();
      if (state === 'hover') return ShadowSystem.hover('depth2');
      if (state === 'active') return ShadowSystem.inset();
      return ShadowSystem.depth1();
    };

    return {
      backgroundColor: getBackgroundColor(),
      ...getShadowStyle(),
    };
  }

  /**
   * Card shadow system with interaction states
   */
  static card(
    state: 'default' | 'hover' | 'selected' = 'default',
    level: 1 | 2 | 3 = 2,
  ): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    const baseStyle =
      level === 1
        ? ShadowSystem.depth1()
        : level === 2
        ? ShadowSystem.depth2()
        : ShadowSystem.depth3();

    if (state === 'hover') {
      return {
        ...ShadowSystem.hover(`depth${level}` as any),
        backgroundColor: theme.colors.background.tertiary,
      };
    }

    if (state === 'selected') {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.background.elevated,
        borderWidth: 2,
        borderColor: theme.colors.interactive.primary,
      };
    }

    return baseStyle;
  }

  /**
   * Navigation element shadows
   */
  static navigation(
    state: 'inactive' | 'active' | 'hover' = 'inactive',
  ): ViewStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    if (state === 'active') {
      return {
        backgroundColor: theme.colors.interactive.primary,
        ...ShadowSystem.depth2(),
      };
    }

    if (state === 'hover') {
      return {
        backgroundColor: theme.colors.background.tertiary,
        ...ShadowSystem.depth1(),
      };
    }

    return {
      backgroundColor: theme.colors.background.secondary,
    };
  }
}

// ============================================================================
// Medical Context Shadows
// ============================================================================

export class MedicalShadows {
  /**
   * Emergency element shadow (high visibility)
   */
  static emergency(): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    return {
      backgroundColor: theme.colors.medical.emergencyBackground,
      borderWidth: 2,
      borderColor: theme.colors.medical.emergency,
      ...ShadowSystem.depth3(),
    };
  }

  /**
   * Safe element shadow (reassuring depth)
   */
  static safe(): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    return {
      backgroundColor: theme.colors.medical.safeBackground,
      borderWidth: 1,
      borderColor: theme.colors.medical.safe,
      ...ShadowSystem.depth2(),
    };
  }

  /**
   * Prescription element shadow (professional appearance)
   */
  static prescription(): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    return {
      backgroundColor: theme.colors.medical.prescriptionBackground,
      borderWidth: 1,
      borderColor: theme.colors.medical.prescription,
      ...ShadowSystem.depth2(),
    };
  }

  /**
   * Dosage warning shadow (attention-grabbing)
   */
  static dosageWarning(): DepthStyle {
    const theme = ThemeManager.getCurrentThemeConfig();

    return {
      backgroundColor: theme.colors.medical.dosageBackground,
      borderWidth: 2,
      borderColor: theme.colors.medical.dosage,
      ...ShadowSystem.depth2(),
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create custom shadow with specific parameters
 */
export const createCustomShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number = 4,
): DepthStyle => ({
  shadowColor: color,
  shadowOffset: offset,
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

/**
 * Combine multiple shadow effects (for complex depth)
 */
export const combineShadows = (
  ...shadows: Partial<DepthStyle>[]
): DepthStyle => {
  const combined = shadows.reduce(
    (acc, shadow) => ({
      ...acc,
      ...shadow,
    }),
    {} as any,
  );

  return {
    shadowColor: combined.shadowColor || '#000',
    shadowOffset: combined.shadowOffset || { width: 0, height: 2 },
    shadowOpacity: combined.shadowOpacity || 0.25,
    shadowRadius: combined.shadowRadius || 3.84,
    elevation: combined.elevation || 5,
    ...combined,
  };
};

/**
 * Create responsive shadow based on screen size
 */
export const responsiveShadow = (
  screenWidth: number,
  smallShadow: DepthStyle,
  largeShadow: DepthStyle,
): DepthStyle => {
  return screenWidth < 768 ? smallShadow : largeShadow;
};
