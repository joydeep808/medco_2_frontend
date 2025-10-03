/**
 * Medicine Card Component
 * Displays medicine information with pricing, availability, and pharmacy details
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Medicine } from '@store/SearchStore';

export interface MedicineCardProps {
  medicine: Medicine;
  onPress?: (medicine: Medicine) => void;
  onAddToCart?: (medicine: Medicine, pharmacyId: string) => void;
  compact?: boolean;
  showPharmacies?: boolean;
  style?: any;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onPress,
  onAddToCart,
  compact = false,
  showPharmacies = false,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(medicine);
    }
  };

  const handleAddToCart = (pharmacyId: string) => {
    if (onAddToCart) {
      onAddToCart(medicine, pharmacyId);
    }
  };

  const formatPrice = () => {
    if (medicine.priceRange.min === medicine.priceRange.max) {
      return `₹${medicine.priceRange.min}`;
    }
    return `₹${medicine.priceRange.min} - ₹${medicine.priceRange.max}`;
  };

  const renderPrescriptionBadge = () => {
    if (!medicine.requiresPrescription) return null;

    return (
      <View style={styles.prescriptionBadge}>
        <Text style={styles.prescriptionText}>Rx</Text>
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>⭐ {medicine.rating.toFixed(1)}</Text>
      <Text style={styles.reviewText}>({medicine.reviewCount})</Text>
    </View>
  );

  const renderAvailability = () => {
    const availableCount = medicine.availablePharmacies.length;
    const stockStatus = medicine.totalStock > 0 ? 'In Stock' : 'Out of Stock';

    return (
      <View style={styles.availabilityContainer}>
        <Text
          style={[
            styles.stockText,
            { color: medicine.totalStock > 0 ? '#4CAF50' : '#F44336' },
          ]}
        >
          {stockStatus}
        </Text>
        <Text style={styles.pharmacyCount}>at {availableCount} pharmacies</Text>
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
        <View style={styles.compactImageContainer}>
          {medicine.images.length > 0 ? (
            <Image
              source={{ uri: medicine.images[0] }}
              style={styles.compactImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.compactPlaceholder}>
              <Text style={styles.placeholderText}>💊</Text>
            </View>
          )}
          {renderPrescriptionBadge()}
        </View>

        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={2}>
            {medicine.name}
          </Text>
          <Text style={styles.compactBrand} numberOfLines={1}>
            {medicine.brand}
          </Text>
          <Text style={styles.compactPrice}>{formatPrice()}</Text>
          {renderRating()}
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
      <View style={styles.imageContainer}>
        {medicine.images.length > 0 ? (
          <Image
            source={{ uri: medicine.images[0] }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>💊</Text>
          </View>
        )}
        {renderPrescriptionBadge()}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.medicineName} numberOfLines={1}>
              {medicine.name}
            </Text>
            <Text style={styles.brandName} numberOfLines={1}>
              {medicine.brand}
            </Text>
            {medicine.strength && (
              <Text style={styles.strength}>{medicine.strength}</Text>
            )}
          </View>
          {renderRating()}
        </View>

        <View style={styles.details}>
          <Text style={styles.form}>{medicine.form}</Text>
          <Text style={styles.category}>{medicine.category}</Text>
        </View>

        <View style={styles.pricing}>
          <Text style={styles.price}>{formatPrice()}</Text>
          {renderAvailability()}
        </View>

        {showPharmacies && medicine.availablePharmacies.length > 0 && (
          <View style={styles.pharmaciesContainer}>
            <Text style={styles.pharmaciesTitle}>Available at:</Text>
            <Text style={styles.pharmaciesList} numberOfLines={1}>
              {medicine.availablePharmacies.slice(0, 3).join(', ')}
              {medicine.availablePharmacies.length > 3 &&
                ` +${medicine.availablePharmacies.length - 3} more`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            medicine.totalStock === 0 && styles.disabledButton,
          ]}
          onPress={() => handleAddToCart(medicine.availablePharmacies[0])}
          disabled={medicine.totalStock === 0}
        >
          <Text
            style={[
              styles.addButtonText,
              medicine.totalStock === 0 && styles.disabledButtonText,
            ]}
          >
            {medicine.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
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
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    width: '45%',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  compactImageContainer: {
    height: 80,
    position: 'relative',
  },
  medicineImage: {
    width: '100%',
    height: '100%',
  },
  compactImage: {
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
  compactPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  prescriptionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescriptionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  compactContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  compactBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  strength: {
    fontSize: 12,
    color: '#888',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  reviewText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  form: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
  },
  pricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  availabilityContainer: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pharmacyCount: {
    fontSize: 10,
    color: '#666',
  },
  pharmaciesContainer: {
    marginBottom: 12,
  },
  pharmaciesTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pharmaciesList: {
    fontSize: 12,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default MedicineCard;
