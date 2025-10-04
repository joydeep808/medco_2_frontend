import { create } from 'zustand';
import {
  PharmacyService,
  Pharmacy,
  PharmacySearchRequest,
} from '@services/PharmacyService';

export interface PharmacyFilter {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  isOpen?: boolean;
  minRating?: number;
  hasDelivery?: boolean;
  searchQuery?: string;
}

export interface PharmacySearchResult {
  pharmacies: Pharmacy[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: number;
}

interface PharmacyState {
  pharmacies: Pharmacy[];
  nearbyPharmacies: Pharmacy[];
  favoritePharmacies: Pharmacy[];
  recentlyViewedPharmacies: Pharmacy[];
  searchResults: PharmacySearchResult | null;
  currentFilter: PharmacyFilter;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  userLocation: { latitude: number; longitude: number } | null;

  // Actions
  fetchNearbyPharmacies: (
    latitude: number,
    longitude: number,
    radiusKm?: number,
  ) => Promise<void>;
  searchPharmacies: (query: string, filters?: PharmacyFilter) => Promise<void>;
  loadMorePharmacies: () => Promise<void>;
  refreshPharmacies: () => Promise<void>;
  getPharmacyById: (id: number) => Pharmacy | null;
  fetchPharmacyDetails: (id: number) => Promise<Pharmacy | null>;
  addToFavorites: (pharmacyId: number) => void;
  removeFromFavorites: (pharmacyId: number) => void;
  isFavorite: (pharmacyId: number) => boolean;
  addToRecentlyViewed: (pharmacyId: number) => void;
  clearRecentlyViewed: () => void;
  setFilter: (filter: Partial<PharmacyFilter>) => void;
  clearFilters: () => void;
  applyFilters: () => Promise<void>;
  setUserLocation: (latitude: number, longitude: number) => void;
  calculateDistance: (pharmacy: Pharmacy) => number;
  sortPharmacies: (
    pharmacies: Pharmacy[],
    sortBy: 'distance' | 'rating' | 'deliveryFee',
  ) => Pharmacy[];
  getOpenPharmacies: () => Pharmacy[];
  getPharmaciesWithDelivery: () => Pharmacy[];
  clearCache: () => void;
}

// Helper function to calculate distance
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  pharmacies: [],
  nearbyPharmacies: [],
  favoritePharmacies: [],
  recentlyViewedPharmacies: [],
  searchResults: null,
  currentFilter: {},
  searchQuery: '',
  isLoading: false,
  isSearching: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  userLocation: null,

  fetchNearbyPharmacies: async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await PharmacyService.getNearbyPharmacies(
        latitude,
        longitude,
        radiusKm,
      );
      
