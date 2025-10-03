/**
 * Banner Carousel Component
 * Auto-scrolling banner carousel with manual navigation and progressive loading
 */

import { Heading4 } from '@components/Typography/Typography';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  actionType: 'PHARMACY' | 'CATEGORY' | 'MEDICINE' | 'EXTERNAL' | 'NONE';
  actionData?: any;
  isActive: boolean;
  priority: number;
  validFrom: string;
  validUntil: string;
}

export interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showIndicators?: boolean;
  height?: number;
  style?: any;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  onBannerPress,
  autoScroll = true,
  autoScrollInterval = 4000,
  showIndicators = true,
  height = 180,
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<{
    [key: string]: 'loading' | 'loaded' | 'error';
  }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<number>(null);

  const activeBanners = banners.filter(banner => banner.isActive);

  useEffect(() => {
    if (autoScroll && activeBanners.length > 1) {
      startAutoScroll();
    }
    return () => stopAutoScroll();
  }, [autoScroll, activeBanners.length, currentIndex]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer.current = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % activeBanners.length;
      scrollToIndex(nextIndex);
    }, autoScrollInterval);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current && index >= 0 && index < activeBanners.length) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    if (index !== currentIndex && index >= 0 && index < activeBanners.length) {
      setCurrentIndex(index);
    }
  };

  const handleBannerPress = (banner: Banner) => {
    if (onBannerPress) {
      onBannerPress(banner);
    }
  };

  const handleImageLoadStart = (bannerId: string) => {
    setImageLoadStates(prev => ({ ...prev, [bannerId]: 'loading' }));
  };

  const handleImageLoad = (bannerId: string) => {
    setImageLoadStates(prev => ({ ...prev, [bannerId]: 'loaded' }));
  };

  const handleImageError = (bannerId: string) => {
    setImageLoadStates(prev => ({ ...prev, [bannerId]: 'error' }));
  };

  const renderBanner = (banner: Banner, index: number) => {
    const imageLoadState = imageLoadStates[banner.id] || 'loading';

    return (
      <TouchableOpacity
        key={banner.id}
        style={[styles.bannerContainer, { width: screenWidth }]}
        onPress={() => handleBannerPress(banner)}
        activeOpacity={0.9}
      >
        <View style={[styles.banner, { height }]}>
          {imageLoadState === 'loading' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}

          {imageLoadState === 'error' ? (
            <View style={styles.errorContainer}>
              <Heading4 style={styles.errorText}>Failed to load image</Heading4>
            </View>
          ) : (
            <Image
              source={{ uri: banner.imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
              onLoadStart={() => handleImageLoadStart(banner.id)}
              onLoad={() => handleImageLoad(banner.id)}
              onError={() => handleImageError(banner.id)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderIndicators = () => {
    if (!showIndicators || activeBanners.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {activeBanners.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    );
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={stopAutoScroll}
        onTouchEnd={startAutoScroll}
      >
        {activeBanners.map((banner, index) => renderBanner(banner, index))}
      </ScrollView>

      {renderIndicators()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bannerContainer: {
    paddingHorizontal: 16,
  },
  banner: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 20,
  },
});

export default BannerCarousel;
