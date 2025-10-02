/**
 * Login Screen
 * User authentication with form validation using established patterns
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Screen,
  Container,
  Card,
  Column,
  Row,
  Input,
  Button,
  Heading2,
  BodyText,
  Spacer,
  Divider,
} from '@components';
import AuthService from '@services/AuthService';
import { navigate } from '@utils/NavigationUtils';

// Login interfaces are now in AuthService

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasErrors = false;

    if (!email) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      // Use AuthService for login with role-based navigation
      const response = await AuthService.login(email, password);

      if (response.success) {
        // AuthService handles token storage and role-based navigation
        // No need to manually navigate - it's handled in AuthService.login()
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const handleSignUp = () => {
    navigate('Register');
  };

  return (
    <Screen scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Container padded centered>
          <Card style={{ width: '100%', maxWidth: 400 }}>
            <Column gap="lg">
              {/* Header */}
              <Column align="center" gap="sm">
                <Heading2 color="contrast">Welcome Back</Heading2>
                <BodyText color="secondary" style={{ textAlign: 'center' }}>
                  Sign in to your MedCo account
                </BodyText>
              </Column>

              <Divider />

              {/* Form */}
              <Column gap="md">
                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  errorText={emailError}
                  state={emailError ? 'error' : 'default'}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoComplete="password"
                  errorText={passwordError}
                  state={passwordError ? 'error' : 'default'}
                />

                <Row justify="flex-end">
                  <Button
                    title="Forgot Password?"
                    variant="ghost"
                    size="sm"
                    onPress={handleForgotPassword}
                  />
                </Row>
              </Column>

              {/* Actions */}
              <Column gap="md">
                <Button
                  title={isLoading ? 'Signing In...' : 'Sign In'}
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                />

                <Divider />

                <Row justify="center" gap="xs">
                  <BodyText color="secondary">Don't have an account?</BodyText>
                  <Button
                    title="Sign Up"
                    variant="ghost"
                    size="sm"
                    onPress={handleSignUp}
                  />
                </Row>
              </Column>
            </Column>
          </Card>
        </Container>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default LoginScreen;
