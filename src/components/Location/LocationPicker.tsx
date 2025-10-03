/**
 * Location Picker Component
 * Allows users to select their location with current location detection and manual selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import LocationService, {
  LocationData,
  AddressSearchResult,
  LocationError,
  LocationErrorType,
} from '@services/LocationService';
import { useLocationStore } from '@store/LocationStore';

export interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData;
  showCurrentLocation?: boolean;
  placeholder?: string;
  style?: any;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  currentLocation,
  showCurrentLocation = true,
  placeholder = 'Search for area, street name...',
  style,
}) => {
  const {
    currentLocation: storeLocation,
    setCurrentLocation,
    setLocationLoading,
    setLocationError,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const displayLocation = currentLocation || storeLocation;

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchAddresses();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const searchAddresses = async () => {
    setIsSearching(true);
    try {
      const results = await LocationService.searchAddresses(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Address search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocationPress = async () => {
    setIsDetectingLocation(true);
    setLocationLoading(true);

    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation(location);
      onLocationSelect(location);
      setLocationError(null);
    } catch (error) {
      const locationError = error as LocationError;
      setLocationError(locationError);

      // Show user-friendly error message
      let errorMessage = 'Unable to detect your location.';
      let actionText = 'Try Again';

      switch (locationError.type) {
        case LocationErrorType.PERMISSION_DENIED:
          errorMessage =
            'Location permission is required to find nearby pharmacies. Please enable location access in your device settings.';
          actionText = 'Open Settings';

          break;
        case LocationErrorType.LOCATION_UNAVAILABLE:
          errorMessage =
            'Location services are not available. Please check your GPS settings.';
          break;
        case LocationErrorType.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage = 'Unable to detect your location. Please try again.';
      }

      Alert.alert('Location Error', errorMessage, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText,
          onPress: () => {
            if (locationError.type === LocationErrorType.PERMISSION_DENIED) {
              LocationService.showLocationSettingsDialog();
            } else {
              handleCurrentLocationPress();
            }
          },
        },
      ]);
    } finally {
      setIsDetectingLocation(false);
      setLocationLoading(false);
    }
  };

  const handleAddressSelect = async (result: AddressSearchResult) => {
    try {
      const locationData = await LocationService.getAddressDetails(
        result.placeId,
      );
      onLocationSelect(locationData);
      setSearchQuery('');
      setShowResults(false);
    } catch (error) {
      Alert.alert('Error', 'Unable to get address details. Please try again.');
    }
  };

  const renderSearchResult = ({ item }: { item: AddressSearchResult }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleAddressSelect(item)}
    >
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultMain}>{item.mainText}</Text>
        <Text style={styles.searchResultSecondary}>{item.secondaryText}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Current Location Display */}
      {displayLocation && (
        <View style={styles.currentLocationContainer}>
          <Text style={styles.currentLocationLabel}>Current Location</Text>
          <Text style={styles.currentLocationText}>
            {LocationService.formatAddress(displayLocation, true)}
          </Text>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {isSearching && (
          <ActivityIndicator
            size="small"
            color="#007AFF"
            style={styles.searchLoader}
          />
        )}
      </View>

      {/* Current Location Button */}
      {showCurrentLocation && (
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleCurrentLocationPress}
          disabled={isDetectingLocation}
        >
          {isDetectingLocation ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.currentLocationButtonText}>
              📍 Use Current Location
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={item => item.placeId}
            style={styles.searchResultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && !isSearching && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No locations found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  currentLocationContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 16,
  },
  currentLocationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  currentLocationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  searchLoader: {
    marginLeft: 8,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 12,
  },
  currentLocationButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultMain: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  searchResultSecondary: {
    fontSize: 14,
    color: '#666',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default LocationPicker;
