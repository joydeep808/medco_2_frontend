import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { BodyText, Heading2, Button } from '@components';
import { useAuthStore } from '@store/AuthStore';
import { useLocationStore } from '@store/LocationStore';
import { usePharmacyStore } from '@store/PharmacyStore.new';
import { useCartStore } from '@store/CartStore.new';
import { useSearchStore } from '@store/SearchStore';
import { navigate } from '@utils/NavigationUtils';
import BannerCarousel from '../../components/Banner/BannerCarousel';

const HomeScreen: React.FC = () => {
  const { user, isUserLoggedIn } = useAuthStore();
  const { currentLocation } = useLocationStore();
  const {
    nearbyPharmacies,
    isLoading: pharmacyLoading,
    fetchNearbyPharmacies,
  } = usePharmacyStore();
  const { getTotalItems, getTotalAmount } = useCartStore();
  const { getTrendingSearches, trendingSearches } = useSearchStore();

  const [refreshing, setRefreshing] = useState(false);
  const [banners] = useState([
    {
      id: '1',
      title: 'Free Delivery',
      subtitle: 'On orders above ₹500',
      image:
        'https://via.placeholder.com/400x200/007AFF/FFFFFF?text=Free+Delivery',
      action: { type: 'navigate', screen: 'Search' },
    },
    {
      id: '2',
      title: '24/7 Service',
      subtitle: 'Emergency medicines available',
      image:
        'https://via.placeholder.com/400x200/34C759/FFFFFF?text=24/7+Service',
      action: { type: 'navigate', screen: 'StoreScreen' },
    },
  ]);

  useEffect(() => {
    loadInitialData();
  }, [currentLocation]);

  const loadInitialData = async () => {
    if (currentLocation) {
      await fetchNearbyPharmacies(
        currentLocation.latitude,
        currentLocation.longitude,
      );
    }
    await getTrendingSearches();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleBannerPress = (banner: any) => {
    if (banner.action?.type === 'navigate' && banner.action?.screen) {
      navigate(banner.action.screen);
    }
  };

  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.headerContent}>
          <View>
            <Heading2 color="primary" size="md">
              {isUserLoggedIn ? `Hi, ${user?.firstName}!` : 'Welcome!'}
            </Heading2>
            <BodyText color="secondary" size="sm">
              {currentLocation
                ? 'Delivering to your location'
                : 'Set your location'}
            </BodyText>
          </View>
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
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
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
            variant="outline"
            size="md"
            onPress={() => navigate('Search')}
            style={styles.navButton}
          />
          <Button
            title="🏪 Find Pharmacies"
            variant="outline"
            size="md"
            onPress={() => navigate('StoreScreen')}
            style={styles.navButton}
          />
          <Button
            title="📋 My Orders"
            variant="outline"
            size="md"
            onPress={() => navigate('OrderScreen')}
            style={styles.navButton}
          />
        </View>

        {/* Trending Searches */}
        {trendingSearches.length > 0 && (
          <View style={styles.section}>
            <Heading2 color="primary" size="md" style={styles.sectionTitle}>
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
            <Heading2 color="primary" size="md">
              Nearby Pharmacies
            </Heading2>
            <Button
              title="View All"
              variant="ghost"
              size="sm"
              onPress={() => navigate('StoreScreen')}
            />
          </View>

          {pharmacyLoading ? (
            <View style={styles.loadingContainer}>
              <BodyText color="secondary">Loading pharmacies...</BodyText>
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
                  <Heading2 color="primary" size="sm">
                    {pharmacy.name}
                  </Heading2>
                  <BodyText color="secondary" size="sm">
                    ⭐ {pharmacy.rating} • {pharmacy.distance?.toFixed(1)} km
                  </BodyText>
                  <BodyText color="secondary" size="sm">
                    🚚 ₹{pharmacy.deliveryFee} •{' '}
                    {pharmacy.estimatedDeliveryTime} mins
                  </BodyText>
                  <View style={styles.pharmacyStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: pharmacy.isOpen
                            ? '#34C759'
                            : '#FF3B30',
                        },
                      ]}
                    >
                      <BodyText color="white" size="xs" weight="bold">
                        {pharmacy.isOpen ? 'Open' : 'Closed'}
                      </BodyText>
                    </View>
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
            <Heading2 color="primary" size="md" align="center">
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
    backgroundColor: '#f5f5f5',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
    marginTop: 80, // Account for sticky header
  },
  bannerCarousel: {
    marginBottom: 16,
  },
  quickNavigation: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  trendingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  pharmacyCard: {
    width: 200,
    backgroundColor: '#fff',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pharmacyStatus: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyButton: {
    marginTop: 12,
  },
  authPrompt: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authPromptText: {
    marginTop: 8,
    marginBottom: 16,
  },
  authPromptButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 100, // Space for floating cart
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen;
