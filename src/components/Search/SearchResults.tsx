/**
 * Search Results Component
 * Displays search results with multiple view options and advanced filtering
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Medicine, SearchFilters, useSearchStore } from '@store/SearchStore';
import MedicineCard from '../Medicine/MedicineCard';
import SearchFiltersModal from './SearchFiltersModal';

export interface SearchResultsProps {
  onMedicinePress?: (medicine: Medicine) => void;
  style?: any;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  onMedicinePress,
  style,
}) => {
  const {
    searchResults,
    isSearching,
    searchError,
    activeFilters,
    setFilters,
    applyFilters,
  } = useSearchStore();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const handleMedicinePress = (medicine: Medicine) => {
    if (onMedicinePress) {
      onMedicinePress(medicine);
    }
  };

  const handleFiltersChange = (filters: Partial<SearchFilters>) => {
    setFilters(filters);
    applyFilters();
    setShowFiltersModal(false);
  };

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <MedicineCard
      medicine={item}
      onPress={handleMedicinePress}
      compact={viewMode === 'grid'}
      showPharmacies={true}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.resultInfo}>
        <Text style={styles.resultCount}>
          {searchResults?.totalCount || 0} medicines found
        </Text>
        {searchResults?.searchTime && (
          <Text style={styles.searchTime}>in {searchResults.searchTime}ms</Text>
        )}
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFiltersModal(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filters</Text>
        </TouchableOpacity>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'list' && styles.activeViewButton,
            ]}
            onPress={() => setViewMode('list')}
          >
            <Text style={styles.viewButtonText}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === 'grid' && styles.activeViewButton,
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Text style={styles.viewButtonText}>⊞</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💊</Text>
      <Text style={styles.emptyTitle}>No medicines found</Text>
      <Text style={styles.emptyMessage}>
        Try adjusting your search terms or filters
      </Text>
    </View>
  );

  if (searchError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Search Error</Text>
          <Text style={styles.errorMessage}>{searchError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}

      <FlashList
        data={searchResults?.medicines || []}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        estimatedItemSize={viewMode === 'list' ? 120 : 200}
        numColumns={viewMode === 'grid' ? 2 : 1}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          !searchResults?.medicines?.length
            ? styles.emptyListContainer
            : undefined
        }
      />

      <SearchFiltersModal
        visible={showFiltersModal}
        filters={activeFilters}
        onFiltersChange={handleFiltersChange}
        onClose={() => setShowFiltersModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultInfo: {
    flex: 1,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  searchTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 12,
  },
  filterButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeViewButton: {
    backgroundColor: '#fff',
  },
  viewButtonText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchResults;
