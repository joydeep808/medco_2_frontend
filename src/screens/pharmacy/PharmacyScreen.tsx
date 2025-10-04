/**
 * Pharmacy Screen
 * Shows pharmacy details with products, offers, and cart functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  BodyText,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';
import { getRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';
import {
  showSuccessToast,
  showErrorToast,
} from '@components/Toast/ToastManager';
import cartService, { AddToCartRequest } from '@services/CartService';
import useCartStore from '@store/CartStore.new';
import PharmacyHeader from '../../components/Pharmacy/PharmacyHeader';
import ProductCard from '@components/Pharmacy/ProductCard';
import OfferCard from '@components/Pharmacy/OfferCard';
import FloatingCartButton from '@components/Cart/FloatingCartButton';
import PharmacyLoadingSkeleton from '@components/Pharmacy/PharmacyLoadingSkeleton';

interface PharmacyData {
  pharmacy: {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phoneNumber: string;
    email: string;
    isOpen: boolean;
    operatingHours: string;
    deliveryRadiusKm: number;
    minimumOrderAmount: number;
    deliveryFee: number;
    freeDeliveryAbove: number;
    averageDeliveryTime: number;
    isDeliveryAvailable: boolean;
    rating: number;
    totalRatings: number;
  };
  medicines: Array<{
    medicine: {
      id: number;
      name: string;
      genericName: string;
      brandName: string;
      manufacturer: string;
      description: string;
      requiresPrescription: boolean;
      imageUrl: string;
      categoryId: number;
    };
    variants: Array<{
      id: number;
      medicineId: number;
      variantName: string;
      strength: string;
      packSize: string;
      unit: string;
      sku: string;
      mrp: number;
      sellingPrice: number;
      discountedPrice: number;
      discountPercentage: number;
      stockQuantity: number;
      minQuantity: number;
      maxQuantity: number;
      expiryDate: number;
      isAvailable: boolean;
    }>;
  }>;
  offers: Array<{
    id: number;
    title: string;
    description: string;
    offerType: string;
    discountValue: number;
    maxDiscountAmount: number;
    minOrderValue: number;
    startDate: number;
    endDate: number;
    isActive: boolean;
    bannerImageUrl: string;
    backgroundColor: string;
    textColor: string;
  }>;
}

type PharmacyScreenRouteProp = RouteProp<
  { PharmacyScreen: { pharmacyId: number } },
  'PharmacyScreen'
>;

export const PharmacyScreen: React.FC = () => {
  const route = useRoute<PharmacyScreenRouteProp>();
  const navigation = useNavigation();
  const { pharmacyId } = route.params;

  const [pharmacyData, setPharmacyData] = useState<PharmacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'offers'>('products');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Use cart store
  const {
    addToCart,
    loadCartByPharmacy,
    getCartPreview,
    getCartItemCount,
    getCartTotal,
    hasItemInCart,
    getItemQuantity,
  } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]);

  useEffect(() => {
    fetchPharmacyData();
    fetchCartData();
  }, [pharmacyId]);

  useEffect(() => {
    if (pharmacyData?.medicines) {
      const filtered = pharmacyData.medicines.filter(
        item =>
          item.medicine.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.medicine.genericName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.medicine.brandName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, pharmacyData?.medicines]);

  const fetchPharmacyData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getRequest<ApiResponse<PharmacyData>>(
          `/pharmacies/${pharmacyId}/products-and-offers`,
        );

        if (response.data) {
          setPharmacyData(response.data);
        } else {
          showErrorToast('Failed to load pharmacy data');
        }
      } catch (error) {
        console.error('Error fetching pharmacy data:', error);
        showErrorToast('Failed to load pharmacy data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pharmacyId],
  );

  const fetchCartData = useCallback(async () => {
    try {
      await loadCartByPharmacy(pharmacyId);
    } catch (error) {
    }
  }, []);

  const handleAddToCart = async (medicine: any, variant: any) => {
    if (!pharmacyData) return;

    const variantKey = `${medicine.id}_${variant.id}`;
    setAddingToCart(variantKey);

    try {
      const addToCartRequest: AddToCartRequest = {
        pharmacyId,
        medicineVariantId: variant.id,
        quantity: 1,
      };

      const success = await addToCart(addToCartRequest);

      if (success) {
        showSuccessToast(`${medicine.name} added to cart`);
      } else {
        showErrorToast('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showErrorToast('Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const onRefresh = useCallback(() => {
    fetchPharmacyData(true);
    fetchCartData();
  }, [fetchPharmacyData, fetchCartData]);

  const renderListData = () => {
    if (!pharmacyData) return [];

    const headerData = [{ type: 'header', data: pharmacyData.pharmacy }];
    const searchData = [{ type: 'search' }];
    const tabData = [{ type: 'tabs', activeTab }];

    if (activeTab === 'products') {
      const medicinesToShow = searchQuery
        ? filteredMedicines
        : pharmacyData.medicines;
      const productData = medicinesToShow.map(item => ({
        type: 'product',
        data: item,
      }));

      if (searchQuery && filteredMedicines.length === 0) {
        return [
          ...headerData,
          ...searchData,
          ...tabData,
          { type: 'empty', message: 'No medicines found' },
        ];
      }

      return [...headerData, ...searchData, ...tabData, ...productData];
    } else {
      const offerData = pharmacyData.offers.map(offer => ({
        type: 'offer',
        data: offer,
      }));

      if (pharmacyData.offers.length === 0) {
        return [
          ...headerData,
          ...searchData,
          ...tabData,
          { type: 'empty', message: 'No offers available' },
        ];
      }

      return [...headerData, ...searchData, ...tabData, ...offerData];
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <PharmacyHeader pharmacy={item.data} />;

      case 'search':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <BodyText style={styles.searchIcon}>🔍</BodyText>
              <TextInput
                style={styles.searchInput}
                placeholder="Search medicines..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.light.textSecondary}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <BodyText style={styles.clearIcon}>✕</BodyText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 'tabs':
        return (
          <View style={styles.tabContainer}>
            <Row style={styles.tabRow}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'products' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('products')}
              >
                <BodyText
                  style={[
                    styles.tabText,
                    activeTab === 'products' && styles.activeTabText,
                  ]}
                >
                  Products (
                  {searchQuery
                    ? filteredMedicines.length
                    : pharmacyData?.medicines.length || 0}
                  )
                </BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'offers' && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab('offers')}
              >
                <BodyText
                  style={[
                    styles.tabText,
                    activeTab === 'offers' && styles.activeTabText,
                  ]}
                >
                  Offers ({pharmacyData?.offers.length || 0})
                </BodyText>
              </TouchableOpacity>
            </Row>
          </View>
        );

      case 'product':
        return (
          <ProductCard
            medicine={item.data.medicine}
            variants={item.data.variants}
            onAddToCart={handleAddToCart}
            addingToCart={addingToCart}
          />
        );

      case 'offer':
        return <OfferCard offer={item.data} />;

      case 'empty':
        return (
          <View style={styles.emptyContainer}>
            <BodyText style={styles.emptyIcon}>
              {activeTab === 'products' ? '💊' : '🎁'}
            </BodyText>
            <BodyText color="secondary" style={styles.emptyText}>
              {item.message}
            </BodyText>
            {searchQuery && (
              <Button
                title="Clear Search"
                variant="ghost"
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BodyText style={styles.backIcon}>←</BodyText>
          </TouchableOpacity>
          <BodyText style={styles.headerTitle}>Loading...</BodyText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <PharmacyLoadingSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!pharmacyData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.errorContainer}>
          <BodyText style={styles.errorIcon}>😞</BodyText>
          <BodyText color="secondary" style={styles.errorText}>
            Failed to load pharmacy details
          </BodyText>
          <Button
            title="Retry"
            variant="primary"
            onPress={() => fetchPharmacyData()}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BodyText style={styles.backIcon}>←</BodyText>
        </TouchableOpacity>
        <BodyText style={styles.headerTitle}>
          {pharmacyData.pharmacy.name}
        </BodyText>
        <View style={styles.headerRight} />
      </View>

      <FlashList
        data={renderListData()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
      />

      {getCartTotal() > 0 && (
        <FloatingCartButton
          pharmacyId={pharmacyData.pharmacy.id.toString()}
          pharmacyName={pharmacyData.pharmacy.name}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    ...shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary[600],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary[700],
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.light.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 120, // Space for floating cart button
  },
  tabContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    ...shadows.sm,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  activeTabText: {
    color: colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  clearSearchButton: {
    paddingHorizontal: spacing.xl,
  },
});

export default PharmacyScreen;
