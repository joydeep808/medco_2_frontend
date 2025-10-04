/**
 * Pharmacy List Component
 * High-performance pharmacy list using FlashList with infinite scrolling and filtering
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Pharmacy, PharmacySearchFilters } from '@store/PharmacyStore';
import PharmacyCard from './PharmacyCard';

export interface PharmacyListProps {
  pharmacies: Pharmacy[];
  onPharmacyPress?: (pharmacy: Pharmacy) => void;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  hasMore?: boolean;
  showFilters?: boolean;
  filters?: PharmacySearchFilters;
  onFiltersChange?: (filters: PharmacySearchFilters) => void;
  emptyMessage?: string;
  style?: any;
}

export const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  onPharmacyPress,
  onLoadMore,
  onRefresh,
  isLoading = false,
  isRefreshing = false,
  hasMore = false,
  showFilters = true,
  filters,
  onFiltersChange,
  emptyMessage = 'No pharmacies found in your area',
  style,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Memoized filtered and sorted pharmacies
  const processedPharmacies = useMemo(() => {
    let result = [...pharmacies];

    // Apply filters
    if (filters) {
      if (filters.rating) {
        result = result.filter(pharmacy => pharmacy.rating >= filters.rating!);
      }

      if (filters.maxDistance) {
        result = result.filter(
          pharmacy =>
            !pharmacy.distance || pharmacy.distance <= filters.maxDistance!,
        );
      }

      if (filters.deliveryAvailable) {
        result = result.filter(pharmacy => pharmacy.deliveryInfo.available);
      }

      if (filters.isOpen) {
        result = result.filter(pharmacy => pharmacy.isOpen);
      }

      if (filters.hasOffers) {
        result = result.filter(pharmacy =>
          pharmacy.offers.some(offer => offer.isActive),
        );
      }
    }

    // Apply sorting
    if (filters?.sortBy) {
      result.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;

        switch (filters.sortBy) {
          case 'distance':
            return ((a.distance || 0) - (b.distance || 0)) * order;
          case 'rating':
            return (b.rating - a.rating) * order;
          case 'deliveryTime':
            // Simple comparison based on estimated time string
            return (
              a.deliveryInfo.estimatedTime.localeCompare(
                b.deliveryInfo.estimatedTime,
              ) * order
            );
          case 'deliveryFee':
            return (
              (a.deliveryInfo.deliveryFee - b.deliveryInfo.deliveryFee) * order
            );
          default:
            return 0;
        }
      });
    }

    return result;
  }, [pharmacies, filters]);

  const renderPharmacyItem = useCallback(
    ({ item }: { item: Pharmacy }) => (
      <PharmacyCard
        pharmacy={item}
        onPress={onPharmacyPress}
        showDistance={true}
      />
    ),
    [onPharmacyPress],
  );

  const renderLoadingFooter = useCallback(() => {
    if (!isLoading || !hasMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more pharmacies...</Text>
      </View>
    );
  }, [isLoading, hasMore]);

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏥</Text>
        <Text style={styles.emptyTitle}>No Pharmacies Found</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        {onRefresh && (
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [emptyMessage, onRefresh],
  );

  const renderFilterBar = () => {
    if (!showFilters) return null;

    const activeFilterCount = getActiveFilterCount();

    return (
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => toggleSort('distance')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters?.sortBy === 'distance' && styles.activeSortText,
              ]}
            >
              Distance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => toggleSort('rating')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters?.sortBy === 'rating' && styles.activeSortText,
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getActiveFilterCount = (): number => {
    if (!filters) return 0;

    let count = 0;
    if (filters.rating && filters.rating > 0) count++;
    if (filters.maxDistance) count++;
    if (filters.deliveryAvailable) count++;
    if (filters.isOpen) count++;
    if (filters.hasOffers) count++;

    return count;
  };

  const toggleSort = (sortBy: PharmacySearchFilters['sortBy']) => {
    if (!onFiltersChange) return;

    const newFilters = { ...filters };

    if (newFilters.sortBy === sortBy) {
      // Toggle sort order
      newFilters.sortOrder = newFilters.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Change sort field
      newFilters.sortBy = sortBy;
      newFilters.sortOrder = 'asc';
    }

    onFiltersChange(newFilters);
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  const keyExtractor = useCallback((item: Pharmacy) => item.id, []);

  const getItemType = useCallback((item: Pharmacy) => {
    // FlashList optimization: return different types for different layouts
    return 'pharmacy';
  }, []);

  const estimatedItemSize = 200; // Estimated height of PharmacyCard

  return (
    <View style={[styles.container, style]}>
      {renderFilterBar()}

      <FlashList
        data={processedPharmacies}
        renderItem={renderPharmacyItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderLoadingFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          processedPharmacies.length === 0
            ? styles.emptyListContainer
            : undefined
        }
      />

      {/* Filter Modal would go here */}
      {/* This would be a separate component for advanced filtering */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  filterButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PharmacyList;
