/**
 * Pharmacy Store
 * Manages pharmacy data, search results, and pharmacy-related state using Zustand
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { LocationData } from '@services/LocationService';

// MMKV instance for pharmacy data persistence
const pharmacyStorage = new MMKV({
  id: 'pharmacy-storage',
  encryptionKey: 'medco-pharmacy-key',
});

export interface Pharmacy {
  id: string;
  name: string;
  description?: string;
  address: string;
  location: LocationData;
  phone: string;
  email?: string;
  website?: string;

  // Business details
  licenseNumber: string;
  gstNumber?: string;

  // Ratings and reviews
  rating: number;
  reviewCount: number;

  // Operating hours
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };

  // Services
  services: PharmacyService[];

  // Delivery info
  deliveryInfo: {
    available: boolean;
    freeDeliveryThreshold: number;
    deliveryFee: number;
    estimatedTime: string; // e.g., "30-45 mins"
    deliveryRadius: number; // in kilometers
  };

  // Status
  isOpen: boolean;
  isVerified: boolean;
  isPartner: boolean;

  // Distance from user (calculated)
  distance?: number;

  // Images
  images: string[];
  logo?: string;

  // Offers and promotions
  offers: PharmacyOffer[];

  // Inventory status
  hasInventory: boolean;
  inventoryLastUpdated?: string;

  // Created/Updated timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyService {
  id: string;
  name: string;
  description: string;
  available: boolean;
  price?: number;
}

export interface PharmacyOffer {
  id: string;
  title: string;
  description: string;
  type: 'DISCOUNT' | 'FREE_DELIVERY' | 'CASHBACK' | 'COMBO';
  value: number; // percentage or amount
  minOrderAmount?: number;
  validUntil: string;
  isActive: boolean;
}

export interface PharmacySearchFilters {
  rating?: number;
  maxDistance?: number;
  deliveryAvailable?: boolean;
  isOpen?: boolean;
  hasOffers?: boolean;
  services?: string[];
  sortBy?: 'distance' | 'rating' | 'deliveryTime' | 'deliveryFee';
  sortOrder?: 'asc' | 'desc';
}

export interface PharmacyState {
  // Pharmacy data
  nearbyPharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  searchResults: Pharmacy[];

  // Loading states
  isLoadingNearby: boolean;
  isLoadingSearch: boolean;
  isLoadingPharmacy: boolean;

  // Error states
  nearbyError: string | null;
  searchError: string | null;
  pharmacyError: string | null;

  // Search and filters
  searchQuery: string;
  searchFilters: PharmacySearchFilters;

  // Cache management
  lastFetchLocation: LocationData | null;
  lastFetchTime: number | null;
  cacheExpiryTime: number; // in milliseconds

  // Actions
  setNearbyPharmacies: (pharmacies: Pharmacy[]) => void;
  setSelectedPharmacy: (pharmacy: Pharmacy | null) => void;
  setSearchResults: (results: Pharmacy[]) => void;

  setLoadingNearby: (loading: boolean) => void;
  setLoadingSearch: (loading: boolean) => void;
  setLoadingPharmacy: (loading: boolean) => void;

  setNearbyError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  setPharmacyError: (error: string | null) => void;

  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<PharmacySearchFilters>) => void;
  resetSearchFilters: () => void;

  // Utility actions
  updatePharmacy: (pharmacyId: string, updates: Partial<Pharmacy>) => void;
  addPharmacyToFavorites: (pharmacyId: string) => void;
  removePharmacyFromFavorites: (pharmacyId: string) => void;

  // Cache management
  setCacheData: (location: LocationData, pharmacies: Pharmacy[]) => void;
  isCacheValid: (location: LocationData) => boolean;
  clearCache: () => void;

  // Data loading
  loadPersistedData: () => void;

  // Utility getters
  getPharmacyById: (id: string) => Pharmacy | null;
  getOpenPharmacies: () => Pharmacy[];
  getPharmaciesWithDelivery: () => Pharmacy[];
  getPharmaciesByRating: (minRating: number) => Pharmacy[];
}

// Default search filters
const defaultSearchFilters: PharmacySearchFilters = {
  sortBy: 'distance',
  sortOrder: 'asc',
};

// Cache expiry time (30 minutes)
const CACHE_EXPIRY_TIME = 30 * 60 * 1000;

// Load persisted data
const loadPersistedPharmacies = (): Pharmacy[] => {
  try {
    const stored = pharmacyStorage.getString('nearbyPharmacies');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadPersistedCacheData = (): {
  location: LocationData | null;
  time: number | null;
} => {
  try {
    const location = pharmacyStorage.getString('lastFetchLocation');
    const time = pharmacyStorage.getNumber('lastFetchTime');
    return {
      location: location ? JSON.parse(location) : null,
      time: time || null,
    };
  } catch {
    return { location: null, time: null };
  }
};

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  // Initial state
  nearbyPharmacies: loadPersistedPharmacies(),
  selectedPharmacy: null,
  searchResults: [],

  isLoadingNearby: false,
  isLoadingSearch: false,
  isLoadingPharmacy: false,

  nearbyError: null,
  searchError: null,
  pharmacyError: null,

  searchQuery: '',
  searchFilters: defaultSearchFilters,

  lastFetchLocation: loadPersistedCacheData().location,
  lastFetchTime: loadPersistedCacheData().time,
  cacheExpiryTime: CACHE_EXPIRY_TIME,

  // Basic setters
  setNearbyPharmacies: pharmacies => {
    set({ nearbyPharmacies: pharmacies, nearbyError: null });
    // Persist nearby pharmacies
    pharmacyStorage.set('nearbyPharmacies', JSON.stringify(pharmacies));
  },

  setSelectedPharmacy: pharmacy => set({ selectedPharmacy: pharmacy }),

  setSearchResults: results =>
    set({ searchResults: results, searchError: null }),

  // Loading states
  setLoadingNearby: loading => set({ isLoadingNearby: loading }),
  setLoadingSearch: loading => set({ isLoadingSearch: loading }),
  setLoadingPharmacy: loading => set({ isLoadingPharmacy: loading }),

  // Error states
  setNearbyError: error => set({ nearbyError: error }),
  setSearchError: error => set({ searchError: error }),
  setPharmacyError: error => set({ pharmacyError: error }),

  // Search and filters
  setSearchQuery: query => set({ searchQuery: query }),

  setSearchFilters: filters => {
    const updatedFilters = { ...get().searchFilters, ...filters };
    set({ searchFilters: updatedFilters });
  },

  resetSearchFilters: () => set({ searchFilters: defaultSearchFilters }),

  // Utility actions
  updatePharmacy: (pharmacyId, updates) => {
    const { nearbyPharmacies, searchResults, selectedPharmacy } = get();

    // Update in nearby pharmacies
    const updatedNearby = nearbyPharmacies.map(pharmacy =>
      pharmacy.id === pharmacyId ? { ...pharmacy, ...updates } : pharmacy,
    );

    // Update in search results
    const updatedSearch = searchResults.map(pharmacy =>
      pharmacy.id === pharmacyId ? { ...pharmacy, ...updates } : pharmacy,
    );

    // Update selected pharmacy if it matches
    const updatedSelected =
      selectedPharmacy?.id === pharmacyId
        ? { ...selectedPharmacy, ...updates }
        : selectedPharmacy;

    set({
      nearbyPharmacies: updatedNearby,
      searchResults: updatedSearch,
      selectedPharmacy: updatedSelected,
    });

    // Persist updated nearby pharmacies
    pharmacyStorage.set('nearbyPharmacies', JSON.stringify(updatedNearby));
  },

  addPharmacyToFavorites: pharmacyId => {
    // This would typically involve API call and local storage
    console.log('Add to favorites:', pharmacyId);
  },

  removePharmacyFromFavorites: pharmacyId => {
    // This would typically involve API call and local storage
    console.log('Remove from favorites:', pharmacyId);
  },

  // Cache management
  setCacheData: (location, pharmacies) => {
    const now = Date.now();
    set({
      lastFetchLocation: location,
      lastFetchTime: now,
      nearbyPharmacies: pharmacies,
    });

    // Persist cache data
    pharmacyStorage.set('lastFetchLocation', JSON.stringify(location));
    pharmacyStorage.set('lastFetchTime', now);
    pharmacyStorage.set('nearbyPharmacies', JSON.stringify(pharmacies));
  },

  isCacheValid: location => {
    const { lastFetchLocation, lastFetchTime, cacheExpiryTime } = get();

    if (!lastFetchLocation || !lastFetchTime) {
      return false;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - lastFetchTime > cacheExpiryTime) {
      return false;
    }

    // Check if location has changed significantly (more than 1km)
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      lastFetchLocation.latitude,
      lastFetchLocation.longitude,
    );

    return distance < 1; // Cache valid if within 1km
  },

  clearCache: () => {
    set({
      nearbyPharmacies: [],
      lastFetchLocation: null,
      lastFetchTime: null,
    });

    // Clear persisted cache
    pharmacyStorage.delete('nearbyPharmacies');
    pharmacyStorage.delete('lastFetchLocation');
    pharmacyStorage.delete('lastFetchTime');
  },

  // Data loading
  loadPersistedData: () => {
    const pharmacies = loadPersistedPharmacies();
    const cacheData = loadPersistedCacheData();

    set({
      nearbyPharmacies: pharmacies,
      lastFetchLocation: cacheData.location,
      lastFetchTime: cacheData.time,
    });
  },

  // Utility getters
  getPharmacyById: id => {
    const { nearbyPharmacies, searchResults } = get();
    return (
      nearbyPharmacies.find(p => p.id === id) ||
      searchResults.find(p => p.id === id) ||
      null
    );
  },

  getOpenPharmacies: () => {
    const { nearbyPharmacies } = get();
    return nearbyPharmacies.filter(pharmacy => pharmacy.isOpen);
  },

  getPharmaciesWithDelivery: () => {
    const { nearbyPharmacies } = get();
    return nearbyPharmacies.filter(pharmacy => pharmacy.deliveryInfo.available);
  },

  getPharmaciesByRating: minRating => {
    const { nearbyPharmacies } = get();
    return nearbyPharmacies.filter(pharmacy => pharmacy.rating >= minRating);
  },
}));

// Helper function to calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Selector functions for easy access
export const useNearbyPharmacies = () =>
  usePharmacyStore(state => state.nearbyPharmacies);
export const useSelectedPharmacy = () =>
  usePharmacyStore(state => state.selectedPharmacy);
export const usePharmacySearchResults = () =>
  usePharmacyStore(state => state.searchResults);
export const usePharmacyLoading = () =>
  usePharmacyStore(state => ({
    nearby: state.isLoadingNearby,
    search: state.isLoadingSearch,
    pharmacy: state.isLoadingPharmacy,
  }));

// Action functions for external use
export const setNearbyPharmacies = (pharmacies: Pharmacy[]) =>
  usePharmacyStore.getState().setNearbyPharmacies(pharmacies);

export const setSelectedPharmacy = (pharmacy: Pharmacy | null) =>
  usePharmacyStore.getState().setSelectedPharmacy(pharmacy);

export const updatePharmacy = (
  pharmacyId: string,
  updates: Partial<Pharmacy>,
) => usePharmacyStore.getState().updatePharmacy(pharmacyId, updates);

export default usePharmacyStore;
