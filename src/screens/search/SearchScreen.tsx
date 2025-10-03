import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BodyText, Heading2, Button } from '@components';
import { useSearchStore } from '@store/SearchStore';
import { useLocationStore } from '@store/LocationStore';
import { navigate } from '@utils/NavigationUtils';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'ALL' | 'MEDICINE' | 'PHARMACY'>(
    'ALL',
  );

  const {
    searchResults,
    medicineResults,
    pharmacyResults,
    isSearching,
    suggestions,
    trendingSearches,
    searchHistory,
    universalSearch,
    getSearchSuggestions,
    getTrendingSearches,
    clearSearchResults,
  } = useSearchStore();

  const { currentLocation } = useLocationStore();

  useEffect(() => {
    getTrendingSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      getSearchSuggestions(
        searchQuery,
        searchType === 'ALL' ? 'MEDICINE' : searchType,
      );
    }
  }, [searchQuery, searchType]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await universalSearch(searchQuery.trim(), searchType);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    universalSearch(suggestion, searchType);
  };

  const renderSearchTypeButton = (
    type: 'ALL' | 'MEDICINE' | 'PHARMACY',
    label: string,
  ) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        searchType === type && styles.activeTypeButton,
      ]}
      onPress={() => setSearchType(type)}
    >
      <BodyText color={searchType === type ? 'white' : 'secondary'} size="sm">
        {label}
      </BodyText>
    </TouchableOpacity>
  );

  const renderMedicineItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigate('MedicineDetails', { medicineId: item.id })}
    >
      <View style={styles.itemContent}>
        <Heading2 size="sm" color="primary">
          {item.name}
        </Heading2>
        <BodyText color="secondary" size="sm">
          {item.genericName} • {item.manufacturer}
        </BodyText>
        <View style={styles.priceContainer}>
          <BodyText color="primary" weight="bold">
            ₹{item.discountedPrice}
          </BodyText>
          {item.price !== item.discountedPrice && (
            <BodyText color="secondary" size="sm" style={styles.originalPrice}>
              ₹{item.price}
            </BodyText>
          )}
        </View>
        <BodyText color="secondary" size="xs">
          {item.pharmacy.name} • {item.pharmacy.distance.toFixed(1)} km away
        </BodyText>
      </View>
    </TouchableOpacity>
  );

  const renderPharmacyItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigate('PharmacyDetails', { pharmacyId: item.id })}
    >
      <View style={styles.itemContent}>
        <Heading2 size="sm" color="primary">
          {item.name}
        </Heading2>
        <BodyText color="secondary" size="sm">
          ⭐ {item.rating} • {item.distance.toFixed(1)} km away
        </BodyText>
        <BodyText color="secondary" size="sm">
          Delivery: ₹{item.deliveryFee} • {item.estimatedDeliveryTime} mins
        </BodyText>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <BodyText color="primary">{item}</BodyText>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <BodyText color="secondary" size="sm">
        🔥 {item}
      </BodyText>
    </TouchableOpacity>
  );

  const showSuggestions =
    searchQuery.length > 0 && suggestions.length > 0 && !searchResults;
  const showResults =
    searchResults && (medicineResults.length > 0 || pharmacyResults.length > 0);
  const showTrending =
    !searchQuery && !searchResults && trendingSearches.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Button
          title="← Back"
          variant="ghost"
          size="sm"
          onPress={() => navigate('HomeScreen')}
        />
        <Heading2 color="primary">Search</Heading2>
        <View style={{ width: 60 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, pharmacies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Button
          title="Search"
          size="sm"
          onPress={handleSearch}
          disabled={!searchQuery.trim()}
        />
      </View>

      {/* Search Type Buttons */}
      <View style={styles.typeContainer}>
        {renderSearchTypeButton('ALL', 'All')}
        {renderSearchTypeButton('MEDICINE', 'Medicines')}
        {renderSearchTypeButton('PHARMACY', 'Pharmacies')}
      </View>

      {/* Loading */}
      {isSearching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <BodyText color="secondary" style={styles.loadingText}>
            Searching...
          </BodyText>
        </View>
      )}

      {/* Suggestions */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <BodyText color="secondary" size="sm" style={styles.sectionTitle}>
            Suggestions
          </BodyText>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `suggestion-${index}`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Search Results */}
      {showResults && (
        <FlatList
          style={styles.resultsContainer}
          data={[
            ...(medicineResults || []).map(item => ({
              ...item,
              type: 'medicine',
            })),
            ...(pharmacyResults || []).map(item => ({
              ...item,
              type: 'pharmacy',
            })),
          ]}
          renderItem={({ item }) =>
            item.type === 'medicine'
              ? renderMedicineItem({ item })
              : renderPharmacyItem({ item })
          }
          keyExtractor={item => `${item.type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.resultsHeader}>
              <BodyText color="secondary" size="sm">
                Found{' '}
                {(medicineResults?.length || 0) +
                  (pharmacyResults?.length || 0)}{' '}
                results
              </BodyText>
              <Button
                title="Clear"
                variant="ghost"
                size="sm"
                onPress={clearSearchResults}
              />
            </View>
          )}
        />
      )}

      {/* Trending Searches */}
      {showTrending && (
        <View style={styles.trendingContainer}>
          <BodyText color="secondary" size="sm" style={styles.sectionTitle}>
            Trending Searches
          </BodyText>
          <FlatList
            data={trendingSearches}
            renderItem={renderTrendingItem}
            keyExtractor={(item, index) => `trending-${index}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* No Results */}
      {searchResults &&
        medicineResults.length === 0 &&
        pharmacyResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <BodyText color="secondary" align="center">
              No results found for "{searchQuery}"
            </BodyText>
            <BodyText
              color="secondary"
              size="sm"
              align="center"
              style={styles.noResultsSubtext}
            >
              Try searching with different keywords
            </BodyText>
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTypeButton: {
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  suggestionsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontWeight: '600',
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContent: {
    gap: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  trendingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  trendingItem: {
    flex: 1,
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    alignItems: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsSubtext: {
    marginTop: 8,
  },
});

export default SearchScreen;
