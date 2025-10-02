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
