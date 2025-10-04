/**
 * Navigation Guard System
 * Implements role-based access control for navigation
 */

import { useAuthStore } from '@store/AuthStore';
import { goBack, resetAndNavigateUnsafe } from '@utils/NavigationUtils';
import {
  showErrorToast,
  showWarningToast,
} from '@components/Toast/ToastManager';
import { JwtTokenUser } from '@interfaces/response/common';

// Define user roles
export type UserRole =
  | 'CUSTOMER'
  | 'PHARMACY_OWNER'
  | 'DELIVERY_AGENT'
  | 'ADMIN'
  | 'PUBLIC';

// Define route access configuration
export interface RouteAccess {
  allowedRoles: UserRole[];
  requiresAuth: boolean;
  fallbackRoute?: string;
  description?: string;
}

// Route access configuration based on API documentation
export const ROUTE_ACCESS_CONFIG: Record<string, RouteAccess> = {
  // Public routes (no authentication required)
  SplashScreen: {
    allowedRoles: [
      'PUBLIC',
      'CUSTOMER',
      'PHARMACY_OWNER',
      'DELIVERY_AGENT',
      'ADMIN',
    ],
    requiresAuth: false,
    description: 'App initialization screen',
  },
  LoginScreen: {
    allowedRoles: ['PUBLIC'],
    requiresAuth: false,
    description: 'User authentication',
  },
  Register: {
    allowedRoles: ['PUBLIC'],
    requiresAuth: false,
    fallbackRoute: 'LoginScreen',
    description: 'User registration',
  },
  OTP: {
    allowedRoles: ['PUBLIC'],
    requiresAuth: false,
    fallbackRoute: 'LoginScreen',
    description: 'OTP verification',
  },
  Onboarding: {
    allowedRoles: ['PUBLIC'],
    requiresAuth: false,
    description: 'App onboarding',
  },

  // Customer routes
  HomeScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Customer dashboard',
  },
  Search: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Medicine and pharmacy search',
  },
  StoreScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy details and medicines',
  },
  PharmacyScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy details and medicines',
  },
  Cart: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Shopping cart',
  },
  CartScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Cart management',
  },
  CheckoutScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Checkout',
  },
  OrderScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Customer orders',
  },
  OrderDetailedScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Order details',
  },
  ProfileScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Customer profile',
  },
  LocationSearch: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Address management',
  },
  CategoryScreen: {
    allowedRoles: ['CUSTOMER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Medicine categories',
  },

  // Pharmacy Owner routes
  PharmacyDashboard: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy owner dashboard',
  },
  PharmacyOrders: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy order management',
  },
  MedicineInventory: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Medicine inventory management',
  },
  PharmacyProfile: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy profile management',
  },
  PharmacyAnalytics: {
    allowedRoles: ['PHARMACY_OWNER'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy analytics',
  },

  // Delivery Agent routes
  DeliveryDashboard: {
    allowedRoles: ['DELIVERY_AGENT'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Delivery agent dashboard',
  },
  AvailableOrders: {
    allowedRoles: ['DELIVERY_AGENT'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Available delivery orders',
  },
  MyDeliveries: {
    allowedRoles: ['DELIVERY_AGENT'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Assigned deliveries',
  },
  DeliveryProfile: {
    allowedRoles: ['DELIVERY_AGENT'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Delivery agent profile',
  },
  DeliveryAnalytics: {
    allowedRoles: ['DELIVERY_AGENT'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Delivery analytics',
  },

  // Admin routes
  AdminDashboard: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Admin dashboard',
  },
  UserManagement: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'User management',
  },
  PharmacyManagement: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Pharmacy approval and management',
  },
  OrderManagement: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Order oversight',
  },
  CouponManagement: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Coupon management',
  },
  PlatformAnalytics: {
    allowedRoles: ['ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Platform analytics',
  },

  // Demo/Development routes
  ComponentShowcase: {
    allowedRoles: ['CUSTOMER', 'PHARMACY_OWNER', 'DELIVERY_AGENT', 'ADMIN'],
    requiresAuth: true,
    fallbackRoute: 'LoginScreen',
    description: 'Design system showcase',
  },
};

// Navigation guard class
export class NavigationGuard {
  /**
   * Check if user has access to a specific route
   */
  static canAccessRoute(routeName: string, user: JwtTokenUser | null): boolean {
    const routeConfig = ROUTE_ACCESS_CONFIG[routeName];

    if (!routeConfig) {
      console.warn(`Route '${routeName}' not found in access configuration`);
      return false;
    }

    // Check if route requires authentication
    if (routeConfig.requiresAuth && !user) {
      return false;
    }

    // If no authentication required and user is null, check if PUBLIC is allowed
    if (!user) {
      return routeConfig.allowedRoles.includes('PUBLIC');
    }

    // Check if user's role is allowed
    const userRole = user.role as UserRole;
    return routeConfig.allowedRoles.includes(userRole);
  }

  /**
   * Get user's role from auth store
   */
  static getCurrentUserRole(): UserRole | null {
    const { user } = useAuthStore.getState();
    return (user?.role as UserRole) || null;
  }

  /**
   * Get current user from auth store
   */
  static getCurrentUser(): JwtTokenUser | null {
    const { user } = useAuthStore.getState();
    return user;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const { isUserLoggedIn } = useAuthStore.getState();
    return isUserLoggedIn;
  }

  /**
   * Validate navigation attempt and handle unauthorized access
   */
  static validateNavigation(routeName: string): boolean {
    const user = this.getCurrentUser();
    const canAccess = this.canAccessRoute(routeName, user);

    if (!canAccess) {
      this.handleUnauthorizedAccess(routeName, user);
      return false;
    }

    return true;
  }

  /**
   * Handle unauthorized access attempts
   */
  static handleUnauthorizedAccess(
    routeName: string,
    user: JwtTokenUser | null,
  ): void {
    const routeConfig = ROUTE_ACCESS_CONFIG[routeName];

    if (!routeConfig) {
      showErrorToast('Invalid route requested');
      goBack();
      return;
    }

    // If user is not authenticated and route requires auth
    if (routeConfig.requiresAuth && !user) {
      showWarningToast('Please login to access this feature', {
        action: {
          label: 'Login',
          onPress: () => resetAndNavigateUnsafe('LoginScreen'),
        },
      });
      resetAndNavigateUnsafe('LoginScreen');
      return;
    }

    // If user is authenticated but doesn't have the right role
    if (user) {
      const userRole = user.role as UserRole;
      showErrorToast(
        `This feature is not available for ${userRole
          .toLowerCase()
          .replace('_', ' ')} accounts.`,
      );
      goBack();
      return;
    }

    // Fallback
    showErrorToast('You do not have permission to access this feature');
    goBack();
  }

  /**
   * Get default home route based on user role
   */
  static getDefaultHomeRoute(userRole: UserRole): string {
    switch (userRole) {
      case 'CUSTOMER':
        return 'HomeScreen';
      case 'PHARMACY_OWNER':
        return 'PharmacyDashboard';
      case 'DELIVERY_AGENT':
        return 'DeliveryDashboard';
      case 'ADMIN':
        return 'AdminDashboard';
      default:
        return 'LoginScreen';
    }
  }

  /**
   * Navigate to appropriate home screen based on user role
   */
  static navigateToRoleBasedHome(): void {
    const user = this.getCurrentUser();

    if (!user) {
      resetAndNavigateUnsafe('LoginScreen');
      return;
    }

    const userRole = user.role as UserRole;
    const homeRoute = this.getDefaultHomeRoute(userRole);
    resetAndNavigateUnsafe(homeRoute);
  }

  /**
   * Get routes accessible by a specific role
   */
  static getAccessibleRoutes(userRole: UserRole): string[] {
    return Object.entries(ROUTE_ACCESS_CONFIG)
      .filter(([_, config]) => config.allowedRoles.includes(userRole))
      .map(([routeName, _]) => routeName);
  }

  /**
   * Check if route exists in configuration
   */
  static routeExists(routeName: string): boolean {
    return routeName in ROUTE_ACCESS_CONFIG;
  }

  /**
   * Get route configuration
   */
  static getRouteConfig(routeName: string): RouteAccess | null {
    return ROUTE_ACCESS_CONFIG[routeName] || null;
  }

  /**
   * Debug: Log current user permissions
   */
  static logUserPermissions(): void {
    const user = this.getCurrentUser();
    const userRole = user?.role as UserRole;

    console.log('=== User Permissions Debug ===');
    console.log('User:', user);
    console.log('Role:', userRole);
    console.log('Is Authenticated:', this.isAuthenticated());

    if (userRole) {
      const accessibleRoutes = this.getAccessibleRoutes(userRole);
      console.log('Accessible Routes:', accessibleRoutes);
    }
    console.log('==============================');
  }
}

export default NavigationGuard;
