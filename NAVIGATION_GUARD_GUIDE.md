# MedCo Navigation Guard System

## 🛡️ Overview

The MedCo app implements a comprehensive role-based navigation guard system that ensures users can only access routes appropriate for their role. This system integrates deeply with authentication and provides automatic navigation based on user permissions.

## 🏗️ Architecture

### Core Components

1. **NavigationGuard** (`src/utils/NavigationGuard.ts`) - Central access control logic
2. **NavigationUtils** (`src/utils/NavigationUtils.tsx`) - Enhanced navigation functions with guards
3. **AuthService** (`src/services/AuthService.ts`) - Authentication with role-based navigation
4. **Route Access Configuration** - Centralized route permission definitions

## 👥 User Roles & Permissions

Based on the API documentation, the system supports these roles:

### CUSTOMER

- **Access**: Customer-facing features
- **Routes**: HomeScreen, Search, Cart, Orders, Profile, etc.
- **API Endpoints**: Customer API (`/api/v1/...`)

### PHARMACY_OWNER

- **Access**: Pharmacy management features
- **Routes**: PharmacyDashboard, MedicineInventory, PharmacyOrders, etc.
- **API Endpoints**: Pharmacy Owner API (`/api/v1/pharmacies/...`)

### DELIVERY_AGENT

- **Access**: Delivery management features
- **Routes**: DeliveryDashboard, AvailableOrders, MyDeliveries, etc.
- **API Endpoints**: Delivery Agent API (`/api/v1/delivery/...`)

### ADMIN

- **Access**: Platform administration features
- **Routes**: AdminDashboard, UserManagement, PharmacyManagement, etc.
- **API Endpoints**: Admin API (`/api/v1/admin/...`)

### PUBLIC

- **Access**: Unauthenticated features
- **Routes**: SplashScreen, LoginScreen, Register, etc.
- **API Endpoints**: Public API (no authentication required)

## 🔧 Implementation Details

### Route Access Configuration

```typescript
export const ROUTE_ACCESS_CONFIG: Record<string, RouteAccess> = {
  // Customer routes
  HomeScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Customer dashboard',
  },

  // Pharmacy Owner routes
  PharmacyDashboard: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy owner dashboard',
  },

  // Admin routes
  AdminDashboard: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Admin dashboard',
  },

  // Public routes
  LoginScreen: {
    allowedRoles: ['PUBLIC'],
    requiresAuth: false,
    description: 'User authentication',
  },
};
```

### Navigation Functions with Guards

```typescript
// Protected navigation (checks permissions)
export async function navigate(routeName: string, params?: object) {
  if (!NavigationGuard.validateNavigation(routeName)) {
    return false; // Access denied
  }
  // Proceed with navigation...
}

// Unsafe navigation (bypasses guards - for system use)
export async function navigateUnsafe(routeName: string, params?: object) {
  // Direct navigation without permission checks
}
```

## 🚀 Usage Examples

### Basic Navigation

```typescript
import { navigate, canAccessRoute } from '@utils/NavigationUtils';

// This will check permissions automatically
const success = await navigate('HomeScreen');

// Check permissions before showing UI elements
if (canAccessRoute('AdminDashboard')) {
  // Show admin menu item
}
```

### Authentication Flow

```typescript
import AuthService from '@services/AuthService';

// Login automatically navigates to role-appropriate home
const response = await AuthService.login(email, password);
if (response.success) {
  // User is automatically navigated to their home screen
  // CUSTOMER -> HomeScreen
  // PHARMACY_OWNER -> PharmacyDashboard
  // DELIVERY_AGENT -> DeliveryDashboard
  // ADMIN -> AdminDashboard
}
```

### Manual Role-Based Navigation

```typescript
import { NavigationGuard } from '@utils/NavigationGuard';

// Navigate to appropriate home screen
NavigationGuard.navigateToRoleBasedHome();

// Check current user's permissions
const user = NavigationGuard.getCurrentUser();
const canAccess = NavigationGuard.canAccessRoute('AdminDashboard', user);
```

## 🔒 Security Features

### Access Validation

1. **Route-Level Protection**: Every navigation attempt is validated
2. **Role-Based Access**: Users can only access routes for their role
3. **Authentication Checks**: Protected routes require valid authentication
4. **Automatic Fallbacks**: Unauthorized access redirects to appropriate screens

