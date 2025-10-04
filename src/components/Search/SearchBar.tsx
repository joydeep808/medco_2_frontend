/**
 * Search Bar Component
 * Advanced search bar with voice search, barcode scanning, and suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { useSearchStore, SearchSuggestion } from '@store/SearchStore';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionPress?: (suggestion: SearchSuggestion) => void;
  showVoiceSearch?: boolean;
  showBarcodeScanner?: boolean;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  style?: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search medicines, pharmacies...',
  onSearch,
  onSuggestionPress,
  showVoiceSearch = true,
  showBarcodeScanner = true,
  showSuggestions = true,
  autoFocus = false,
  style,
}) => {
  const {
    currentQuery,
    suggestions,
    isLoadingSuggestions,
    recentSearches,
    trendingSearches,
    setCurrentQuery,
    loadSuggestions,
    clearSuggestions,
    performSearch,
  } = useSearchStore();

  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const suggestionHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentQuery.length > 0 && isFocused) {
      loadSuggestions(currentQuery);
      setShowSuggestionsList(true);
      animateSuggestions(true);
    } else {
      setShowSuggestionsList(false);
      animateSuggestions(false);
    }
  }, [currentQuery, isFocused]);

  const animateSuggestions = (show: boolean) => {
    Animated.timing(suggestionHeight, {
      toValue: show ? 300 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleTextChange = (text: string) => {
    setCurrentQuery(text);
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query || currentQuery;
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
      setShowSuggestionsList(false);
      animateSuggestions(false);
      Keyboard.dismiss();
    }
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setCurrentQuery(suggestion.text);
    handleSearch(suggestion.text);
    if (onSuggestionPress) {
      onSuggestionPress(suggestion);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setCurrentQuery(query);
    handleSearch(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (currentQuery.length === 0) {
      setShowSuggestionsList(true);
      animateSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion tap
    setTimeout(() => {
      setShowSuggestionsList(false);
      animateSuggestions(false);
    }, 150);
  };

  const handleClear = () => {
    setCurrentQuery('');
    clearSuggestions();
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    // Voice search implementation would go here
    console.log('Voice search pressed');
  };

  const handleBarcodeScanner = () => {
    // Barcode scanner implementation would go here
    console.log('Barcode scanner pressed');
  };

  const renderSuggestionItem = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionIcon}>
          {item.icon || getSuggestionIcon(item.type)}
        </Text>
        <View style={styles.suggestionTextContainer}>
          <Text style={styles.suggestionText}>{item.text}</Text>
          <Text style={styles.suggestionCount}>
            {item.count} {item.type.toLowerCase()}s found
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Text style={styles.recentIcon}>🕒</Text>
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => handleRecentSearchPress(item.query)}
    >
      <Text style={styles.trendingIcon}>🔥</Text>
      <Text style={styles.trendingText}>{item.query}</Text>
      <Text style={styles.trendingCount}>{item.count}</Text>
    </TouchableOpacity>
  );

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'MEDICINE':
        return '💊';
      case 'CATEGORY':
        return '🏥';
      case 'BRAND':
        return '🏷️';
      case 'GENERIC':
        return '🧬';
      default:
        return '🔍';
    }
  };

  const renderSuggestionsList = () => {
    if (!showSuggestionsList) return null;

    return (
      <Animated.View
        style={[styles.suggestionsContainer, { height: suggestionHeight }]}
      >
        {currentQuery.length > 0 ? (
          // Show search suggestions
          <View style={styles.suggestionsContent}>
            {isLoadingSuggestions ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <View style={styles.noSuggestionsContainer}>
                <Text style={styles.noSuggestionsText}>
                  No suggestions found for "{currentQuery}"
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Show recent searches and trending
          <View style={styles.suggestionsContent}>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <FlatList
                  data={recentSearches.slice(0, 5)}
                  renderItem={renderRecentSearchItem}
                  keyExtractor={(item, index) => `recent-${index}`}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}

            {trendingSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending</Text>
                <FlatList
                  data={trendingSearches.slice(0, 5)}
                  renderItem={renderTrendingItem}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchBarContainer}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={currentQuery}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus={autoFocus}
            autoCorrect={false}
            autoCapitalize="none"
          />

          {currentQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionButtons}>
            {showVoiceSearch && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleVoiceSearch}
              >
                <Text style={styles.actionIcon}>🎤</Text>
              </TouchableOpacity>
            )}

            {showBarcodeScanner && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBarcodeScanner}
              >
                <Text style={styles.actionIcon}>📷</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showSuggestions && renderSuggestionsList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchBarFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  suggestionsContent: {
    flex: 1,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  suggestionCount: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  noSuggestionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  recentIcon: {
    fontSize: 14,
    marginRight: 12,
    color: '#666',
  },
  recentText: {
    fontSize: 14,
    color: '#333',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  trendingIcon: {
    fontSize: 14,
    marginRight: 12,
  },
  trendingText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  trendingCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default SearchBar;
