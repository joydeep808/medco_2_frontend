/**
 * Component exports
 * Central export file for all reusable components
 */

// Button components
export { Button } from './Button/Button';
export type { ButtonVariant, ButtonSize } from './Button/Button';

// Card components
export { Card } from './Card/Card';
export type { CardVariant } from './Card/Card';

// Input components
export { Input } from './Input/Input';
export type { InputVariant, InputState } from './Input/Input';

// Typography components
export {
  Typography,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  BodyText,
  Caption,
} from './Typography/Typography';
export type {
  TypographyVariant,
  TypographyColor,
} from './Typography/Typography';

// Layout components
export {
  Container,
  Screen,
  Row,
  Column,
  Spacer,
  Divider,
} from './Layout/Layout';

// Toast components
export { Toast } from './Toast/Toast';
export {
  ToastManager,
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from './Toast/ToastManager';
export type { ToastType, ToastProps } from './Toast/Toast';

// Pharmacy components
export { default as ProductCard } from './Pharmacy/ProductCard';
export { default as OfferCard } from './Pharmacy/OfferCard';
export { default as PharmacyLoadingSkeleton } from './Pharmacy/PharmacyLoadingSkeleton';
export { default as PharmacyHeader } from './Pharmacy/PharmacyHeader';

// Cart components
export { default as FloatingCartButton } from './Cart/FloatingCartButton';

// Home components
export { default as NearbyPharmacies } from './Home/NearbyPharmacies';

// Re-export styles for easy access
export { colors } from '../styles/colors';
export {
  globalStyles,
  spacing,
  typography,
  borderRadius,
  shadows,
  designTokens,
} from '../styles/globalStyles';
export {
  lightTheme,
  darkTheme,
  createThemedStyles,
  defaultTheme,
} from '../styles/theme';
export type { Theme, ThemeMode } from '../styles/theme';
