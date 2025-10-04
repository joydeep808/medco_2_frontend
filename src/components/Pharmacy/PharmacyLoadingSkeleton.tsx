/**
 * Pharmacy Loading Skeleton Component
 * Shows loading placeholders while data is being fetched
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';

const SkeletonBox: React.FC<{
  width?: number | string;
  height?: number;
  style?: any;
}> = ({ width = '100%', height = 20, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.light.border,
          borderRadius: borderRadius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PharmacyLoadingSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <Card style={styles.headerCard}>
        <Column style={styles.headerContent}>
          <Row style={styles.headerRow}>
            <Column style={styles.nameSection}>
              <SkeletonBox width="70%" height={24} />
              <SkeletonBox
                width="50%"
                height={16}
                style={{ marginTop: spacing.sm }}
              />
            </Column>
            <SkeletonBox
              width={60}
              height={40}
              style={{ borderRadius: borderRadius.lg }}
            />
          </Row>

          <SkeletonBox
            width="100%"
            height={40}
            style={{ marginTop: spacing.md }}
          />

          <Row style={styles.addressRow}>
            <SkeletonBox width={20} height={20} />
            <Column style={styles.addressContent}>
              <SkeletonBox width="80%" height={16} />
              <SkeletonBox width="60%" height={16} />
            </Column>
          </Row>

          <View style={styles.deliverySection}>
            <SkeletonBox width="60%" height={20} />
            <Row style={styles.deliveryRow}>
              <SkeletonBox
                width="30%"
                height={50}
                style={{ borderRadius: borderRadius.lg }}
              />
              <SkeletonBox
                width="30%"
                height={50}
                style={{ borderRadius: borderRadius.lg }}
              />
              <SkeletonBox
                width="30%"
                height={50}
                style={{ borderRadius: borderRadius.lg }}
              />
            </Row>
          </View>
        </Column>
      </Card>

      {/* Search Skeleton */}
      <View style={styles.searchContainer}>
        <SkeletonBox
          width="100%"
          height={48}
          style={{ borderRadius: borderRadius.lg }}
        />
      </View>

      {/* Tabs Skeleton */}
      <View style={styles.tabContainer}>
        <Row style={styles.tabRow}>
          <SkeletonBox
            width="48%"
            height={40}
            style={{ borderRadius: borderRadius.lg }}
          />
          <SkeletonBox
            width="48%"
            height={40}
            style={{ borderRadius: borderRadius.lg }}
          />
        </Row>
      </View>

      {/* Product Cards Skeleton */}
      {[1, 2, 3].map(index => (
        <Card key={index} style={styles.productCard}>
          <Column style={styles.productContent}>
            <Row style={styles.productHeader}>
              <SkeletonBox
                width={70}
                height={70}
                style={{ borderRadius: borderRadius.lg }}
              />
              <Column style={styles.productInfo}>
                <SkeletonBox width="80%" height={20} />
                <SkeletonBox
                  width="60%"
                  height={16}
                  style={{ marginTop: spacing.sm }}
                />
                <SkeletonBox
                  width="40%"
                  height={14}
                  style={{ marginTop: spacing.xs }}
                />
              </Column>
            </Row>

            <SkeletonBox
              width="100%"
              height={40}
              style={{ marginTop: spacing.md }}
            />

            <Column style={styles.variantsList}>
              <SkeletonBox width="40%" height={18} />
              {[1, 2].map(variantIndex => (
                <View key={variantIndex} style={styles.variantCard}>
                  <Row style={styles.variantHeader}>
                    <Column style={styles.variantInfo}>
                      <SkeletonBox width="70%" height={16} />
                      <SkeletonBox width="50%" height={14} />
                    </Column>
                    <SkeletonBox
                      width={60}
                      height={32}
                      style={{ borderRadius: borderRadius.md }}
                    />
                  </Row>
                  <Row style={styles.priceRow}>
                    <SkeletonBox width="40%" height={16} />
                    <SkeletonBox width="30%" height={14} />
                  </Row>
                </View>
              ))}
            </Column>
          </Column>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  headerCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.lg,
  },
  headerContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameSection: {
    flex: 1,
  },
  addressRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  addressContent: {
    flex: 1,
    gap: spacing.sm,
  },
  deliverySection: {
    gap: spacing.lg,
  },
  deliveryRow: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tabRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.md,
  },
  productContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  productHeader: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  variantsList: {
    gap: spacing.md,
  },
  variantCard: {
    backgroundColor: colors.light.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: spacing.md,
  },
  variantHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  variantInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  priceRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default PharmacyLoadingSkeleton;
