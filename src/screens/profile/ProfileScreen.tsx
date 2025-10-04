/**
 * Profile Screen
 * Enhanced profile screen with location features and settings
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
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
import { navigate } from '@utils/NavigationUtils';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { currentLocation, savedAddresses } = useLocationStore();

  const handleLogout = () => {
    removeToken();
  };

  const renderProfileHeader = () => (
    <View style={styles.modernProfileHeader}>
      <View style={styles.profileBackground}>
        <View style={styles.profileContent}>
          <View style={styles.modernAvatarContainer}>
            <BodyText style={styles.modernAvatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </BodyText>
          </View>
          <View style={styles.profileInfo}>
            <Heading2 color="white" style={styles.profileName}>
              {user?.name || 'User'}
            </Heading2>
            <BodyText color="white" style={styles.profileEmail}>
              {user?.email || 'user@example.com'}
            </BodyText>
            <BodyText color="white" style={styles.profilePhone}>
              +91 9876543210
            </BodyText>
          </View>
        </View>
      </View>
    </View>
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
    <View style={styles.quickActionsGrid}>
      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigate("OrderScreen")}
      >
        <View style={styles.quickActionIconContainer}>
          <BodyText style={styles.quickActionIcon}>📋</BodyText>
        </View>
        <BodyText color="primary" weight="medium" size="sm">
          My Orders
        </BodyText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => console.log('Prescriptions')}
      >
        <View style={styles.quickActionIconContainer}>
          <BodyText style={styles.quickActionIcon}>💊</BodyText>
        </View>
        <BodyText color="primary" weight="medium" size="sm">
          Prescriptions
        </BodyText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => console.log('Favorites')}
      >
        <View style={styles.quickActionIconContainer}>
          <BodyText style={styles.quickActionIcon}>❤️</BodyText>
        </View>
        <BodyText color="primary" weight="medium" size="sm">
          Favorites
        </BodyText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => console.log('My Pharmacies')}
      >
        <View style={styles.quickActionIconContainer}>
          <BodyText style={styles.quickActionIcon}>🏥</BodyText>
        </View>
        <BodyText color="primary" weight="medium" size="sm">
          Pharmacies
        </BodyText>
      </TouchableOpacity>
    </View>
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
  },
  modernProfileHeader: {
    marginBottom: spacing.lg,
  },
  profileBackground: {
    backgroundColor: colors.primary[500],
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    ...shadows.lg,
  },
  modernAvatarText: {
    color: colors.primary[500],
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: spacing.xs,
  },
  profileEmail: {
    marginBottom: spacing.xs,
    opacity: 0.9,
  },
  profilePhone: {
    opacity: 0.9,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  section: {
    marginHorizontal: spacing.lg,
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
