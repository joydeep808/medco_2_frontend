/**
 * Category Section Component
 * Horizontal scrolling medicine categories with FlashList optimization
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

export interface MedicineCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
  count: number;
}

export interface CategorySectionProps {
  categories?: MedicineCategory[];
  onCategoryPress?: (category: MedicineCategory) => void;
  style?: any;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onCategoryPress,
  style,
}) => {
  const defaultCategories: MedicineCategory[] = [
    {
      id: 'pain-relief',
      name: 'Pain Relief',
      icon: '💊',
      color: '#007AFF',
      backgroundColor: '#E3F2FD',
      count: 150,
    },
    {
      id: 'vitamins',
      name: 'Vitamins',
      icon: '🌟',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      count: 120,
    },
    {
      id: 'antibiotics',
      name: 'Antibiotics',
      icon: '🦠',
      color: '#F44336',
      backgroundColor: '#FFEBEE',
      count: 95,
    },
    {
      id: 'diabetes',
      name: 'Diabetes Care',
      icon: '🩺',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      count: 80,
    },
    {
      id: 'heart-care',
      name: 'Heart Care',
      icon: '❤️',
      color: '#E91E63',
      backgroundColor: '#FCE4EC',
      count: 65,
    },
    {
      id: 'skin-care',
      name: 'Skin Care',
      icon: '✨',
      color: '#9C27B0',
      backgroundColor: '#F3E5F5',
      count: 110,
    },
    {
      id: 'baby-care',
      name: 'Baby Care',
      icon: '👶',
      color: '#00BCD4',
      backgroundColor: '#E0F2F1',
      count: 75,
    },
    {
      id: 'women-care',
      name: 'Women Care',
      icon: '🌸',
      color: '#FF5722',
      backgroundColor: '#FBE9E7',
      count: 90,
    },
  ];

  const medicineCategories = categories || defaultCategories;

  const handleCategoryPress = (category: MedicineCategory) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    }
  };

  const renderCategoryItem = ({ item }: { item: MedicineCategory }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.backgroundColor }]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[styles.categoryName, { color: item.color }]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>{item.count} items</Text>
    </TouchableOpacity>
  );

  const renderSeeAllButton = () => (
    <TouchableOpacity
      style={styles.seeAllCard}
      onPress={() => console.log('See all categories')}
      activeOpacity={0.7}
    >
      <Text style={styles.seeAllIcon}>📋</Text>
      <Text style={styles.seeAllText}>See All</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <TouchableOpacity onPress={() => console.log('View all categories')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={medicineCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderSeeAllButton}
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
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  categoryCount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  seeAllCard: {
    width: 100,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  seeAllIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
});

export default CategorySection;
