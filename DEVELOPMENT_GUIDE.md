# MedCo Development Guide

## 🏗️ Project Architecture Overview

This guide outlines the established patterns and utilities in the MedCo project that should be used consistently across all development.

## 📁 Project Structure & Patterns

### Core Utilities & Services

```
src/
├── utils/
│   ├── NavigationUtils.tsx    # Custom navigation functions
│   ├── AxiosUtil.ts          # API request handlers
│   └── JwtDecoder.ts         # JWT token utilities
├── store/
│   ├── AuthStore.ts          # Zustand auth state management
│   └── TokenStore.ts         # MMKV token persistence
├── services/
│   └── AuthService.ts        # Business logic services
├── config/
│   └── _axios/
│       ├── AxiosConfig.ts    # Axios instance configuration
│       └── AxiosInterceptor.ts # Request/response interceptors
└── interfaces/
    ├── StackParams.ts        # Navigation type definitions
    └── response/
        └── common.ts         # API response interfaces
```

## 🧭 Navigation Patterns

### Use Custom Navigation Functions

**❌ DON'T USE:**

```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('HomeScreen');
navigation.replace('LoginScreen');
```

**✅ DO USE:**

```tsx
import {
  navigate,
  replace,
  resetAndNavigate,
  goBack,
  push,
} from '@utils/NavigationUtils';

// Navigate to a screen
navigate('HomeScreen');
navigate('StoreScreen', { storeId: 123 });

// Replace current screen
replace('LoginScreen');

// Reset navigation stack
resetAndNavigate('HomeScreen');

// Go back
goBack();

// Push to stack
push('OrderDetailedScreen', { orderId: 'abc123' });
```

### Available Navigation Functions

```tsx
// Basic navigation
navigate(routeName: string, params?: object)
replace(routeName: string, params?: object)
resetAndNavigate(routeName: string)
goBack()
push(routeName: string, params?: object)
prepareNavigation()
```

## 🌐 API & HTTP Patterns

### Use Structured API Calls

**❌ DON'T USE:**

```tsx
import axios from 'axios';

const response = await axios.get('/api/users');
```

**✅ DO USE:**

```tsx
import {
  getRequest,
  postRequest,
  putRequest,
  AxiosErrorHandler,
} from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';

// GET request
const response: ApiResponse<UserData> = await getRequest<UserData>(
  '/users/profile',
);

// POST request
const loginResponse: ApiResponse<LoginData> = await postRequest<
  LoginData,
  LoginRequest
>('/auth/login', { email, password });

// PUT request
const updateResponse: ApiResponse<UserData> = await putRequest<
  UserData,
  UpdateUserRequest
>('/users/profile', userData);

// Handle response
if (response.success) {
  console.log('Data:', response.data);
} else {
  console.error('Error:', response.message);
}
```

### API Response Structure

All API responses follow this structure:

```tsx
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  requestId: string;
  version: string;
}
```

## 🏪 State Management Patterns

### Authentication State (Zustand)

**✅ USE AUTH STORE:**

```tsx
import {
  useAuthStore,
  setToken,
  removeToken,
  isUserLoggedIn,
} from '@store/AuthStore';

// In components
const MyComponent = () => {
  const { user, isUserLoggedIn, token } = useAuthStore();

  // Use the state
  if (isUserLoggedIn) {
    return <AuthenticatedView user={user} />;
  }

  return <LoginView />;
};

// For actions (outside components)
const handleLogin = async (email: string, password: string) => {
  const response = await postRequest<LoginResponse, LoginRequest>(
    '/auth/login',
    {
      email,
      password,
    },
  );

  if (response.success) {
    setToken(response.data.accessToken); // Automatically sets user info
    navigate('HomeScreen');
  }
};

const handleLogout = () => {
  removeToken(); // Clears all auth state
  resetAndNavigate('LoginScreen');
};
```

### Token Management (MMKV)

**✅ USE TOKEN STORE:**

```tsx
import tokenStore from '@store/TokenStore';

// Store tokens
tokenStore.setToken('access_token', accessToken);
tokenStore.setToken('refresh_token', refreshToken);

// Retrieve tokens
const accessToken = tokenStore.getAccessToken();
const refreshToken = tokenStore.getRefreshToken();
const customValue = tokenStore.getKey('custom_key');
```

## 🎨 Component & Styling Patterns

### Use Design System Components

**✅ IMPORT FROM COMPONENTS INDEX:**

```tsx
import {
  Screen,
  Container,
  Card,
  Button,
  Input,
  Typography,
  Heading1,
  Row,
  Column,
  Spacer,
  colors,
  spacing,
} from '@components';

// Use theme context
import { useTheme } from '@contexts/ThemeContext';

const MyScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Screen scrollable padded>
      <Container>
        <Card>
          <Heading1>Welcome</Heading1>
          <Input label="Email" placeholder="Enter email" />
          <Button title="Submit" onPress={handleSubmit} />
        </Card>
      </Container>
    </Screen>
  );
};
```

### Absolute Import Aliases

