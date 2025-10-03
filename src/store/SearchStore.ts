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

interface SearchState {
  // Search results
  searchResults: UniversalSearchResponse | null;
  medicineResults: any[];
  pharmacyResults: any[];

  // Search state
  searchQuery: string;
  searchType: 'ALL' | 'MEDICINE' | 'PHARMACY';
  isSearching: boolean;
  error: string | null;

  // Search history and suggestions
  searchHistory: string[];
  suggestions: string[];
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
  setSearchFilters: (filters: Partial<typeof searchFilters>) => void;
  clearSearchFilters: () => void;
  clearSearchResults: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchResults: null,
      medicineResults: [],
      pharmacyResults: [],
      searchQuery: '',
      searchType: 'ALL',
      isSearching: false,
      error: null,
      searchHistory: [],
      suggestions: [],
      trendingSearches: [],
      searchFilters: {},

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
            set({ suggestions: response.data });
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
