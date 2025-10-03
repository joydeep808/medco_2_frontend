/**
 * Location Store
 * Manages location state, saved addresses, and location preferences using Zustand
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import {
  LocationData,
  SavedAddress,
  LocationError,
} from '@services/LocationService';

// MMKV instance for location data persistence
const locationStorage = new MMKV({
  id: 'location-storage',
  encryptionKey: 'medco-location-key',
});

export interface LocationPreferences {
  deliveryRadius: number; // in kilometers
  autoDetectLocation: boolean;
  shareLocationWithPharmacies: boolean;
  locationUpdateFrequency: 'LOW' | 'MEDIUM' | 'HIGH';
  preferredAddressType: 'HOME' | 'WORK' | 'CURRENT';
}

export interface LocationState {
  // Current location
  currentLocation: LocationData | null;
  isLocationLoading: boolean;
  locationError: LocationError | null;

  // Saved addresses
  savedAddresses: SavedAddress[];
  defaultAddress: SavedAddress | null;

  // Location preferences
  preferences: LocationPreferences;

  // Location permissions
  hasLocationPermission: boolean;
  isLocationEnabled: boolean;

  // Actions
  setCurrentLocation: (location: LocationData | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: LocationError | null) => void;

  addSavedAddress: (address: SavedAddress) => void;
  updateSavedAddress: (
    addressId: string,
    updates: Partial<SavedAddress>,
  ) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  updatePreferences: (preferences: Partial<LocationPreferences>) => void;

  setLocationPermission: (hasPermission: boolean) => void;
  setLocationEnabled: (enabled: boolean) => void;

  // Utility actions
  clearLocationData: () => void;
  loadPersistedData: () => void;
  getAddressById: (addressId: string) => SavedAddress | null;
  getAddressesByType: (type: 'HOME' | 'WORK' | 'OTHER') => SavedAddress[];
}

// Default preferences
const defaultPreferences: LocationPreferences = {
  deliveryRadius: 10,
  autoDetectLocation: true,
  shareLocationWithPharmacies: true,
  locationUpdateFrequency: 'MEDIUM',
  preferredAddressType: 'CURRENT',
};

// Load persisted data
const loadPersistedLocation = (): LocationData | null => {
  try {
    const stored = locationStorage.getString('currentLocation');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadPersistedAddresses = (): SavedAddress[] => {
  try {
    const stored = locationStorage.getString('savedAddresses');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadPersistedPreferences = (): LocationPreferences => {
  try {
    const stored = locationStorage.getString('preferences');
    return stored
      ? { ...defaultPreferences, ...JSON.parse(stored) }
      : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
};

const loadDefaultAddress = (addresses: SavedAddress[]): SavedAddress | null => {
  return addresses.find(addr => addr.isDefault) || null;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  // Initial state
  currentLocation: loadPersistedLocation(),
  isLocationLoading: false,
  locationError: null,

  savedAddresses: loadPersistedAddresses(),
  defaultAddress: loadDefaultAddress(loadPersistedAddresses()),

  preferences: loadPersistedPreferences(),

  hasLocationPermission: false,
  isLocationEnabled: false,

  // Location actions
  setCurrentLocation: location => {
    set({ currentLocation: location, locationError: null });

    // Persist current location
    if (location) {
      locationStorage.set('currentLocation', JSON.stringify(location));
    } else {
      locationStorage.delete('currentLocation');
    }
  },

  setLocationLoading: loading => set({ isLocationLoading: loading }),

  setLocationError: error => set({ locationError: error }),

  // Address management
  addSavedAddress: address => {
    const { savedAddresses } = get();
    let updatedAddresses = [...savedAddresses];

    // If this is set as default, remove default from others
    if (address.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false,
      }));
    }

    updatedAddresses.push(address);

    set({
      savedAddresses: updatedAddresses,
      defaultAddress: address.isDefault ? address : get().defaultAddress,
    });

    // Persist addresses
    locationStorage.set('savedAddresses', JSON.stringify(updatedAddresses));
  },

  updateSavedAddress: (addressId, updates) => {
    const { savedAddresses } = get();
    let updatedAddresses = savedAddresses.map(addr =>
      addr.id === addressId ? { ...addr, ...updates } : addr,
    );

    // Handle default address changes
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
    }

    const newDefaultAddress =
      updatedAddresses.find(addr => addr.isDefault) || null;

    set({
      savedAddresses: updatedAddresses,
      defaultAddress: newDefaultAddress,
    });

    // Persist addresses
    locationStorage.set('savedAddresses', JSON.stringify(updatedAddresses));
  },

  deleteSavedAddress: addressId => {
    const { savedAddresses, defaultAddress } = get();
    const updatedAddresses = savedAddresses.filter(
      addr => addr.id !== addressId,
    );

    // If deleted address was default, set first address as default
    let newDefaultAddress = defaultAddress;
    if (defaultAddress?.id === addressId) {
      newDefaultAddress =
        updatedAddresses.length > 0
          ? { ...updatedAddresses[0], isDefault: true }
          : null;

      if (newDefaultAddress) {
        updatedAddresses[0] = newDefaultAddress;
      }
    }

    set({
      savedAddresses: updatedAddresses,
      defaultAddress: newDefaultAddress,
    });

    // Persist addresses
    locationStorage.set('savedAddresses', JSON.stringify(updatedAddresses));
  },

  setDefaultAddress: addressId => {
    const { savedAddresses } = get();
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    const newDefaultAddress =
      updatedAddresses.find(addr => addr.id === addressId) || null;

    set({
      savedAddresses: updatedAddresses,
      defaultAddress: newDefaultAddress,
    });

    // Persist addresses
    locationStorage.set('savedAddresses', JSON.stringify(updatedAddresses));
  },

  // Preferences
  updatePreferences: newPreferences => {
    const updatedPreferences = { ...get().preferences, ...newPreferences };
    set({ preferences: updatedPreferences });

    // Persist preferences
    locationStorage.set('preferences', JSON.stringify(updatedPreferences));
  },

  // Permission and settings
  setLocationPermission: hasPermission =>
    set({ hasLocationPermission: hasPermission }),

  setLocationEnabled: enabled => set({ isLocationEnabled: enabled }),

  // Utility actions
  clearLocationData: () => {
    set({
      currentLocation: null,
      locationError: null,
      savedAddresses: [],
      defaultAddress: null,
    });

    // Clear persisted data
    locationStorage.delete('currentLocation');
    locationStorage.delete('savedAddresses');
  },

  loadPersistedData: () => {
    const currentLocation = loadPersistedLocation();
    const savedAddresses = loadPersistedAddresses();
    const preferences = loadPersistedPreferences();
    const defaultAddress = loadDefaultAddress(savedAddresses);

    set({
      currentLocation,
      savedAddresses,
      preferences,
      defaultAddress,
    });
  },

  getAddressById: addressId => {
    const { savedAddresses } = get();
    return savedAddresses.find(addr => addr.id === addressId) || null;
  },

  getAddressesByType: type => {
    const { savedAddresses } = get();
    return savedAddresses.filter(addr => addr.type === type);
  },
}));

// Selector functions for easy access
export const useCurrentLocation = () =>
  useLocationStore(state => state.currentLocation);
export const useLocationLoading = () =>
  useLocationStore(state => state.isLocationLoading);
export const useLocationError = () =>
  useLocationStore(state => state.locationError);
export const useSavedAddresses = () =>
  useLocationStore(state => state.savedAddresses);
export const useDefaultAddress = () =>
  useLocationStore(state => state.defaultAddress);
export const useLocationPreferences = () =>
  useLocationStore(state => state.preferences);

// Action functions for external use
export const setCurrentLocation = (location: LocationData | null) =>
  useLocationStore.getState().setCurrentLocation(location);

export const setLocationLoading = (loading: boolean) =>
  useLocationStore.getState().setLocationLoading(loading);

export const setLocationError = (error: LocationError | null) =>
  useLocationStore.getState().setLocationError(error);

export const addSavedAddress = (address: SavedAddress) =>
  useLocationStore.getState().addSavedAddress(address);

export const updateLocationPreferences = (
  preferences: Partial<LocationPreferences>,
) => useLocationStore.getState().updatePreferences(preferences);

export default useLocationStore;
