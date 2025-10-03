/**
 * Pharmacy Card Component
 * Displays pharmacy information with rating, distance, delivery info, and operating hours
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Pharmacy } from '@store/PharmacyStore';

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onPress?: (pharmacy: Pharmacy) => void;
  showDistance?: boolean;
  compact?: boolean;
  style?: any;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  onPress,
  showDistance = true,
  compact = false,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(pharmacy);
    }
  };

  const getStatusColor = () => {
    if (!pharmacy.isOpen) return '#F44336';
    if (!pharmacy.deliveryInfo.available) return '#FF9800';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (!pharmacy.isOpen) return 'Closed';
    if (!pharmacy.deliveryInfo.available) return 'Pickup Only';
    return 'Open';
  };

  const formatDeliveryTime = () => {
    if (!pharmacy.deliveryInfo.available) return 'Pickup only';
    return `Delivery in ${pharmacy.deliveryInfo.estimatedTime}`;
  };

  const formatDeliveryFee = () => {
    if (!pharmacy.deliveryInfo.available) return '';
    if (pharmacy.deliveryInfo.deliveryFee === 0) return 'Free delivery';
    return `₹${pharmacy.deliveryInfo.deliveryFee} delivery fee`;
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>⭐ {pharmacy.rating.toFixed(1)}</Text>
      <Text style={styles.reviewText}>({pharmacy.reviewCount})</Text>
    </View>
  );

  const renderOffers = () => {
    const activeOffers = pharmacy.offers.filter(offer => offer.isActive);
    if (activeOffers.length === 0) return null;

    return (
      <View style={styles.offersContainer}>
        {activeOffers.slice(0, 2).map((offer, index) => (
          <View key={offer.id} style={styles.offerBadge}>
            <Text style={styles.offerText}>
              {offer.type === 'DISCOUNT' ? `${offer.value}% OFF` : offer.title}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderServices = () => {
    const availableServices = pharmacy.services.filter(
      service => service.available,
    );
    if (availableServices.length === 0) return null;

    return (
      <View style={styles.servicesContainer}>
        {availableServices.slice(0, 3).map((service, index) => (
          <Text key={service.id} style={styles.serviceText}>
            {service.name}
            {index < Math.min(availableServices.length - 1, 2) && ' • '}
          </Text>
        ))}
      </View>
    );
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={styles.compactName} numberOfLines={1}>
              {pharmacy.name}
            </Text>
            <View
              style={[
                styles.compactStatus,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.compactStatusText}>{getStatusText()}</Text>
            </View>
          </View>

          <View style={styles.compactInfo}>
            {renderRating()}
            {showDistance && pharmacy.distance && (
              <Text style={styles.compactDistance}>
                📍 {pharmacy.distance.toFixed(1)} km
              </Text>
            )}
          </View>

          <Text style={styles.compactDelivery} numberOfLines={1}>
            {formatDeliveryTime()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Pharmacy Image */}
      <View style={styles.imageContainer}>
        {pharmacy.logo ? (
          <Image
            source={{ uri: pharmacy.logo }}
            style={styles.pharmacyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🏥</Text>
          </View>
        )}

        {/* Status Badge */}
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>

        {/* Verified Badge */}
        {pharmacy.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>

      {/* Pharmacy Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pharmacyName} numberOfLines={1}>
            {pharmacy.name}
          </Text>
          {renderRating()}
        </View>

        <Text style={styles.address} numberOfLines={2}>
          {pharmacy.address}
        </Text>

        {/* Distance and Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryRow}>
            {showDistance && pharmacy.distance && (
              <Text style={styles.distance}>
                📍 {pharmacy.distance.toFixed(1)} km away
              </Text>
            )}
            <Text style={styles.deliveryTime}>{formatDeliveryTime()}</Text>
          </View>

          {pharmacy.deliveryInfo.available && (
            <Text style={styles.deliveryFee}>{formatDeliveryFee()}</Text>
          )}
        </View>

        {/* Services */}
        {renderServices()}

        {/* Offers */}
        {renderOffers()}

        {/* Operating Hours */}
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursText}>
            {pharmacy.isOpen ? '🕒 Open now' : '🕒 Closed'}
          </Text>
          {pharmacy.operatingHours.today && (
            <Text style={styles.hoursDetail}>
              {pharmacy.operatingHours.today.open} -{' '}
              {pharmacy.operatingHours.today.close}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  compactCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  pharmacyImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  reviewText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  deliveryInfo: {
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  deliveryFee: {
    fontSize: 12,
    color: '#666',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 12,
    color: '#666',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  offerBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  offerText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 12,
    color: '#666',
  },
  hoursDetail: {
    fontSize: 12,
    color: '#666',
  },
  // Compact styles
  compactContent: {
    flex: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  compactStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  compactStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  compactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactDistance: {
    fontSize: 12,
    color: '#666',
  },
  compactDelivery: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default PharmacyCard;
