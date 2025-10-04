import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { BodyText, Heading2, Button, spacing, borderRadius } from '@components';
import { ThemeManager, createThemedStyles } from '../../styles/colors';
import {
  ShadowSystem,
  InteractiveShadows,
  MedicalShadows,
} from '../../styles/shadows';
import { useLocationStore } from '@store/LocationStore';
import useCartStore from '@store/CartStore.new';
import FloatingCartButton from '@components/Cart/FloatingCartButton';
import { navigate } from '@utils/NavigationUtils';
import BannerCarousel, { Banner } from '../../components/Banner/BannerCarousel';
import { PharmacyService } from '@services/PharmacyService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

export const HomeScreen: React.FC = () => {
  const { currentLocation } = useLocationStore();
  const { getCartPreview, loadAllCarts, getCartItemCount, getCartTotal } =
    useCartStore();

  // Local state for pharmacies
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([]);
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
    loadAllCarts()
  }, []);

  const loadInitialData = async () => {
    // Always try to fetch pharmacies, with fallback coordinates if needed
    await fetchNearbyPharmacies();
    // Load user carts
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
    try {
      // Use current location if available, otherwise use default coordinates for Agartala
      const lat = currentLocation?.latitude || 23.8315;
      const lng = currentLocation?.longitude || 91.2868;

      const response = await PharmacyService.getNearbyPharmacies(lat, lng, 15);
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

  const totalItems = getCartItemCount();
  const totalAmount = getCartTotal();
  const cartPreview = getCartPreview();
  const theme = ThemeManager.getCurrentThemeConfig();

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Modern Header */}
      <View style={styles(theme).modernHeader}>
        <TouchableOpacity
          style={styles(theme).locationButton}
          onPress={() => navigate('LocationSearch')}
        >
          <View style={styles(theme).locationContent}>
            <BodyText color="secondary" size="xs">
              Deliver to
            </BodyText>
            <View style={styles(theme).locationRow}>
              <BodyText color="primary" weight="bold" size="sm">
                📍 {currentLocation?.area || 'Select Location'}
              </BodyText>
              <BodyText color="secondary" size="xs">
                ▼
              </BodyText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles(theme).headerActions}>
          <TouchableOpacity
            style={styles(theme).headerIconButton}
            onPress={() => navigate('ProfileScreen')}
          >
            <BodyText style={styles(theme).headerIcon}>👤</BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(theme).headerIconButton,
              totalItems > 0 && styles(theme).cartWithItems,
            ]}
            onPress={() => navigate('CartScreen')}
          >
            <BodyText style={styles(theme).headerIcon}>🛒</BodyText>
            {totalItems > 0 && (
              <View style={styles(theme).cartBadge}>
                <BodyText color="white" size="xs" weight="bold">
                  {totalItems}
                </BodyText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modern Search Bar */}
      <View style={styles(theme).searchContainer}>
        <TouchableOpacity
          style={styles(theme).modernSearchBar}
          onPress={() => navigate('Search')}
          activeOpacity={0.7}
        >
          <View style={styles(theme).searchIcon}>
            <BodyText style={styles(theme).searchIconText}>🔍</BodyText>
          </View>
          <BodyText color="secondary" style={styles(theme).searchPlaceholder}>
            Search medicines, pharmacies...
          </BodyText>
          <View style={styles(theme).searchFilter}>
            <BodyText style={styles(theme).filterIcon}>⚙️</BodyText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles(theme).scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.interactive.primary]}
          />
        }
      >
        {/* Banner Carousel */}
        <BannerCarousel
          banners={banners}
          onBannerPress={handleBannerPress}
          style={styles(theme).bannerCarousel}
        />

        {/* Quick Actions Grid */}
        <View style={styles(theme).quickActionsGrid}>
          <TouchableOpacity
            style={styles(theme).quickActionCard}
            onPress={() => navigate('Search')}
          >
            <View style={styles(theme).quickActionIcon}>
              <BodyText style={styles(theme).quickActionEmoji}>🔍</BodyText>
            </View>
            <BodyText color="primary" weight="medium" size="sm">
              Search Medicines
            </BodyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(theme).quickActionCard}
            onPress={() => navigate('StoreScreen')}
          >
            <View style={styles(theme).quickActionIcon}>
              <BodyText style={styles(theme).quickActionEmoji}>🏪</BodyText>
            </View>
            <BodyText color="primary" weight="medium" size="sm">
              Find Pharmacies
            </BodyText>
          </TouchableOpacity>
        </View>

        {/* Trending Searches */}
        {trendingSearches.length > 0 && (
          <View style={styles(theme).section}>
            <Heading2 color="primary" style={styles(theme).sectionTitle}>
              Trending Searches
            </Heading2>
            <View style={styles(theme).trendingContainer}>
              {trendingSearches.slice(0, 6).map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles(theme).trendingItem}
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
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionHeader}>
            <Heading2 color="primary">
              Nearby Pharmacies ({nearbyPharmacies.length})
            </Heading2>
            <View style={styles(theme).headerActions}>
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

          {nearbyPharmacies && (
            <FlashList
              data={nearbyPharmacies}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item: pharmacy }) => (
                <TouchableOpacity
                  key={pharmacy.id}
                  style={styles(theme).modernPharmacyCard}
                  onPress={() =>
                    navigate('PharmacyScreen', { pharmacyId: pharmacy.id })
                  }
                >
                  <View style={styles(theme).pharmacyImageContainer}>
                    {pharmacy.pharmacyImageUrl ? (
                      <Image
                        source={{ uri: pharmacy.pharmacyImageUrl }}
                        style={styles(theme).pharmacyImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles(theme).pharmacyImagePlaceholder}>
                        <BodyText style={styles(theme).pharmacyImageIcon}>
                          🏥
                        </BodyText>
                      </View>
                    )}
                    <View
                      style={[
                        styles(theme).modernStatusBadge,
                        {
                          backgroundColor: pharmacy.isOpen
                            ? theme.colors.status.success
                            : theme.colors.status.error,
                        },
                      ]}
                    >
                      <BodyText color="white" size="xs" weight="bold">
                        {pharmacy.isOpen ? 'Open' : 'Closed'}
                      </BodyText>
                    </View>
                  </View>

                  <View style={styles(theme).pharmacyCardContent}>
                    <BodyText
                      color="primary"
                      weight="bold"
                      size="md"
                      numberOfLines={1}
                    >
                      {pharmacy.name}
                    </BodyText>

                    <BodyText
                      color="secondary"
                      size="xs"
                      numberOfLines={2}
                      style={styles(theme).pharmacyCardAddress}
                    >
                      📍 {pharmacy.address}
                    </BodyText>

                    <View style={styles(theme).pharmacyCardMeta}>
                      <View style={styles(theme).ratingContainer}>
                        <BodyText color="warning" size="xs">
                          ⭐
                        </BodyText>
                        <BodyText color="secondary" size="xs">
                          {pharmacy.rating.toFixed(1)}
                        </BodyText>
                      </View>
                      <BodyText color="secondary" size="xs">
                        {pharmacy.distance?.toFixed(1)} km
                      </BodyText>
                    </View>

                    <View style={styles(theme).deliveryBadge}>
                      <BodyText color="primary" size="xs" weight="medium">
                        🚚 ₹{pharmacy.deliveryFee} •{' '}
                        {pharmacy.averageDeliveryTime}min
                      </BodyText>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles(theme).bottomSpacing} />
      </ScrollView>

      {/* Floating Cart Widget */}
      <FloatingCartButton />
    </SafeAreaView>
  );
};

