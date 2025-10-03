/**
 * Profile Screen
 * Enhanced profile screen with location features and settings
 */

import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BodyText,
  Heading2,
  Typography,
  Button,
  Card,
  Row,
  Column,
  colors,
  spacing,
  borderRadius,
  shadows,
  
  typography,
} from '@components';
import { useAuthStore, removeToken } from '@store/AuthStore';
import { useLocationStore } from '@store/LocationStore';
import LocationDisplay from '../../components/Location/LocationDisplay';
import AddressBook from '../../components/Location/AddressBook';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { currentLocation, savedAddresses } = useLocationStore();

  const handleLogout = () => {
    removeToken();
  };

  const renderProfileHeader = () => (
    <Card style={styles.profileHeader}>
      <Row>
        <View style={styles.avatarContainer}>
          <Typography
            variant="bodyLarge"
            color="contrast"
            style={styles.avatarText}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Typography>
        </View>
        <Column style={styles.userInfo}>
          <Heading2 color="primary">{user?.name || 'User'}</Heading2>
          <BodyText color="secondary">
            {user?.email || 'user@example.com'}
          </BodyText>
          <BodyText color="secondary">{'+91 9876543210'}</BodyText>
        </Column>
      </Row>
    </Card>
  );

  const renderLocationSection = () => (
    <Card style={styles.section}>
      <Heading2 color="primary" style={styles.sectionTitle}>
        Current Location
      </Heading2>
      <LocationDisplay
        onLocationPress={() => console.log('Change location')}
        showChangeButton={true}
        style={styles.locationDisplay}
      />
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.section}>
      <Heading2 color="primary" style={styles.sectionTitle}>
        Quick Actions
      </Heading2>
      <Column style={styles.quickActions}>
        <Button
          variant="ghost"
          title="📋 My Orders"
          style={styles.actionItem}
          onPress={() => console.log('My Orders')}
        />
        <Button
          variant="ghost"
          title="💊 Prescriptions"
          style={styles.actionItem}
          onPress={() => console.log('Prescriptions')}
        />
        <Button
          variant="ghost"
          title="❤️ Favorites"
          style={styles.actionItem}
          onPress={() => console.log('Favorites')}
        />
        <Button
          variant="ghost"
          title="🏥 My Pharmacies"
          style={styles.actionItem}
          onPress={() => console.log('My Pharmacies')}
        />
      </Column>
    </Card>
  );

  const renderSettings = () => (
    <Card style={styles.section}>
      <Heading2 color="primary" style={styles.sectionTitle}>
        Settings
      </Heading2>
      <Column style={styles.settingsGroup}>
        <Button
          variant="ghost"
          title="🔔 Notifications"
          style={styles.settingItem}
          onPress={() => console.log('Notifications')}
        />
        <Button
          variant="ghost"
          title="🔒 Privacy & Security"
          style={styles.settingItem}
          onPress={() => console.log('Privacy')}
        />
        <Button
          variant="ghost"
          title="💳 Payment Methods"
          style={styles.settingItem}
          onPress={() => console.log('Payment')}
        />
        <Button
          variant="ghost"
          title="📍 Location Preferences"
          style={styles.settingItem}
          onPress={() => console.log('Location')}
        />
        <Button
          variant="ghost"
          title="❓ Help & Support"
          style={styles.settingItem}
          onPress={() => console.log('Help')}
        />
      </Column>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderLocationSection()}

        <Card style={styles.section}>
          <Heading2 color="primary" style={styles.sectionTitle}>
            Saved Addresses ({savedAddresses.length})
          </Heading2>
          <AddressBook showAddButton={true} style={styles.addressBook} />
        </Card>

        {renderQuickActions()}
        {renderSettings()}

        <Card style={styles.section}>
          <Button
            variant="danger"
            size="lg"
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </Card>

        <View style={styles.footer}>
          <BodyText color="secondary" style={styles.footerText}>
            MedCo v1.0.0
          </BodyText>
          <BodyText color="secondary" style={styles.footerText}>
            Medicine Delivery Platform
          </BodyText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  profileHeader: {
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.md,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    ...shadows.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.light.textHighContrast,
  },
  quickActions: {
    gap: 0,
  },
  actionItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    justifyContent: 'flex-start',
    borderRadius: 0,
  },
  settingsGroup: {
    gap: 0,
  },
  settingItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    justifyContent: 'flex-start',
    borderRadius: 0,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  footerText: {
    textAlign: 'center',
    marginVertical: spacing.xs,
    color: colors.light.textMuted,
  },
  locationDisplay: {
    marginTop: spacing.sm,
  },
  addressBook: {
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
