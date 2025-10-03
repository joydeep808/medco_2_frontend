import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BodyText, Heading2, Button } from '@components';
import { usePharmacyStore } from '@store/PharmacyStore.new';
import { useLocationStore } from '@store/LocationStore';
import { navigate } from '@utils/NavigationUtils';

const StoreScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'deliveryFee'>(
    'distance',
  );

  const {
    nearbyPharmacies,
    isLoading,
    error,
    fetchNearbyPharmacies,
    sortPharmacies,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = usePharmacyStore();

  const { currentLocation } = useLocationStore();

  useEffect(() => {
    if (currentLocation) {
      fetchNearbyPharmacies(
        currentLocation.latitude,
        currentLocation.longitude,
      );
    }
  }, [currentLocation]);

  const handleRefresh = async () => {
    if (currentLocation) {
      setRefreshing(true);
      await fetchNearbyPharmacies(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      setRefreshing(false);
    }
  };

  const handleSort = (newSortBy: 'distance' | 'rating' | 'deliveryFee') => {
    setSortBy(newSortBy);
  };

  const toggleFavorite = (pharmacyId: number) => {
    if (isFavorite(pharmacyId)) {
      removeFromFavorites(pharmacyId);
    } else {
      addToFavorites(pharmacyId);
    }
  };

  const sortedPharmacies = sortPharmacies(nearbyPharmacies, sortBy);

  const renderSortButton = (
    type: 'distance' | 'rating' | 'deliveryFee',
    label: string,
  ) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === type && styles.activeSortButton]}
      onPress={() => handleSort(type)}
    >
      <BodyText color={sortBy === type ? 'white' : 'secondary'} size="sm">
        {label}
      </BodyText>
    </TouchableOpacity>
  );

  const renderPharmacyItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.pharmacyItem}
      onPress={() => navigate('PharmacyDetails', { pharmacyId: item.id })}
    >
      <View style={styles.pharmacyHeader}>
        <View style={styles.pharmacyInfo}>
          <Heading2 size="md" color="primary">
            {item.name}
          </Heading2>
          <BodyText color="secondary" size="sm">
            {item.address.area}, {item.address.city}
          </BodyText>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <BodyText size="lg">{isFavorite(item.id) ? '❤️' : '🤍'}</BodyText>
        </TouchableOpacity>
      </View>

      <View style={styles.pharmacyDetails}>
        <View style={styles.detailRow}>
          <BodyText color="secondary" size="sm">
            ⭐ {item.rating} ({item.totalRatings} reviews)
          </BodyText>
          <BodyText color="secondary" size="sm">
            📍 {item.distance?.toFixed(1)} km away
          </BodyText>
        </View>

        <View style={styles.detailRow}>
          <BodyText color="secondary" size="sm">
            🚚 Delivery: ₹{item.deliveryFee}
          </BodyText>
          <BodyText color="secondary" size="sm">
            ⏱️ {item.estimatedDeliveryTime} mins
          </BodyText>
        </View>

        <View style={styles.detailRow}>
          <BodyText color="secondary" size="sm">
            💰 Min order: ₹{item.minimumOrderAmount}
          </BodyText>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.isOpen ? '#34C759' : '#FF3B30' },
              ]}
            >
              <BodyText color="white" size="xs" weight="bold">
                {item.isOpen ? 'Open' : 'Closed'}
              </BodyText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.pharmacyActions}>
        <Button
          title="View Store"
          variant="outline"
          size="sm"
          onPress={() => navigate('PharmacyDetails', { pharmacyId: item.id })}
        />
        <Button
          title="Browse Medicines"
          size="sm"
          onPress={() => navigate('Search', { pharmacyId: item.id })}
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BodyText color="secondary" align="center" size="lg">
        🏪
      </BodyText>
      <BodyText color="secondary" align="center" style={styles.emptyTitle}>
        No pharmacies found
      </BodyText>
      <BodyText color="secondary" align="center" size="sm">
        We couldn't find any pharmacies in your area
      </BodyText>
      <Button
        title="Refresh"
        style={styles.emptyButton}
        onPress={handleRefresh}
      />
    </View>
  );

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
        <Heading2 color="primary">Nearby Pharmacies</Heading2>
        <View style={{ width: 60 }} />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <BodyText color="secondary" size="sm" style={styles.sortLabel}>
          Sort by:
        </BodyText>
        {renderSortButton('distance', 'Distance')}
        {renderSortButton('rating', 'Rating')}
        {renderSortButton('deliveryFee', 'Delivery Fee')}
      </View>

      {/* Loading */}
      {isLoading && nearbyPharmacies.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <BodyText color="secondary" style={styles.loadingText}>
            Finding nearby pharmacies...
          </BodyText>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <BodyText color="error" align="center">
            {error}
          </BodyText>
          <Button
            title="Retry"
            variant="outline"
            size="sm"
            onPress={handleRefresh}
            style={styles.retryButton}
          />
        </View>
      )}

      {/* Pharmacies List */}
      {!isLoading && !error && (
        <FlatList
          data={sortedPharmacies}
          renderItem={renderPharmacyItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            sortedPharmacies.length === 0
              ? styles.emptyListContainer
              : undefined
          }
          ListHeaderComponent={() =>
            sortedPharmacies.length > 0 ? (
              <View style={styles.listHeader}>
                <BodyText color="secondary" size="sm">
                  Found {sortedPharmacies.length} pharmacies nearby
                </BodyText>
              </View>
            ) : null
          }
        />
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortLabel: {
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
  },
  pharmacyItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pharmacyInfo: {
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  pharmacyDetails: {
    marginBottom: 16,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pharmacyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyButton: {
    marginTop: 24,
  },
});

export default StoreScreen;
