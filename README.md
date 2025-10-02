# MedCo Design System

A comprehensive design system for React Native applications built with TypeScript, featuring a sophisticated color system based on HSL color theory and reusable components.

## 🎨 Design Philosophy

This design system is built on modern color theory principles:

- **HSL-based Color System**: Uses Hue, Saturation, and Lightness for intuitive color palette creation
- **Semantic Color Naming**: Colors are named by their purpose, not their appearance
- **Theme-Aware Components**: All components automatically adapt to light/dark themes
- **Consistent Spacing**: 8pt grid system for predictable layouts
- **Typography Scale**: Harmonious text sizing with proper line heights

## 📁 Project Structure

```
src/
├── styles/
│   ├── colors.ts          # HSL-based color system
│   ├── globalStyles.ts    # Global styles and design tokens
│   └── theme.ts           # Theme management and variants
├── components/
│   ├── Button/            # Reusable button component
│   ├── Card/              # Surface component with variants
│   ├── Input/             # Form input with validation states
│   ├── Typography/        # Text components with semantic variants
│   ├── Layout/            # Layout primitives (Row, Column, etc.)
│   └── index.ts           # Component exports
├── contexts/
│   └── ThemeContext.tsx   # Theme provider and hooks
└── screens/
    └── example/
        └── ComponentShowcase.tsx  # Demo of all components
```

## 🚀 Quick Start

### 1. Install Dependencies

The design system uses these React Native libraries:

```bash
npm install react-native-safe-area-context
```

### 2. Setup Theme Provider

Wrap your app with the ThemeProvider:

```tsx
import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AppRoutings } from './src/screens';

function App() {
  return (
    <ThemeProvider>
      <AppRoutings />
    </ThemeProvider>
  );
}
```

### 3. Use Components

Import and use components throughout your app:

```tsx
import { Button, Card, Input, Typography } from '../components';

const MyScreen = () => (
  <Card>
    <Typography variant="h2">Welcome</Typography>
    <Input label="Email" placeholder="Enter your email" />
    <Button title="Submit" onPress={() => {}} />
  </Card>
);
```

## 🎨 Color System

### Color Theory Implementation

Our color system is based on HSL (Hue, Saturation, Lightness) for intuitive palette creation:

```typescript
// Primary brand colors with consistent saturation
const primary = {
  500: `hsl(220, 85%, 50%)`, // Base primary
  600: `hsl(220, 85%, 40%)`, // Hover state
  700: `hsl(220, 85%, 30%)`, // Active state
};

// Neutral colors with zero saturation
const neutrals = {
  background: `hsl(220, 5%, 0%)`, // Dark mode
  surface: `hsl(220, 5%, 5%)`, // Surface elements
  textPrimary: `hsl(220, 5%, 90%)`, // Primary text
};
```

### Theme Support

Automatic light/dark mode support:

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

## 🧩 Components

### Button

Versatile button component with multiple variants and sizes:

```tsx
<Button title="Primary" variant="primary" size="md" />
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" />
<Button title="Loading..." loading />
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`, `loading`, `fullWidth`

### Card

Surface component for grouping content:

```tsx
<Card variant="elevated" padding="lg">
  <Typography variant="h3">Card Title</Typography>
  <Typography>Card content goes here</Typography>
</Card>
```

**Props:**

- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: Design token spacing key

### Input

Form input with validation states:

```tsx
<Input
  label="Email"
  placeholder="Enter email"
  state="error"
  errorText="Invalid email format"
/>
```

**Props:**

- `variant`: 'default' | 'filled' | 'outlined'
- `state`: 'default' | 'error' | 'success' | 'disabled'
- `label`, `helperText`, `errorText`

### Typography

Semantic text components:

```tsx
<Heading1>Main Title</Heading1>
<Heading2>Section Title</Heading2>
<BodyText color="secondary">Regular text</BodyText>
<Caption color="muted">Small text</Caption>
```

**Variants:**

- `h1`, `h2`, `h3`, `h4` - Headings
- `bodyLarge`, `body`, `bodySmall` - Body text
- `caption` - Small text

**Colors:**

