import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SearchService,
  UniversalSearchRequest,
  UniversalSearchResponse,
} from '@services/SearchService';
import {
  MedicineService,
  MedicineSearchRequest,
} from '@services/MedicineService';

// Export types for components
export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  requiresPrescription: boolean;
  isActive: boolean;
  variants: Array<{
    id: number;
    strength: string;
    form: string;
    packSize: number;
    price: number;
    discountedPrice: number;
    stock: number;
    expiryDate: number;
    batchNumber: string;
    isActive: boolean;
    pharmacy: {
      id: number;
      name: string;
      distance: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  // Additional properties for MedicineCard
  images?: string[];
  brand?: string;
  strength?: string;
  form?: string;
  availablePharmacies?: string[];
  totalStock?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  reviewCount?: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  requiresPrescription?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  nearbyOnly?: boolean;
  prescriptionRequired?: boolean;
  minRating?: number;
  sortBy?: string;
  categories?: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'medicine' | 'pharmacy' | 'category';
  icon?: string;
  count?: number;
}

interface SearchState {
  // Search results
  searchResults: UniversalSearchResponse | null;
  medicineResults: any[];
  pharmacyResults: any[];

  // Search state
  searchQuery: string;
  currentQuery: string;
  searchType: 'ALL' | 'MEDICINE' | 'PHARMACY';
  isSearching: boolean;
  isLoadingSuggestions: boolean;
  error: string | null;
  searchError: string | null;

  // Search history and suggestions
  searchHistory: string[];
  recentSearches: string[];
  suggestions: SearchSuggestion[];
  trendingSearches: string[];

  // Filters
  searchFilters: {
    minPrice?: number;
    maxPrice?: number;
    requiresPrescription?: boolean;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  };
  activeFilters: SearchFilters;

  // Actions
  universalSearch: (
    query: string,
    type?: 'ALL' | 'MEDICINE' | 'PHARMACY',
  ) => Promise<void>;
  searchMedicines: (request: MedicineSearchRequest) => Promise<void>;
  getSearchSuggestions: (
    query: string,
    type?: 'MEDICINE' | 'PHARMACY',
  ) => Promise<void>;
  getTrendingSearches: () => Promise<void>;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setSearchFilters: (filters: Partial<SearchState['searchFilters']>) => void;
  clearSearchFilters: () => void;
  clearSearchResults: () => void;

  // New missing actions
  setCurrentQuery: (query: string) => void;
  loadSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  performSearch: (query: string) => Promise<void>;
  setFilters: (filters: Partial<SearchFilters>) => void;
  applyFilters: () => Promise<void>;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchResults: null,
      medicineResults: [],
      pharmacyResults: [],
      searchQuery: '',
      currentQuery: '',
      searchType: 'ALL',
      isSearching: false,
      isLoadingSuggestions: false,
      error: null,
      searchError: null,
      searchHistory: [],
      recentSearches: [],
      suggestions: [],
      trendingSearches: [],
      searchFilters: {},
      activeFilters: {},

      universalSearch: async (
        query: string,
        type: 'ALL' | 'MEDICINE' | 'PHARMACY' = 'ALL',
      ) => {
        set({
          isSearching: true,
          error: null,
          searchQuery: query,
          searchType: type,
        });

        try {
          const { searchFilters } = get();
          const request: UniversalSearchRequest = {
            query,
            type,
            latitude: searchFilters.latitude,
            longitude: searchFilters.longitude,
            radiusKm: searchFilters.radiusKm,
            filters: {
              minPrice: searchFilters.minPrice,
              maxPrice: searchFilters.maxPrice,
              requiresPrescription: searchFilters.requiresPrescription,
            },
          };

          const response = await SearchService.universalSearch(request);
          if (response.success && response.data) {
            set({
              searchResults: response.data,
              medicineResults: response.data.medicines,
              pharmacyResults: response.data.pharmacies,
              isSearching: false,
            });

            // Add to search history
            get().addToSearchHistory(query);
          }
        } catch (error: any) {
          set({ error: error.message || 'Search failed', isSearching: false });
        }
      },

      searchMedicines: async (request: MedicineSearchRequest) => {
        set({ isSearching: true, error: null });

        try {
          const response = await MedicineService.searchMedicines(request);
          if (response.success && response.data) {
            set({
              medicineResults: response.data.content,
              isSearching: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.message || 'Medicine search failed',
            isSearching: false,
          });
        }
      },

      getSearchSuggestions: async (
        query: string,
        type: 'MEDICINE' | 'PHARMACY' = 'MEDICINE',
      ) => {
        try {
          const response = await SearchService.getSearchSuggestions(
            query,
            type,
          );
          if (response.success && response.data) {
            const suggestionObjects = response.data.map(
              (text: string, index: number) => ({
                id: index.toString(),
                text,
                type: 'medicine' as const,
              }),
            );
            set({ suggestions: suggestionObjects });
          }
        } catch (error: any) {
          console.error('Failed to get search suggestions:', error);
        }
      },

      getTrendingSearches: async () => {
        try {
          const response = await SearchService.getTrendingSearches();
          if (response.success && response.data) {
            set({ trendingSearches: response.data });
          }
        } catch (error: any) {
          console.error('Failed to get trending searches:', error);
        }
      },

      addToSearchHistory: (query: string) => {
        const { searchHistory } = get();
        const trimmedQuery = query.trim();

        if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
          const updatedHistory = [trimmedQuery, ...searchHistory].slice(0, 20); // Keep last 20 searches
          set({ searchHistory: updatedHistory });
        }
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      setSearchFilters: filters => {
        const { searchFilters } = get();
        set({ searchFilters: { ...searchFilters, ...filters } });
      },

      clearSearchFilters: () => {
        set({ searchFilters: {} });
      },

      clearSearchResults: () => {
        set({
          searchResults: null,
          medicineResults: [],
          pharmacyResults: [],
          searchQuery: '',
          error: null,
        });
      },

      // New missing action implementations
      setCurrentQuery: (query: string) => {
        set({ currentQuery: query });
      },

      loadSuggestions: async (query: string) => {
        if (!query.trim()) {
          set({ suggestions: [] });
          return;
        }

        set({ isLoadingSuggestions: true });
        try {
          await get().getSearchSuggestions(query, 'MEDICINE');
        } catch (error) {
          console.error('Failed to load suggestions:', error);
        } finally {
          set({ isLoadingSuggestions: false });
        }
      },

      clearSuggestions: () => {
        set({ suggestions: [] });
      },

      performSearch: async (query: string) => {
        if (!query.trim()) return;

        // Add to search history
        get().addToSearchHistory(query);

        // Update recent searches
        const { recentSearches } = get();
        const updatedRecent = [
          query,
          ...recentSearches.filter(q => q !== query),
        ].slice(0, 10);
        set({ recentSearches: updatedRecent });

        // Perform the search
        await get().universalSearch(query);
      },

      setFilters: (filters: Partial<SearchFilters>) => {
        const { activeFilters } = get();
        set({ activeFilters: { ...activeFilters, ...filters } });
      },

      applyFilters: async () => {
        const { currentQuery, activeFilters } = get();
        if (currentQuery.trim()) {
          // Re-run search with filters
          await get().universalSearch(currentQuery);
        }
      },
    }),
    {
      name: 'search-storage',
      partialize: state => ({
        searchHistory: state.searchHistory,
        trendingSearches: state.trendingSearches,
        searchFilters: state.searchFilters,
      }),
    },
  ),
);
