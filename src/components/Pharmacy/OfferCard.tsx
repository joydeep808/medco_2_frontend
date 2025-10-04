/**
 * Offer Card Component
 * Displays pharmacy offers and promotions
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  BodyText,
  Heading3,
  Caption,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';

interface OfferCardProps {
  offer: {
    id: number;
    title: string;
    description: string;
    offerType: string;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderValue?: number;
    startDate: number;
    endDate: number;
    isActive: boolean;
    bannerImageUrl?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const formatOfferText = () => {
    switch (offer.offerType) {
      case 'PERCENTAGE':
        return `${offer.discountValue}% OFF`;
      case 'FIXED_AMOUNT':
        return `₹${offer.discountValue} OFF`;
      case 'BUY_X_GET_Y':
        return 'Buy 1 Get 1';
      case 'FREE_DELIVERY':
        return 'FREE DELIVERY';
      default:
        return 'SPECIAL OFFER';
    }
  };

  const formatValidityText = () => {
    const endDate = new Date(offer.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Expires today';
    } else if (diffDays === 1) {
      return 'Expires tomorrow';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return `Valid till ${endDate.toLocaleDateString()}`;
    }
  };

  const getOfferIcon = () => {
    switch (offer.offerType) {
      case 'PERCENTAGE':
      case 'FIXED_AMOUNT':
        return '🏷️';
      case 'BUY_X_GET_Y':
        return '🎁';
      case 'FREE_DELIVERY':
        return '🚚';
      default:
        return '✨';
    }
  };

  const cardStyle = {
    backgroundColor: offer.backgroundColor || colors.primary[500],
  };

  const textColor = offer.textColor || colors.white;

  const renderContent = () => (
    <Column style={styles.content}>
      {/* Offer Header */}
      <Row style={styles.header}>
        <View style={styles.iconContainer}>
          <BodyText style={styles.offerIcon}>{getOfferIcon()}</BodyText>
        </View>

        <Column style={styles.offerInfo}>
          <BodyText style={[styles.offerText, { color: textColor }]}>
            {formatOfferText()}
          </BodyText>
          <Heading3 style={[styles.offerTitle, { color: textColor }]}>
            {offer.title}
          </Heading3>
        </Column>

        {!offer.isActive && (
          <View style={styles.inactiveBadge}>
            <Caption color="error">Inactive</Caption>
          </View>
        )}
      </Row>

      {/* Offer Description */}
      <BodyText style={[styles.description, { color: textColor }]}>
        {offer.description}
      </BodyText>

      {/* Offer Details */}
      <Column style={styles.detailsSection}>
        {offer.minOrderValue && (
          <Row style={styles.detailRow}>
            <BodyText style={[styles.detailLabel, { color: textColor }]}>
              Min Order:
            </BodyText>
            <BodyText style={[styles.detailValue, { color: textColor }]}>
              ₹{offer.minOrderValue}
            </BodyText>
          </Row>
        )}

        {offer.maxDiscountAmount && (
          <Row style={styles.detailRow}>
            <BodyText style={[styles.detailLabel, { color: textColor }]}>
              Max Discount:
            </BodyText>
            <BodyText style={[styles.detailValue, { color: textColor }]}>
              ₹{offer.maxDiscountAmount}
            </BodyText>
          </Row>
        )}

        <Row style={styles.detailRow}>
          <BodyText style={[styles.detailLabel, { color: textColor }]}>
            Validity:
          </BodyText>
          <BodyText style={[styles.detailValue, { color: textColor }]}>
            {formatValidityText()}
          </BodyText>
        </Row>
      </Column>

      {/* Action Button */}
      {offer.isActive && (
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: textColor }]}
          onPress={() => console.log('Apply offer:', offer.id)}
        >
          <BodyText style={[styles.actionButtonText, { color: textColor }]}>
            Apply Offer
          </BodyText>
        </TouchableOpacity>
      )}
    </Column>
  );

  return (
    <Card style={styles.container}>
      {offer.bannerImageUrl ? (
        <ImageBackground
          source={{ uri: offer.bannerImageUrl }}
          style={[styles.backgroundImage, cardStyle]}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </ImageBackground>
      ) : (
        <View style={[styles.solidBackground, cardStyle]}>
          {renderContent()}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  backgroundImage: {
    minHeight: 180,
  },
  backgroundImageStyle: {
    borderRadius: borderRadius.xl,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
  },
  solidBackground: {
    minHeight: 180,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    flex: 1,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  offerIcon: {
    fontSize: 24,
  },
  offerInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  offerText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  inactiveBadge: {
    backgroundColor: colors.error[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.95,
    fontWeight: '500',
  },
  detailsSection: {
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  detailRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.9,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  actionButtonText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default OfferCard;
