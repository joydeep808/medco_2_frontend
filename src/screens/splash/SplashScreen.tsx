/**
 * Simple Splash Screen
 * Initial loading screen with basic initialization
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '@components';
import { setToken, setUserInfo } from '@store/AuthStore';
import { useLocationStore } from '@store/LocationStore';
import tokenStore from '@store/TokenStore';
import { decodeJwtPayload } from '@utils/JwtDecoder';
import LocationService, {
  LocationError,
  LocationErrorType,
} from '@services/LocationService';
import { resetAndNavigateUnsafe } from '@utils/NavigationUtils';
import { JwtTokenUser } from '@interfaces/response/common';

export const SplashScreen: React.FC = () => {
  const {
    setCurrentLocation,
    setLocationError,
    setLocationPermission,
    loadPersistedData,
  } = useLocationStore();

  const [currentStep, setCurrentStep] = useState<string>('Initializing...');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    initializeApp();
  }, []);

  const validateJwtToken = (
    token: string,
  ): { isValid: boolean; user?: JwtTokenUser } => {
    try {
      const decoded = decodeJwtPayload(token);

      // Validate required fields
      if (!decoded.userId || !decoded.email) {
        console.log('Token missing required fields');
        return { isValid: false };
      }

      return { isValid: true, user: decoded };
    } catch (error) {
      console.error('Token validation error:', error);
      return { isValid: false };
    }
  };

  const initializeApp = async () => {
    try {
      // Step 1: Authentication Check
      setCurrentStep('Checking authentication...');
      setProgress(25);

      const accessToken = tokenStore.getAccessToken();

      if (accessToken) {
        const validation = validateJwtToken(accessToken);
        if (validation.isValid && validation.user) {
          // Set authentication state
          setToken(accessToken);
          setUserInfo(validation.user);
        } else {
          // Token is invalid, clear it
          tokenStore.setToken('access_token', '');
          tokenStore.setToken('refresh_token', '');
        }
      }

      // Step 2: Location Services Setup
      setCurrentStep('Setting up location services...');
      setProgress(50);

      try {
        // Load persisted location data first
        loadPersistedData();

        // Check location permissions
        const hasPermission = await LocationService.requestLocationPermission();
        setLocationPermission(hasPermission);

        if (hasPermission) {
          // Try to get current location (with timeout)
          try {
            const location = await Promise.race([
              LocationService.getCurrentLocation(),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Location timeout')), 5000),
              ),
            ]);

            setCurrentLocation(location);
            setLocationError(null);
          } catch (locationError) {
            console.log('Location detection failed, using cached location');
            setLocationError({
              type: LocationErrorType.TIMEOUT,
              message: 'Location detection timed out',
              recoverable: true,
            } as LocationError);
          }
        } else {
          setLocationError({
            type: LocationErrorType.PERMISSION_DENIED,
            message: 'Location permission denied',
            recoverable: true,
          } as LocationError);
        }
      } catch (error) {
        console.error('Location setup error:', error);
      }

      // Step 3: Load App Data
      setCurrentStep('Loading app data...');
      setProgress(75);

      // Step 4: Navigation
      setCurrentStep('Preparing app...');
      setProgress(100);

      // Navigate to home screen
      resetAndNavigateUnsafe('HomeScreen');
    } catch (error) {
      console.error('App initialization error:', error);
      setCurrentStep('Initialization failed');

      // On error, still navigate to home after a delay
      setTimeout(() => {
        resetAndNavigateUnsafe('HomeScreen');
      }, 1);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary[500]}
        translucent={false}
      />
      <View style={styles.container}>
        {/* App Logo/Branding */}
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>MedCo</Text>
          <Text style={styles.tagline}>Your Healthcare Companion</Text>
        </View>

        {/* Loading Section */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />

          <Text style={styles.stepText}>{currentStep}</Text>

          <Text style={styles.progressText}>{progress}% completed</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Version Info */}
        <Text style={styles.versionText}>
          Version 1.0.0 • Medicine Delivery Platform
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl * 2,
  },
  appName: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: typography.fontWeight.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    minHeight: 140,
  },
  stepText: {
    fontSize: typography.fontSize.base,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: spacing.lg,
  },
  progressBarContainer: {
    width: 240,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
  },
  versionText: {
    position: 'absolute',
    bottom: spacing.xxl,
    fontSize: typography.fontSize.xs,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.7,
    fontWeight: typography.fontWeight.medium,
  },
});

export default SplashScreen;