- `primary`, `secondary`, `muted`, `contrast`
- `success`, `warning`, `error`

### Layout Components

Flexible layout primitives:

```tsx
<Screen scrollable padded>
  <Container>
    <Row justify="space-between" gap="md">
      <Column align="center" gap="sm">
        <Card>Content</Card>
      </Column>
    </Row>
    <Spacer size="lg" />
    <Divider />
  </Container>
</Screen>
```

## 📐 Design Tokens

### Spacing (8pt Grid)

```typescript
const spacing = {
  xs: 4, // 0.25rem
  sm: 8, // 0.5rem
  md: 16, // 1rem
  lg: 24, // 1.5rem
  xl: 32, // 2rem
  xxl: 48, // 3rem
  xxxl: 64, // 4rem
};
```

### Typography Scale

```typescript
const typography = {
  fontSize: {
    xs: 12, // Caption
    sm: 14, // Small body
    base: 16, // Body
    lg: 18, // Large body
    xl: 20, // H4
    '2xl': 24, // H3
    '3xl': 30, // H2
    '4xl': 36, // H1
  },
};
```

### Border Radius

```typescript
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
```

## 🎯 Usage Examples

### Creating a Login Form

```tsx
import { Screen, Card, Input, Button, Heading2, Spacer } from '../components';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen padded centered>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Heading2 style={{ textAlign: 'center', marginBottom: 24 }}>
          Welcome Back
        </Heading2>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Spacer size="lg" />

        <Button title="Sign In" onPress={handleLogin} fullWidth />

        <Spacer size="md" />

        <Button
          title="Create Account"
          variant="outline"
          onPress={handleSignUp}
          fullWidth
        />
      </Card>
    </Screen>
  );
};
```

### Theme-Aware Styling

```tsx
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../styles/theme';

const MyComponent = () => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.body}>Theme-aware text</Text>
    </View>
  );
};
```

## 🔧 Customization

### Extending Colors

Add custom colors to the color system:

```typescript
// In colors.ts
export const customColors = {
  brand: {
    purple: 'hsl(270, 85%, 50%)',
    orange: 'hsl(30, 85%, 50%)',
  },
};
```

### Creating Custom Components

Follow the established patterns:

```tsx
interface CustomComponentProps {
  variant?: 'default' | 'special';
  size?: 'sm' | 'md' | 'lg';
  // ... other props
}

export const CustomComponent: React.FC<CustomComponentProps> = ({
  variant = 'default',
  size = 'md',
  // ...
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    base: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing[size],
      // ...
    },
  });

  return <View style={styles.base}>{/* content */}</View>;
};
```

## 📱 Navigation Integration

The design system works seamlessly with React Navigation:

```tsx
// In your navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
      }}
    >
      {/* Your screens */}
    </Stack.Navigator>
  );
};
```

## 🎨 Color Accessibility

All colors meet WCAG accessibility guidelines:

- **Text Contrast**: Minimum 4.5:1 ratio for normal text
- **Interactive Elements**: Clear focus and hover states
- **Semantic Colors**: Consistent meaning across the app

## 🚀 Performance

- **Tree Shaking**: Import only what you need
- **Optimized Styles**: StyleSheet.create for performance
- **Minimal Re-renders**: Efficient theme context usage

## 📚 Best Practices

1. **Use Semantic Colors**: Prefer `theme.colors.textPrimary` over hardcoded colors
2. **Consistent Spacing**: Use the spacing scale for margins and padding
3. **Component Composition**: Build complex UIs from simple components
4. **Theme Awareness**: Always consider both light and dark modes
5. **Accessibility**: Test with screen readers and high contrast modes

## 🔄 Migration Guide

### From Hardcoded Styles

```tsx
// Before
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  text: {
    color: '#000000',
    fontSize: 16,
  },
});

// After
const MyComponent = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    text: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.fontSize.base,
    },
  });
};
```

## 🤝 Contributing

When adding new components:

1. Follow the established naming conventions
2. Support both light and dark themes
3. Include TypeScript types
4. Add to the component showcase
5. Update this README

## 📄 License

This design system is part of the MedCo project and follows the same licensing terms.
