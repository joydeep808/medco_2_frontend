/**
 * Address Book Component
 * Manages saved addresses with add, edit, delete, and set default functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useLocationStore } from '@store/LocationStore';
import { SavedAddress, LocationData } from '@services/LocationService';
import LocationService from '@services/LocationService';

export interface AddressBookProps {
  onAddressSelect?: (address: SavedAddress) => void;
  showAddButton?: boolean;
  style?: any;
}

export const AddressBook: React.FC<AddressBookProps> = ({
  onAddressSelect,
  showAddButton = true,
  style,
}) => {
  const {
    savedAddresses,
    defaultAddress,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  } = useLocationStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(
    null,
  );
  const [newAddress, setNewAddress] = useState({
    label: '',
    type: 'OTHER' as 'HOME' | 'WORK' | 'OTHER',
    deliveryInstructions: '',
    landmark: '',
  });

  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      label: '',
      type: 'OTHER',
      deliveryInstructions: '',
      landmark: '',
    });
    setShowAddModal(true);
  };

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setNewAddress({
      label: address.label,
      type: address.type,
      deliveryInstructions: address.deliveryInstructions || '',
      landmark: address.landmark || '',
    });
    setShowAddModal(true);
  };

  const handleSaveAddress = (location: LocationData) => {
    if (!newAddress.label.trim()) {
      Alert.alert('Error', 'Please enter a label for this address');
      return;
    }

    const addressData: SavedAddress = {
      id: editingAddress?.id || Date.now().toString(),
      label: newAddress.label.trim(),
      location,
      type: newAddress.type,
      isDefault: savedAddresses.length === 0, // First address is default
      deliveryInstructions: newAddress.deliveryInstructions.trim() || undefined,
      landmark: newAddress.landmark.trim() || undefined,
    };

    if (editingAddress) {
      updateSavedAddress(editingAddress.id, addressData);
    } else {
      addSavedAddress(addressData);
    }

    setShowAddModal(false);
  };

  const handleDeleteAddress = (address: SavedAddress) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSavedAddress(address.id),
        },
      ],
    );
  };

  const handleSetDefault = (address: SavedAddress) => {
    if (!address.isDefault) {
      setDefaultAddress(address.id);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'HOME':
        return '🏠';
      case 'WORK':
        return '🏢';
      default:
        return '📍';
    }
  };

  const renderAddressItem = ({ item }: { item: SavedAddress }) => (
    <View style={styles.addressItem}>
      <TouchableOpacity
        style={styles.addressContent}
        onPress={() => onAddressSelect?.(item)}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTitleContainer}>
            <Text style={styles.addressIcon}>
              {getAddressTypeIcon(item.type)}
            </Text>
            <Text style={styles.addressLabel}>{item.label}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.addressText} numberOfLines={2}>
          {LocationService.formatAddress(item.location)}
        </Text>

        {item.landmark && (
          <Text style={styles.landmarkText}>Near: {item.landmark}</Text>
        )}

        {item.deliveryInstructions && (
          <Text style={styles.instructionsText}>
            Instructions: {item.deliveryInstructions}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item)}
          >
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(item)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📍</Text>
      <Text style={styles.emptyTitle}>No saved addresses</Text>
      <Text style={styles.emptyText}>
        Add your frequently used addresses for quick selection
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Addresses</Text>
        {showAddButton && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
            <Text style={styles.addButtonText}>+ Add Address</Text>
          </TouchableOpacity>
        )}
      </View>

      {savedAddresses.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedAddresses}
          renderItem={renderAddressItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Edit Address' : 'Add Address'}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address Label</Text>
              <TextInput
                style={styles.textInput}
                value={newAddress.label}
                onChangeText={text =>
                  setNewAddress(prev => ({ ...prev, label: text }))
                }
                placeholder="e.g., Home, Office, Mom's place"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address Type</Text>
              <View style={styles.typeSelector}>
                {(['HOME', 'WORK', 'OTHER'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newAddress.type === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setNewAddress(prev => ({ ...prev, type }))}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newAddress.type === type &&
                          styles.typeButtonTextSelected,
                      ]}
                    >
                      {getAddressTypeIcon(type)} {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={newAddress.landmark}
                onChangeText={text =>
                  setNewAddress(prev => ({ ...prev, landmark: text }))
                }
                placeholder="e.g., Near City Mall, Opposite Park"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Delivery Instructions (Optional)
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newAddress.deliveryInstructions}
                onChangeText={text =>
                  setNewAddress(prev => ({
                    ...prev,
                    deliveryInstructions: text,
                  }))
                }
                placeholder="e.g., Ring the bell twice, Call before delivery"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Location Picker would go here */}
            <Text style={styles.locationNote}>
              📍 Use the location picker to select the exact address
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addressItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  addressContent: {
    padding: 16,
  },
  addressHeader: {
    marginBottom: 8,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  addressActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteButton: {
    borderRightWidth: 0,
  },
  deleteButtonText: {
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  locationNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
});

export default AddressBook;
