/**
 * Nearby Pharmacies Component
 * Displays nearby pharmacies with FlashList optimization
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Pharmacy } from '@store/PharmacyStore';
import PharmacyCard from '../Pharmacy/PharmacyCard';

export interface NearbyPharmaciesProps {
  pharmacies: Pharmacy[];
  isLoading?: boolean;
  onPharmacyPress?: (pharmacy: Pharmacy) => void;
  onViewAll?: () => void;
  style?: any;
}

export const NearbyPharmacies: React.FC<NearbyPharmaciesProps> = ({
  pharmacies,
  isLoading = false,
  onPharmacyPress,
  onViewAll,
  style,
}) => {
  const handlePharmacyPress = (pharmacy: Pharmacy) => {
    if (onPharmacyPress) {
      onPharmacyPress(pharmacy);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all pharmacies');
    }
  };

  const renderPharmacyItem = ({ item }: { item: Pharmacy }) => (
    <PharmacyCard
      pharmacy={item}
      onPress={handlePharmacyPress}
      compact={true}
      showDistance={true}
      style={styles.pharmacyCard}
    />
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Finding nearby pharmacies...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏥</Text>
      <Text style={styles.emptyTitle}>No pharmacies found</Text>
      <Text style={styles.emptyMessage}>
        We couldn't find any pharmacies in your area. Try expanding your search
        radius.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => console.log('Retry')}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderViewAllButton = () => (
    <TouchableOpacity
      style={styles.viewAllCard}
      onPress={handleViewAll}
      activeOpacity={0.7}
    >
      <Text style={styles.viewAllIcon}>🔍</Text>
      <Text style={styles.viewAllText}>View All</Text>
      <Text style={styles.viewAllSubtext}>See more pharmacies</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        {renderLoadingState()}
      </View>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllHeaderText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={pharmacies.slice(0, 10)} // Show only first 10 for performance
        renderItem={renderPharmacyItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={280}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          pharmacies.length > 10 ? renderViewAllButton : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllHeaderText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  pharmacyCard: {
    width: 280,
    marginRight: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    marginLeft: 12,
  },
  viewAllIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  viewAllSubtext: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default NearbyPharmacies;
