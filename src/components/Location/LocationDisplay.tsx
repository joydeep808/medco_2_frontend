/**
 * Location Display Component
 * Compact location display for header areas with location change functionality
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocationStore } from '@store/LocationStore';
import LocationService, { LocationData } from '@services/LocationService';

export interface LocationDisplayProps {
  onLocationPress?: () => void;
  showChangeButton?: boolean;
  compact?: boolean;
  style?: any;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  onLocationPress,
  showChangeButton = true,
  compact = false,
  style,
}) => {
  const { currentLocation, isLocationLoading, locationError } =
    useLocationStore();

  const handleLocationPress = () => {
    if (onLocationPress) {
      onLocationPress();
    }
  };

  const renderLocationContent = () => {
    if (isLocationLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Detecting location...</Text>
        </View>
      );
    }

    if (locationError) {
      return (
        <TouchableOpacity
          style={styles.errorContainer}
          onPress={handleLocationPress}
        >
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Location unavailable</Text>
          {showChangeButton && (
            <Text style={styles.changeText}>Tap to retry</Text>
          )}
        </TouchableOpacity>
      );
    }

    if (!currentLocation) {
      return (
        <TouchableOpacity
          style={styles.noLocationContainer}
          onPress={handleLocationPress}
        >
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.noLocationText}>Select location</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={handleLocationPress}
        disabled={!onLocationPress}
      >
        <View style={styles.locationContent}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationText} numberOfLines={compact ? 1 : 2}>
              {compact
                ? LocationService.formatAddress(currentLocation, true)
                : LocationService.formatAddress(currentLocation, false)}
            </Text>
            {showChangeButton && <Text style={styles.changeText}>Change</Text>}
          </View>
        </View>
        {!compact && currentLocation.accuracy && (
          <View style={styles.accuracyContainer}>
            <View
              style={[
                styles.accuracyIndicator,
                { backgroundColor: getAccuracyColor(currentLocation.accuracy) },
              ]}
            />
            <Text style={styles.accuracyText}>
              Accurate to {Math.round(currentLocation.accuracy)}m
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {renderLocationContent()}
    </View>
  );
};

const getAccuracyColor = (accuracy: number): string => {
  if (accuracy <= 10) return '#4CAF50'; // Green - Very accurate
  if (accuracy <= 50) return '#FF9800'; // Orange - Moderately accurate
  return '#F44336'; // Red - Less accurate
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  compactContainer: {
    padding: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#F44336',
  },
  noLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noLocationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  locationContainer: {
    flex: 1,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  changeText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 24,
  },
  accuracyIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  accuracyText: {
    fontSize: 11,
    color: '#666',
  },
});

export default LocationDisplay;
