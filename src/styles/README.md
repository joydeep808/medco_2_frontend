# MedCo Design System - Quick Setup Guide

## 🚀 What's Been Created

Your React Native app now has a complete design system with:

### 📁 File Structure

```
src/
├── styles/
│   ├── colors.ts          # HSL-based color system (light/dark themes)
│   ├── globalStyles.ts    # Design tokens & global styles
│   └── theme.ts           # Theme management
├── components/
│   ├── Button/            # Reusable button with variants
│   ├── Card/              # Surface component
│   ├── Input/             # Form input with validation
│   ├── Typography/        # Text components
│   ├── Layout/            # Layout primitives
│   └── index.ts           # All exports
├── contexts/
│   └── ThemeContext.tsx   # Theme provider & hooks
└── screens/
    ├── splash/SplashScreen.tsx     # Loading screen
    ├── auth/LoginScreen.tsx        # Login with validation
    ├── customer/HomeScreen.tsx     # Main dashboard
    └── example/ComponentShowcase.tsx # Design system demo
```

## 🎨 Color System Features

### HSL-Based Colors

- **Intuitive**: Hue (0-360), Saturation (0-100%), Lightness (0-100%)
- **Consistent**: Same saturation across color variants
- **Theme-Aware**: Automatic light/dark mode support

### Color Palette

```typescript
// Primary brand colors
primary: {
  500: 'hsl(220, 85%, 50%)', // Base
  600: 'hsl(220, 85%, 40%)', // Hover
  700: 'hsl(220, 85%, 30%)', // Active
}

// Neutral colors (zero saturation)
neutrals: {
  background: 'hsl(220, 5%, 0%)',    // Dark mode
  surface: 'hsl(220, 5%, 5%)',       // Cards
  textPrimary: 'hsl(220, 5%, 90%)',  // Main text
}

// Semantic colors
success: 'hsl(142, 71%, 45%)',
warning: 'hsl(38, 92%, 50%)',
error: 'hsl(0, 72%, 51%)',
```

## 🧩 Component Usage

### Basic Components

```tsx
import { Button, Card, Input, Typography } from '../components';

// Buttons with variants
<Button title="Primary" variant="primary" />
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" />

// Cards with elevation
<Card variant="elevated">
  <Typography variant="h3">Card Title</Typography>
</Card>

// Form inputs with validation
<Input
  label="Email"
  placeholder="Enter email"
  state="error"
  errorText="Invalid email"
/>
```

### Layout Components

```tsx
import { Screen, Container, Row, Column, Spacer } from '../components';

<Screen scrollable padded>
  <Container>
    <Row justify="space-between" gap="md">
      <Column align="center">
        <Card>Content</Card>
      </Column>
    </Row>
    <Spacer size="lg" />
  </Container>
</Screen>;
```

## 🎯 Theme Integration

### Using Theme Context

```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, themeMode } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary }}>
        Current theme: {themeMode}
      </Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};
```

### Theme-Aware Styling

```tsx
import { createThemedStyles } from '../styles/theme';

const MyComponent = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
  });
};
```

## 📱 Navigation Integration

Your routing structure (`src/screens/index.tsx`) now includes:

- **SplashScreen**: Loading screen with branding
- **LoginScreen**: Form with validation using design system
- **HomeScreen**: Dashboard with quick actions
- **ComponentShowcase**: Demo of all components

### Navigation Flow

```
SplashScreen → LoginScreen → HomeScreen
                    ↓
              ComponentShowcase (demo)
```

## 🔧 Customization

### Adding Custom Colors

```typescript
// In colors.ts
export const customColors = {
  brand: {
    purple: 'hsl(270, 85%, 50%)',
    orange: 'hsl(30, 85%, 50%)',
  },
};
```

### Creating New Components

```tsx
interface MyComponentProps {
  variant?: 'default' | 'special';
  size?: 'sm' | 'md' | 'lg';
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'default',
  size = 'md',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.spacing[size],
      }}
    >
      {/* Your content */}
    </View>
  );
};
```

## 🚀 Next Steps

1. **Run the app**: Your navigation should work with the new screens
2. **Check ComponentShowcase**: Navigate to see all components in action
3. **Test themes**: Use the toggle button to switch light/dark modes
4. **Customize colors**: Adjust the HSL values in `colors.ts`
5. **Add screens**: Follow the established patterns for new screens

## 📋 Design Tokens

### Spacing (8pt Grid)

- `xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`

### Typography Scale

- `xs: 12px`, `sm: 14px`, `base: 16px`, `lg: 18px`, `xl: 20px`

### Border Radius

- `sm: 4px`, `md: 8px`, `lg: 12px`, `xl: 16px`

## 🎨 Color Theory Applied

This system implements the color theory you described:

1. **HSL Format**: More intuitive than hex/RGB for palette creation
2. **Neutral Palette**: Zero saturation for backgrounds and text
3. **Consistent Saturation**: Same saturation across color variants
4. **Light/Dark Modes**: Lightness values inverted for themes
5. **Semantic Naming**: Colors named by purpose, not appearance

## 🔍 Testing

Navigate to the ComponentShowcase screen to see:

- All component variants
- Theme switching in action
- Form validation examples
- Layout patterns
- Color system demonstration

Your design system is now ready to use throughout your MedCo app! 🎉