Use these aliases consistently:

```tsx
import {} from '@components'; // src/components
import {} from '@screens'; // src/screens
import {} from '@utils/*'; // src/utils/*
import {} from '@store/*'; // src/store/*
import {} from '@services/*'; // src/services/*
import {} from '@interfaces/*'; // src/interfaces/*
import {} from '@contexts/*'; // src/contexts/*
import {} from '@styles/*'; // src/styles/*
import {} from '@config/*'; // src/config/*
import {} from '@api/*'; // src/api/*
```

## 🔐 Authentication Flow Pattern

### Complete Login Implementation

```tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Screen, Container, Card, Input, Button, Column } from '@components';
import { postRequest } from '@utils/AxiosUtil';
import { setToken } from '@store/AuthStore';
import { navigate } from '@utils/NavigationUtils';
import { ApiResponse } from '@interfaces/response/common';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response: ApiResponse<LoginResponse> = await postRequest<
        LoginResponse,
        LoginRequest
      >('/auth/login', { email, password });

      if (response.success) {
        // Store token and set auth state
        setToken(response.data.accessToken);

        // Navigate to home
        navigate('HomeScreen');
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen padded centered>
      <Container>
        <Card>
          <Column gap="md">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
            />
          </Column>
        </Card>
      </Container>
    </Screen>
  );
};
```

## 📱 Screen Development Template

### Standard Screen Structure

```tsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Screen,
  Container,
  Card,
  Button,
  Input,
  Heading1,
  BodyText,
  Column,
  Row,
} from '@components';
import { useTheme } from '@contexts/ThemeContext';
import { useAuthStore } from '@store/AuthStore';
import { navigate, goBack } from '@utils/NavigationUtils';
import { getRequest, postRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';

// Define interfaces for this screen
interface ScreenData {
  // Define your data structure
}

interface ScreenRequest {
  // Define request structure
}

export const MyScreen: React.FC = () => {
  // Theme and auth
  const { theme } = useTheme();
  const { user, isUserLoggedIn } = useAuthStore();

  // Local state
  const [data, setData] = useState<ScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    loadData();
  }, []);

  // API calls
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<ScreenData> = await getRequest<ScreenData>(
        '/api/endpoint',
      );
      if (response.success) {
        setData(response.data);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleAction = async () => {
    // Implementation
  };

  // Render
  return (
    <Screen scrollable padded>
      <Container>
        <Card>
          <Column gap="md">
            <Heading1>Screen Title</Heading1>
            {/* Your content */}
          </Column>
        </Card>
      </Container>
    </Screen>
  );
};

export default MyScreen;
```

## 🔧 Service Layer Pattern

### Create Services for Business Logic

```tsx
// src/services/UserService.ts
import { getRequest, postRequest, putRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
}

export class UserService {
  static async getProfile(): Promise<ApiResponse<User>> {
    return getRequest<User>('/users/profile');
  }

  static async updateProfile(
    data: UpdateUserRequest,
  ): Promise<ApiResponse<User>> {
    return putRequest<User, UpdateUserRequest>('/users/profile', data);
  }

  static async deleteAccount(): Promise<ApiResponse<void>> {
    return postRequest<void, {}>('/users/delete', {});
  }
}
```

## 🚨 Error Handling Patterns

### Consistent Error Handling

```tsx
import { AxiosErrorHandler } from '@utils/AxiosUtil';

const handleApiCall = async () => {
  try {
    const response = await getRequest<DataType>('/api/endpoint');

    if (response.success) {
      // Handle success
      setData(response.data);
    } else {
      // Handle API error
      Alert.alert('Error', response.message);
    }
  } catch (error) {
    // Handle unexpected errors
    const errorResponse = AxiosErrorHandler(error);
    Alert.alert('Error', errorResponse.message);
  }
};
```

## 📋 Development Checklist

### Before Creating New Screens/Components:

- [ ] Use `@utils/NavigationUtils` for navigation
- [ ] Use `@utils/AxiosUtil` for API calls
- [ ] Use `@store/AuthStore` for authentication state
- [ ] Use `@store/TokenStore` for token persistence
- [ ] Import components from `@components`
- [ ] Use `@contexts/ThemeContext` for theming
- [ ] Follow the established file structure
- [ ] Define proper TypeScript interfaces
- [ ] Handle loading and error states
- [ ] Use absolute imports with aliases

### Code Review Checklist:

- [ ] No direct axios usage (use AxiosUtil)
- [ ] No direct navigation hooks (use NavigationUtils)
- [ ] Proper error handling with user feedback
- [ ] Loading states for async operations
- [ ] TypeScript interfaces defined
- [ ] Consistent styling with design system
- [ ] Proper state management patterns

## 🎯 Next Steps

1. **Update existing screens** to use these patterns
2. **Create services** for each feature area
3. **Implement proper error boundaries**
4. **Add loading states** to all async operations
5. **Create reusable hooks** for common operations

This guide ensures consistency across the MedCo codebase and leverages all the excellent utilities you've already built!
