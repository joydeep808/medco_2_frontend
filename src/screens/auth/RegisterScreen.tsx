/**
 * Register Screen
 * User registration with form validation
 */

import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Container,
  Card,
  Column,
  Row,
  Input,
  Button,
  Heading1,
  BodyText,
  Spacer,
  colors,
  spacing,
  borderRadius,
  shadows,
} from '@components';
import { navigate } from '@utils/NavigationUtils';

export const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual registration logic
      console.log('Register with:', formData);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigate('LoginScreen') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    navigate('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Container padded>
        <Spacer size="xl" />

        <View style={styles.header}>
          <Heading1 color="primary" style={styles.title}>
            Create Account
          </Heading1>
          <BodyText color="secondary" style={styles.subtitle}>
            Join MedCo for fast medicine delivery
          </BodyText>
        </View>

        <Spacer size="xl" />

        <Card style={styles.formCard}>
          <Column gap="lg">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
              secureTextEntry
            />

            <Spacer size="md" />

            <Button
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleRegister}
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            />
          </Column>
        </Card>

        <Spacer size="lg" />

        <Row justify="center" align="center" gap="sm">
          <BodyText color="secondary">Already have an account?</BodyText>
          <Button
            title="Sign In"
            variant="ghost"
            size="sm"
            onPress={handleLoginNavigation}
          />
        </Row>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.primary[600],
  },
  subtitle: {
    textAlign: 'center',
    color: colors.light.textSecondary,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.md,
  },
});

export default RegisterScreen;