const styles = createThemedStyles(theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    modernHeader: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...ShadowSystem.depth2(theme.colors.background.elevated),
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
    headerActions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    headerIconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      ...InteractiveShadows.button('secondary', 'default'),
    },
    headerIcon: {
      fontSize: 20,
    },
    cartWithItems: {
      backgroundColor: theme.colors.interactive.primary,
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.status.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      ...ShadowSystem.depth2(),
    },
    searchContainer: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
    },
    modernSearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...InteractiveShadows.card('default', 1),
    },
    searchIcon: {
      width: 20,
      height: 20,
      borderRadius: 18,
      backgroundColor: theme.colors.interactive.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      ...ShadowSystem.depth1(),
    },
    searchIconText: {
      fontSize: 16,
    },
    searchPlaceholder: {
      flex: 1,
    },
    searchFilter: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background.tertiary,
      justifyContent: 'center',
      alignItems: 'center',
      ...ShadowSystem.depth1(),
    },
    filterIcon: {
      fontSize: 14,
    },
    scrollView: {
      flex: 1,
    },
    bannerCarousel: {
      marginBottom: spacing.lg,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },
    quickActionCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...InteractiveShadows.card('default', 2),
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.interactive.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
      ...ShadowSystem.depth2(),
    },
    quickActionEmoji: {
      fontSize: 24,
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
    // headerActions: {
    //   flexDirection: 'row',
    //   gap: spacing.sm,
    // },
    sectionTitle: {
      marginBottom: spacing.lg,
      color: theme.colors.text.contrast,
    },
    trendingContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    trendingItem: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...ShadowSystem.depth1(theme.colors.background.secondary),
    },
    loadingContainer: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.md,
      color: theme.colors.text.secondary,
    },
    pharmacyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    modernPharmacyCard: {
      width: '100%',
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      marginBottom: 12,
      borderColor: theme.colors.border.primary,
      overflow: 'hidden',
      ...MedicalShadows.safe(),
    },
    pharmacyImageContainer: {
      height: 100,
      position: 'relative',
    },
    pharmacyImage: {
      width: '100%',
      height: '100%',
    },
    pharmacyImagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pharmacyImageIcon: {
      fontSize: 32,
      color: theme.colors.text.secondary,
    },
    modernStatusBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    pharmacyCardContent: {
      padding: spacing.md,
    },
    pharmacyCardAddress: {
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    pharmacyCardMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    deliveryBadge: {
      backgroundColor: theme.colors.background.tertiary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      ...ShadowSystem.depth1(),
    },
    emptyContainer: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: spacing.md,
    },
    emptyTitle: {
      marginBottom: spacing.md,
    },
    emptyButton: {
      marginTop: spacing.md,
    },
    authPrompt: {
      marginHorizontal: spacing.lg,
      marginVertical: spacing.lg,
      padding: spacing.xl,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      ...ShadowSystem.overlay(theme.colors.background.elevated),
    },
    authPromptText: {
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      color: theme.colors.text.secondary,
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
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...InteractiveShadows.button('primary', 'default'),
    },
    cartContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }),
);

export default HomeScreen;
