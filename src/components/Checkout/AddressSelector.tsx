/**
 * Address Selector Component
 * Allows users to select delivery address for checkout
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BodyText,
  Heading3,
  Caption,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';

interface Address {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions?: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onAddNewAddress: () => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddNewAddress,
}) => {
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'HOME':
        return '🏠';
      case 'WORK':
        return '🏢';
      default:
        return '📍';
    }
  };

  const renderAddressCard = (address: Address) => {
    const isSelected = selectedAddress?.id === address.id;

    return (
      <TouchableOpacity
        key={address.id}
        style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
        onPress={() => onAddressSelect(address)}
      >
        <Row style={styles.addressHeader}>
          <View style={styles.addressIconContainer}>
            <BodyText style={styles.addressIcon}>
              {getAddressIcon(address.type)}
            </BodyText>
          </View>

          <Column style={styles.addressInfo}>
            <Row style={styles.addressLabelRow}>
              <BodyText color="primary" style={styles.addressLabel}>
                {address.label}
              </BodyText>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Caption style={styles.defaultBadgeText}>Default</Caption>
                </View>
              )}
            </Row>

            <BodyText color="secondary" style={styles.addressText}>
              {address.street}, {address.area}
            </BodyText>
            <BodyText color="secondary" style={styles.addressText}>
              {address.city}, {address.state} - {address.pincode}
            </BodyText>

            {address.landmark && (
              <Caption color="secondary" style={styles.landmark}>
                Near {address.landmark}
              </Caption>
            )}

            {address.deliveryInstructions && (
              <Caption color="secondary" style={styles.instructions}>
                Instructions: {address.deliveryInstructions}
              </Caption>
            )}
          </Column>

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <BodyText style={styles.checkmark}>✓</BodyText>
            </View>
          )}
        </Row>
      </TouchableOpacity>
    );
  };

  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        <Heading3 color="primary" style={styles.title}>
          Delivery Address
        </Heading3>

        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <BodyText color="secondary" style={styles.emptyText}>
              No saved addresses found
            </BodyText>
            <Button
              title="Add New Address"
              variant="primary"
              style={styles.addAddressButton}
              onPress={onAddNewAddress}
            />
          </View>
        ) : (
          <>
            <Column style={styles.addressList}>
              {addresses.map(renderAddressCard)}
            </Column>

            <Button
              title="+ Add New Address"
              variant="ghost"
              style={styles.addNewButton}
              onPress={onAddNewAddress}
            />
          </>
        )}
      </Column>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  addressList: {
    gap: spacing.sm,
  },
  addressCard: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  selectedAddressCard: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  addressHeader: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressIcon: {
    fontSize: 18,
  },
  addressInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  addressLabelRow: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: colors.success[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    color: colors.success[700],
    fontSize: 10,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 18,
  },
  landmark: {
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  instructions: {
    backgroundColor: colors.warning[100],
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
  addAddressButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addNewButton: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  addNewText: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AddressSelector;