      if (response.success && response.data) {
        const pharmaciesWithDistance = response.data.content.map(pharmacy => ({
          ...pharmacy,
          distance: calculateDistance(
            latitude,
            longitude,
            pharmacy.address.latitude,
            pharmacy.address.longitude,
          ),
        }));

        set({
          nearbyPharmacies: pharmaciesWithDistance,
          pharmacies: pharmaciesWithDistance,
          userLocation: { latitude, longitude },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch nearby pharmacies',
        isLoading: false,
      });
    }
  },

  searchPharmacies: async (query: string, filters: PharmacyFilter = {}) => {
    set({ isSearching: true, error: null, searchQuery: query });
    try {
      const searchRequest: PharmacySearchRequest = {
        query,
        latitude: filters.latitude || get().userLocation?.latitude || 0,
        longitude: filters.longitude || get().userLocation?.longitude || 0,
        radiusKm: filters.radiusKm,
        isOpen: filters.isOpen,
        minRating: filters.minRating,
        hasDelivery: filters.hasDelivery,
      };

      const response = await PharmacyService.searchPharmacies(searchRequest);
      if (response.success && response.data) {
        set({
          searchResults: {
            pharmacies: response.data.content,
            totalCount: response.data.pagination.totalElements,
            hasMore: response.data.pagination.hasNext,
            nextPage: response.data.pagination.hasNext
              ? response.data.pagination.page + 1
              : undefined,
          },
          currentFilter: { ...filters, searchQuery: query },
          isSearching: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to search pharmacies',
        isSearching: false,
      });
    }
  },

  loadMorePharmacies: async () => {
    const { searchResults, currentPage, hasMore } = get();
    if (!hasMore || !searchResults) return;

    set({ isLoading: true });
    try {
      // Implementation for loading more results
      console.log('Loading more pharmacies...');
    } catch (error: any) {
      set({ error: error.message || 'Failed to load more pharmacies' });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshPharmacies: async () => {
    const { userLocation } = get();
    if (userLocation) {
      await get().fetchNearbyPharmacies(
        userLocation.latitude,
        userLocation.longitude,
      );
    }
  },

  getPharmacyById: (id: number) => {
    const { pharmacies, nearbyPharmacies, searchResults } = get();

    let pharmacy = pharmacies.find(p => p.id === id);
    if (!pharmacy) {
      pharmacy = nearbyPharmacies.find(p => p.id === id);
    }
    if (!pharmacy && searchResults) {
      pharmacy = searchResults.pharmacies.find(p => p.id === id);
    }

    return pharmacy || null;
  },

  fetchPharmacyDetails: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await PharmacyService.getPharmacyDetails(id);
      if (response.success && response.data) {
        get().addToRecentlyViewed(id);
        set({ isLoading: false });
        return response.data;
      }
      return null;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch pharmacy details',
        isLoading: false,
      });
      return null;
    }
  },

  addToFavorites: (pharmacyId: number) => {
    const { favoritePharmacies } = get();
    if (!favoritePharmacies.find(p => p.id === pharmacyId)) {
      const pharmacy = get().getPharmacyById(pharmacyId);
      if (pharmacy) {
        set({ favoritePharmacies: [...favoritePharmacies, pharmacy] });
      }
    }
  },

  removeFromFavorites: (pharmacyId: number) => {
    const { favoritePharmacies } = get();
    const updatedFavorites = favoritePharmacies.filter(
      p => p.id !== pharmacyId,
    );
    set({ favoritePharmacies: updatedFavorites });
  },

  isFavorite: (pharmacyId: number) => {
    const { favoritePharmacies } = get();
    return favoritePharmacies.some(p => p.id === pharmacyId);
  },

  addToRecentlyViewed: (pharmacyId: number) => {
    const { recentlyViewedPharmacies } = get();
    const pharmacy = get().getPharmacyById(pharmacyId);

    if (pharmacy) {
      const filtered = recentlyViewedPharmacies.filter(
        p => p.id !== pharmacyId,
      );
      const updated = [pharmacy, ...filtered].slice(0, 10);
      set({ recentlyViewedPharmacies: updated });
    }
  },

  clearRecentlyViewed: () => {
    set({ recentlyViewedPharmacies: [] });
  },

  setFilter: (filter: Partial<PharmacyFilter>) => {
    set({ currentFilter: { ...get().currentFilter, ...filter } });
  },

  clearFilters: () => {
    set({ currentFilter: {}, searchQuery: '' });
  },

  applyFilters: async () => {
    const { currentFilter, userLocation } = get();
    if (userLocation && currentFilter.searchQuery) {
      await get().searchPharmacies(currentFilter.searchQuery, currentFilter);
    }
  },

  setUserLocation: (latitude: number, longitude: number) => {
    set({ userLocation: { latitude, longitude } });
  },

  calculateDistance: (pharmacy: Pharmacy) => {
    const { userLocation } = get();
    if (!userLocation) return 0;

    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      pharmacy.address.latitude,
      pharmacy.address.longitude,
    );
  },

  sortPharmacies: (
    pharmacies: Pharmacy[],
    sortBy: 'distance' | 'rating' | 'deliveryFee',
  ) => {
    return [...pharmacies].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryFee':
          return a.deliveryFee - b.deliveryFee;
        default:
          return 0;
      }
    });
  },

  getOpenPharmacies: () => {
    const { pharmacies } = get();
    return pharmacies.filter(pharmacy => pharmacy.isOpen);
  },

  getPharmaciesWithDelivery: () => {
    const { pharmacies } = get();
    return pharmacies.filter(pharmacy => pharmacy.deliveryRadius > 0);
  },

  clearCache: () => {
    set({
      favoritePharmacies: [],
      recentlyViewedPharmacies: [],
      searchResults: null,
      pharmacies: [],
      nearbyPharmacies: [],
    });
  },
}));
