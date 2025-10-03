/**
 * Login Screen
 * OTP-based authentication with proper keyboard handling
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BodyText,
  Heading2,
  Heading3,
  Typography,
  Caption,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
  typography,
  Input,
} from '@components';
import AuthService from '@services/AuthService';
import { navigate } from '@utils/NavigationUtils';
import { useAuthStore, setToken as setGlobalToken } from '@store/AuthStore';

// Login interfaces are now in AuthService

export const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { setUser, setToken } = useAuthStore();

  // Timer for resend OTP
  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (text: string) => {
    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    setPhone(numericText);
    if (phoneError) setPhoneError('');
  };

  const handleOtpChange = (text: string) => {
    // Remove any non-numeric characters and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericText);
    if (otpError) setOtpError('');
  };

  const handleGenerateOtp = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Reset errors
    setPhoneError('');

    // Validation
    if (!phone) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.generateOtp(phone);
      if (response.success) {
        setOtpSent(true);
        setResendTimer(30); // 30 seconds timer
        Alert.alert('OTP Sent', 'Please check your phone for the OTP');
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Reset errors
    setOtpError('');

    // Validation
    if (!otp) {
      setOtpError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.loginWithOtp(phone, otp);
      console.log(response);
      if (response.success && response.data) {
        // AuthService already handles token storage and user state
        // Navigate to home screen
        navigate('HomeScreen');
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await AuthService.generateOtp(phone);
      console.log(response);
      if (response.success) {
        setResendTimer(30);
        Alert.alert('OTP Sent', 'New OTP has been sent to your phone');
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to resend OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Heading2 color="primary" style={styles.title}>
                  Welcome to MedCo
                </Heading2>
                <BodyText color="secondary" style={styles.subtitle}>
                  {otpSent
                    ? 'Enter the OTP sent to your phone'
                    : 'Enter your phone number to continue'}
                </BodyText>
              </View>

              {/* Form Card */}
              <Card style={styles.formCard}>
                <Column gap="lg">
                  {/* Phone Input */}
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder="Enter 10-digit phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    errorText={phoneError}
                    state={phoneError ? 'error' : 'default'}
                    editable={!otpSent}
                  />

                  {/* OTP Input - Only show when OTP is sent */}
                  {otpSent && (
                    <Input
                      label="OTP"
                      value={otp}
                      onChangeText={handleOtpChange}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="number-pad"
                      maxLength={6}
                      errorText={otpError}
                      state={otpError ? 'error' : 'default'}
                    />
                  )}

                  {/* Resend OTP */}
                  {otpSent && (
                    <Row justify="space-between" align="center">
                      <BodyText color="secondary">Didn't receive OTP?</BodyText>
                      <Button
                        title={
                          resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : 'Resend OTP'
                        }
                        variant="ghost"
                        size="sm"
                        onPress={handleResendOtp}
                        disabled={resendTimer > 0 || isLoading}
                      />
                    </Row>
                  )}

                  {/* Action Button */}
                  <Button
                    title={
                      isLoading
                        ? otpSent
                          ? 'Verifying...'
                          : 'Sending OTP...'
                        : otpSent
                        ? 'Verify & Login'
                        : 'Send OTP'
                    }
                    onPress={otpSent ? handleLogin : handleGenerateOtp}
                    loading={isLoading}
                    disabled={isLoading}
                    fullWidth
                  />

                  {/* Change Phone Number */}
                  {otpSent && (
                    <Button
                      title="Change Phone Number"
                      variant="ghost"
                      size="sm"
                      onPress={() => {
                        setOtpSent(false);
                        setOtp('');
                        setOtpError('');
                        setResendTimer(0);
                      }}
                    />
                  )}
                </Column>
              </Card>

              {/* Sign Up Link */}
              <Row
                justify="center"
                align="center"
                gap="sm"
                style={styles.signupRow}
              >
                <BodyText color="secondary">Don't have an account?</BodyText>
                <Button
                  title="Sign Up"
                  variant="ghost"
                  size="sm"
                  onPress={handleSignUp}
                />
              </Row>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.primary[600],
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    color: colors.light.textSecondary,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  signupRow: {
    marginTop: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
