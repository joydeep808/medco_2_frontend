/**
 * Search Filters Modal Component
 * Advanced filtering options for search results
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { SearchFilters } from '@store/SearchStore';
// import Slider from '@react-native-community/slider'; // TODO: Install this package

// Temporary Slider component until the package is installed
const Slider = ({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  ...props
}: any) => (
  <View style={{ height: 40, backgroundColor: '#f0f0f0', borderRadius: 20 }} />
);

export interface SearchFiltersModalProps {
  visible: boolean;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  visible,
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: SearchFilters = {
      sortBy: 'relevance',
      inStock: true,
      nearbyOnly: false,
    };
    setLocalFilters(resetFilters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderPriceRange = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Price Range</Text>
      <View style={styles.priceRangeContainer}>
        <Text style={styles.priceLabel}>
          ₹{localFilters.priceRange?.min || 0} - ₹
          {localFilters.priceRange?.max || 1000}
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Min: ₹{localFilters.priceRange?.min || 0}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000}
            value={localFilters.priceRange?.min || 0}
            onValueChange={value =>
              updateFilter('priceRange', {
                ...localFilters.priceRange,
                min: Math.round(value),
              })
            }
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbStyle={styles.sliderThumb}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Max: ₹{localFilters.priceRange?.max || 1000}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000}
            value={localFilters.priceRange?.max || 1000}
            onValueChange={value =>
              updateFilter('priceRange', {
                ...localFilters.priceRange,
                max: Math.round(value),
              })
            }
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbStyle={styles.sliderThumb}
          />
        </View>
      </View>
    </View>
  );

  const renderAvailabilityFilters = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Availability</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>In Stock Only</Text>
        <Switch
          value={localFilters.inStock || false}
          onValueChange={value => updateFilter('inStock', value)}
          trackColor={{ false: '#ddd', true: '#007AFF' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Nearby Pharmacies Only</Text>
        <Switch
          value={localFilters.nearbyOnly || false}
          onValueChange={value => updateFilter('nearbyOnly', value)}
          trackColor={{ false: '#ddd', true: '#007AFF' }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Prescription Required</Text>
        <Switch
          value={localFilters.prescriptionRequired || false}
          onValueChange={value => updateFilter('prescriptionRequired', value)}
          trackColor={{ false: '#ddd', true: '#007AFF' }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );

  const renderRatingFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Minimum Rating</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              (localFilters.minRating || 0) >= rating &&
                styles.activeRatingButton,
            ]}
            onPress={() => updateFilter('minRating', rating)}
          >
            <Text
              style={[
                styles.ratingButtonText,
                (localFilters.minRating || 0) >= rating &&
                  styles.activeRatingText,
              ]}
            >
              ⭐ {rating}+
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSortOptions = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Sort By</Text>
      <View style={styles.sortContainer}>
        {[
          { key: 'relevance', label: 'Relevance' },
          { key: 'price_low', label: 'Price: Low to High' },
          { key: 'price_high', label: 'Price: High to Low' },
          { key: 'rating', label: 'Rating' },
          { key: 'popularity', label: 'Popularity' },
        ].map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.sortButton,
              localFilters.sortBy === option.key && styles.activeSortButton,
            ]}
            onPress={() => updateFilter('sortBy', option.key)}
          >
            <Text
              style={[
                styles.sortButtonText,
                localFilters.sortBy === option.key && styles.activeSortText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCategoryFilters = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryContainer}>
        {[
          'Pain Relief',
          'Vitamins',
          'Antibiotics',
          'Diabetes Care',
          'Heart Care',
          'Skin Care',
        ].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              localFilters.categories?.includes(category) &&
                styles.activeCategoryChip,
            ]}
            onPress={() => {
              const currentCategories = localFilters.categories || [];
              const updatedCategories = currentCategories.includes(category)
                ? currentCategories.filter(c => c !== category)
                : [...currentCategories, category];
              updateFilter('categories', updatedCategories);
            }}
          >
            <Text
              style={[
                styles.categoryChipText,
                localFilters.categories?.includes(category) &&
                  styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderPriceRange()}
          {renderAvailabilityFilters()}
          {renderRatingFilter()}
          {renderSortOptions()}
          {renderCategoryFilters()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resetText: {
    fontSize: 16,
    color: '#F44336',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  priceRangeContainer: {
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#007AFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeRatingButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeRatingText: {
    color: '#fff',
  },
  sortContainer: {
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  activeSortText: {
    color: '#fff',
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeCategoryChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchFiltersModal;
