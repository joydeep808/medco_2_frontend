import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  BodyText,
  Heading2,
  Button,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';
import { useAuthStore } from '@store/AuthStore';
import { useLocationStore } from '@store/LocationStore';
import { useCartStore } from '@store/CartStore';
import { navigate } from '@utils/NavigationUtils';
import BannerCarousel, { Banner } from '../../components/Banner/BannerCarousel';
import { PharmacyService } from '@services/PharmacyService';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen: React.FC = () => {
  const { isUserLoggedIn } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const { getCartPreview } = useCartStore();

  // Local state for pharmacies and loading
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);
  const [trendingSearches] = useState([
    'Paracetamol',
    'Vitamin D',
    'Crocin',
    'Dolo 650',
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [banners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Free Delivery',
      description: 'On orders above ₹500',
      imageUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
      actionType: 'EXTERNAL' as const,
      actionData: { screen: 'Search' },
      isActive: true,
      priority: 1,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: '24/7 Service',
      description: 'Emergency medicines available',
      imageUrl:
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
      actionType: 'EXTERNAL' as const,
      actionData: { screen: 'StoreScreen' },
      isActive: true,
      priority: 2,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  useEffect(() => {
    loadInitialData();
  }, [currentLocation]);

  // Also load on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Always try to fetch pharmacies, with fallback coordinates if needed
    await fetchNearbyPharmacies();
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyPharmacies = async () => {
    setPharmacyLoading(true);
    try {
      // Use current location if available, otherwise use default coordinates for Agartala
      const lat = currentLocation?.latitude || 23.8315;
      const lng = currentLocation?.longitude || 91.2868;


      const response = await PharmacyService.getNearbyPharmacies(lat, lng, 15)
      if (response.success && response.data) {
        const pharmaciesWithDistance = response.data.content.map(
          (pharmacy: any) => ({
            ...pharmacy,
            distance: calculateDistance(
              lat,
              lng,
              pharmacy.latitude,
              pharmacy.longitude,
            ),
          }),
        );

        setNearbyPharmacies(pharmaciesWithDistance || []);
      }
    } catch (error) {
      console.error('Failed to fetch nearby pharmacies:', error);
    } finally {
      setPharmacyLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleBannerPress = (banner: Banner) => {
    if (banner.actionType === 'EXTERNAL' && banner.actionData?.screen) {
      navigate(banner.actionData.screen);
    }
  };

  const cartPreview = getCartPreview();
  const totalItems = cartPreview.reduce((sum, cart) => sum + cart.itemCount, 0);
  const totalAmount = cartPreview.reduce((sum, cart) => sum + cart.total, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Location Header */}
      <View style={styles.locationHeader}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigate('LocationSearch')}
        >
          <View style={styles.locationContent}>
            <BodyText color="secondary" size="sm">
              Deliver to
            </BodyText>
            <View style={styles.locationRow}>
              <BodyText color="primary" weight="bold" size="md">
                📍{' '}
                {currentLocation
                  ? `${currentLocation.area || 'Current Location'}`
                  : 'Select Location'}
              </BodyText>
              <BodyText color="secondary" size="sm">
                ▼
              </BodyText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerButtons}>
          <Button
            title="Profile"
            variant="ghost"
            size="sm"
            onPress={() => navigate('ProfileScreen')}
          />
          <Button
            title={`Cart (${totalItems})`}
            variant="ghost"
            size="sm"
            onPress={() => navigate('CartScreen')}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigate('Search')}
        >
          <BodyText color="secondary">
            🔍 Search medicines, pharmacies...
          </BodyText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
          />
        }
      >
        {/* Banner Carousel */}
        <BannerCarousel
          banners={banners}
          onBannerPress={handleBannerPress}
          style={styles.bannerCarousel}
        />

        {/* Quick Navigation */}
        <View style={styles.quickNavigation}>
          <Button
            title="🔍 Search Medicines"
            variant="ghost"
            size="md"
            onPress={() => navigate('Search')}
            style={styles.navButton}
          />
          <Button
            title="🏪 Find Pharmacies"
            variant="ghost"
            size="md"
            onPress={() => navigate('StoreScreen')}
            style={styles.navButton}
          />
          <Button
            title="📋 My Orders"
            variant="ghost"
            size="md"
            onPress={() => navigate('OrderScreen')}
            style={styles.navButton}
          />
        </View>

        {/* Trending Searches */}
        {trendingSearches.length > 0 && (
          <View style={styles.section}>
            <Heading2 color="primary" style={styles.sectionTitle}>
              Trending Searches
            </Heading2>
            <View style={styles.trendingContainer}>
              {trendingSearches.slice(0, 6).map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trendingItem}
                  onPress={() => navigate('Search', { query: search })}
                >
                  <BodyText color="primary" size="sm">
                    🔥 {search}
                  </BodyText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Nearby Pharmacies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading2 color="primary">
              Nearby Pharmacies ({nearbyPharmacies.length})
            </Heading2>
            <View style={styles.headerActions}>
              <Button
                title="Refresh"
                variant="ghost"
                size="sm"
                onPress={fetchNearbyPharmacies}
              />
              <Button
                title="View All"
                variant="ghost"
                size="sm"
                onPress={() => navigate('StoreScreen')}
              />
            </View>
          </View>

          {pharmacyLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <BodyText color="secondary" style={styles.loadingText}>
                Loading pharmacies...
              </BodyText>
            </View>
          ) : nearbyPharmacies.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {nearbyPharmacies.slice(0, 5).map(pharmacy => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={styles.pharmacyCard}
                  onPress={() =>
                    navigate('PharmacyDetails', { pharmacyId: pharmacy.id })
                  }
                >
                  <View style={styles.pharmacyHeader}>
                    <Heading2 color="primary" style={styles.pharmacyName}>
                      {pharmacy.name}
                    </Heading2>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: pharmacy.isOpen
                            ? colors.success.DEFAULT
                            : colors.error.DEFAULT,
                        },
                      ]}
                    >
                      <BodyText color="white" size="xs" weight="bold">
                        {pharmacy.isOpen ? 'Open' : 'Closed'}
                      </BodyText>
                    </View>
                  </View>

                  <BodyText color="secondary" style={styles.pharmacyAddress}>
                    📍 {pharmacy.address}
                  </BodyText>

                  <View style={styles.pharmacyDetails}>
                    <BodyText color="secondary" size="sm">
                      ⭐ {pharmacy.rating.toFixed(1)} ({pharmacy.totalRatings}{' '}
                      reviews)
                    </BodyText>
                    <BodyText color="secondary" size="sm">
                      📏 {pharmacy.distance?.toFixed(1)} km away
                    </BodyText>
                  </View>

                  <View style={styles.deliveryInfo}>
                    <BodyText color="primary" size="sm" weight="medium">
                      🚚 ₹{pharmacy.deliveryFee} delivery
                    </BodyText>
                    <BodyText color="secondary" size="sm">
                      ⏱️ {pharmacy.averageDeliveryTime} mins
                    </BodyText>
                  </View>

                  {pharmacy.freeDeliveryAbove && (
                    <BodyText
                      color="success"
                      size="xs"
                      style={styles.freeDelivery}
                    >
                      Free delivery above ₹{pharmacy.freeDeliveryAbove}
                    </BodyText>
                  )}

                  <View style={styles.pharmacyFeatures}>
                    {pharmacy.isOpen24x7 && (
                      <View style={styles.featureBadge}>
                        <BodyText color="primary" size="xs">
                          24/7
                        </BodyText>
                      </View>
                    )}
                    {pharmacy.hasPrescriptionUpload && (
                      <View style={styles.featureBadge}>
                        <BodyText color="primary" size="xs">
                          📋 Rx
                        </BodyText>
                      </View>
                    )}
                    {pharmacy.hasCodPayment && (
                      <View style={styles.featureBadge}>
                        <BodyText color="primary" size="xs">
                          💰 COD
                        </BodyText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <BodyText color="secondary" align="center">
                No pharmacies found nearby
              </BodyText>
              <Button
                title="Set Location"
                variant="outline"
                size="sm"
                onPress={() => navigate('LocationSearch')}
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>

        {/* Auth Prompt for non-logged in users */}
        {!isUserLoggedIn && (
          <View style={styles.authPrompt}>
            <Heading2 color="primary" align="center">
              Sign in for better experience
            </Heading2>
            <BodyText
              color="secondary"
              align="center"
              style={styles.authPromptText}
            >
              Track orders, save addresses, and get personalized recommendations
            </BodyText>
            <Button
              title="Sign In"
              onPress={() => navigate('LoginScreen')}
              style={styles.authPromptButton}
            />
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Cart Widget */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigate('CartScreen')}
        >
          <View style={styles.cartContent}>
            <BodyText color="white" weight="bold">
              {totalItems} items • ₹{totalAmount.toFixed(0)}
            </BodyText>
            <BodyText color="white" size="sm">
              View Cart →
            </BodyText>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  locationHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  locationButton: {
    flex: 1,
  },
  locationContent: {
    gap: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  searchBar: {
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  scrollView: {
    flex: 1,
  },
  bannerCarousel: {
    marginBottom: spacing.lg,
  },
  quickNavigation: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  navButton: {
    marginBottom: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    color: colors.light.textHighContrast,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trendingItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.light.textSecondary,
  },
  pharmacyCard: {
    width: 280,
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginRight: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.md,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  pharmacyName: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: 16,
  },
  pharmacyAddress: {
    marginBottom: spacing.sm,
    fontSize: 12,
  },
  pharmacyDetails: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  freeDelivery: {
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  pharmacyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  featureBadge: {
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  pharmacyStatus: {
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  authPrompt: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.lg,
  },
  authPromptText: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    color: colors.light.textSecondary,
  },
  authPromptButton: {
    marginTop: spacing.sm,
  },
  bottomSpacing: {
    height: 120, // Space for floating cart
  },
  floatingCart: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xl,
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen;