### Error Handling

```typescript
// Unauthorized access scenarios:

// 1. Unauthenticated user accessing protected route
// -> Shows "Authentication Required" dialog -> Redirects to LoginScreen

// 2. Authenticated user accessing wrong role's route
// -> Shows "Access Denied" dialog -> Goes back to previous screen

// 3. Invalid route
// -> Shows "Invalid route" error -> Goes back
```

## 📱 Screen Integration

### Splash Screen

```typescript
// Validates stored token and navigates to appropriate home
if (AuthService.isAuthenticated()) {
  await AuthService.validateAndNavigate(); // Role-based navigation
} else {
  navigateUnsafe('LoginScreen'); // No auth needed for login
}
```

### Login Screen

```typescript
// AuthService.login() handles role-based navigation automatically
const response = await AuthService.login(email, password);
// No manual navigation needed - user goes to their role's home screen
```

### Protected Screens

```typescript
// All navigation calls are automatically protected
const handleViewOrders = () => {
  navigate('OrderScreen'); // Checks if user can access orders
};

const handleAdminPanel = () => {
  navigate('AdminDashboard'); // Only admins can access this
};
```

## 🛠️ Development Workflow

### Adding New Routes

1. **Define Route Access** in `NavigationGuard.ts`:

```typescript
'NewFeatureScreen': {
  allowedRoles: ['CUSTOMER', 'PHARMACY_OWNER'],
  requiresAuth: true,
  fallbackRoute: 'LoginScreen',
  description: 'New feature for customers and pharmacy owners'
}
```

2. **Use Protected Navigation**:

```typescript
// This automatically checks permissions
navigate('NewFeatureScreen');
```

3. **Add to Navigation Stack** in `src/screens/index.tsx`

### Testing Access Control

```typescript
// Debug current user permissions
NavigationGuard.logUserPermissions();

// Check specific route access
const canAccess = NavigationGuard.canAccessRoute('AdminDashboard', user);

// Get all accessible routes for current user
const routes = NavigationGuard.getAccessibleRoutes(userRole);
```

## 🔍 Debugging & Monitoring

### Debug Functions

```typescript
// Log current user's permissions and accessible routes
NavigationGuard.logUserPermissions();

// Check if route exists in configuration
NavigationGuard.routeExists('SomeRoute');

// Get route configuration
const config = NavigationGuard.getRouteConfig('HomeScreen');
```

### Common Issues & Solutions

1. **"Access Denied" for valid user**

   - Check route configuration in `ROUTE_ACCESS_CONFIG`
   - Verify user role matches allowed roles

2. **Navigation not working**

   - Check if using `navigate()` vs `navigateUnsafe()`
   - Verify route exists in configuration

3. **Wrong home screen after login**
   - Check `getDefaultHomeRoute()` logic
   - Verify user role is correctly set in token

## 📋 Best Practices

### Do's ✅

- Use `navigate()` for all user-initiated navigation
- Define all routes in `ROUTE_ACCESS_CONFIG`
- Use descriptive route names and descriptions
- Test with different user roles
- Use `AuthService.login()` for authentication

### Don'ts ❌

- Don't use `navigateUnsafe()` for user navigation
- Don't bypass the navigation guard system
- Don't hardcode role checks in components
- Don't forget to add new routes to configuration
- Don't use direct React Navigation hooks

## 🚀 Future Enhancements

### Planned Features

1. **Dynamic Permissions**: Load permissions from server
2. **Route Parameters Validation**: Validate route parameters based on user
3. **Navigation Analytics**: Track navigation patterns by role
4. **Conditional UI**: Hide/show UI elements based on permissions
5. **Deep Link Protection**: Protect deep links with same access control

### Extension Points

```typescript
// Custom permission checks
NavigationGuard.addCustomValidator((route, user) => {
  // Custom business logic
  return true / false;
});

// Route-specific middleware
NavigationGuard.addRouteMiddleware('OrderScreen', params => {
  // Pre-navigation logic
});
```

This navigation guard system ensures that your MedCo app maintains proper security boundaries while providing a seamless user experience based on roles and permissions defined in your API documentation.
