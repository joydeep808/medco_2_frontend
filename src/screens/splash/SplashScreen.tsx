/**
 * Splash Screen
 * Initial loading screen with branding and app initialization
 */

import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  Screen,
  Container,
  Column,
  Heading1,
  BodyText,
  Spacer,
  colors,
} from '@components';
import { useAuthStore } from '@store/AuthStore';
import AuthService from '@services/AuthService';
import { navigateUnsafe } from '@utils/NavigationUtils';

export const SplashScreen: React.FC = () => {
  const { isUserLoggedIn } = useAuthStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is authenticated and validate token
      if (AuthService.isAuthenticated()) {
        // Validate token and navigate to appropriate home screen
        setTimeout(async () => {
          await AuthService.validateAndNavigate();
        }, 1500);
      } else {
        // No authentication found, go to login
        setTimeout(() => {
          navigateUnsafe('LoginScreen');
        }, 2000);
      }
    } catch (error) {
      console.error('App initialization error:', error);
      // On error, go to login
      setTimeout(() => {
        navigateUnsafe('LoginScreen');
      }, 2000);
    }
  };

  return (
    <Screen>
      <Container centered>
        <Column align="center" gap="lg">
          {/* App Logo/Branding */}
          <Heading1 color="contrast" style={{ textAlign: 'center' }}>
            MedCo
          </Heading1>

          <BodyText color="secondary" style={{ textAlign: 'center' }}>
            Your Healthcare Companion
          </BodyText>

          <Spacer size="xl" />

          {/* Loading Indicator */}
          <ActivityIndicator size="large" color={colors.primary[500]} />

          <BodyText color="muted" style={{ textAlign: 'center' }}>
            Initializing...
          </BodyText>
        </Column>
      </Container>
    </Screen>
  );
};

export default SplashScreen;
