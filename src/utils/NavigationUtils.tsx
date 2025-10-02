import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import { NavigationGuard } from './NavigationGuard';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a route with role-based access control
 */
export async function navigate(routeName: string, params?: object) {
  // Validate access before navigation
  if (!NavigationGuard.validateNavigation(routeName)) {
    return false;
  }

  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
    return true;
  }
  return false;
}

/**
 * Replace current route with role-based access control
 */
export async function replace(routeName: string, params?: object) {
  // Validate access before navigation
  if (!NavigationGuard.validateNavigation(routeName)) {
    return false;
  }

  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
    return true;
  }
  return false;
}

/**
 * Reset navigation stack and navigate to route with role-based access control
 */
export async function resetAndNavigate(routeName: string) {
  // Validate access before navigation
  if (!NavigationGuard.validateNavigation(routeName)) {
    return false;
  }

  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
    return true;
  }
  return false;
}

/**
 * Go back to previous screen
 */
export async function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
    return true;
  }
  return false;
}

/**
 * Push route to stack with role-based access control
 */
export async function push(routeName: string, params?: object) {
  // Validate access before navigation
  if (!NavigationGuard.validateNavigation(routeName)) {
    return false;
  }

  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
    return true;
  }
  return false;
}

/**
 * Navigate without access control (for internal system use)
 */
export async function navigateUnsafe(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
    return true;
  }
  return false;
}

/**
 * Replace without access control (for internal system use)
 */
export async function replaceUnsafe(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
    return true;
  }
  return false;
}

/**
 * Reset and navigate without access control (for internal system use)
 */
export async function resetAndNavigateUnsafe(routeName: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
    return true;
  }
  return false;
}

/**
 * Navigate to role-appropriate home screen
 */
export async function navigateToHome() {
  NavigationGuard.navigateToRoleBasedHome();
}

/**
 * Check if navigation is ready
 */
export async function prepareNavigation() {
  return navigationRef.isReady();
}

/**
 * Get current route name
 */
export function getCurrentRouteName(): string | undefined {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return undefined;
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(routeName: string): boolean {
  const user = NavigationGuard.getCurrentUser();
  return NavigationGuard.canAccessRoute(routeName, user);
}
