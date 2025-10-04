/**
 * Delivery Slot Selector Component
 * Allows users to select delivery time slot
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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

interface DeliverySlotSelectorProps {
  selectedSlot: string;
  onSlotSelect: (slot: string) => void;
  deliveryInstructions: string;
  onInstructionsChange: (instructions: string) => void;
}

export const DeliverySlotSelector: React.FC<DeliverySlotSelectorProps> = ({
  selectedSlot,
  onSlotSelect,
  deliveryInstructions,
  onInstructionsChange,
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeSlots = [
    { id: '09:00-12:00', label: '9:00 AM - 12:00 PM', available: true },
    { id: '12:00-15:00', label: '12:00 PM - 3:00 PM', available: true },
    { id: '15:00-18:00', label: '3:00 PM - 6:00 PM', available: true },
    { id: '18:00-21:00', label: '6:00 PM - 9:00 PM', available: true },
  ];

  const deliveryDates = [
    {
      date: today,
      label: 'Today',
      available: today.getHours() < 20, // Available if before 8 PM
      slots: timeSlots.filter(slot => {
        const [startHour] = slot.id.split('-')[0].split(':').map(Number);
        return startHour > today.getHours() + 1; // At least 1 hour from now
      }),
    },
    {
      date: tomorrow,
      label: 'Tomorrow',
      available: true,
      slots: timeSlots,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const renderTimeSlot = (
    dateOption: (typeof deliveryDates)[0],
    slot: (typeof timeSlots)[0],
  ) => {
    const slotId = `${dateOption.date.toDateString()}-${slot.id}`;
    const isSelected = selectedSlot === slotId;
    const isAvailable = dateOption.available && slot.available;

    return (
      <TouchableOpacity
        key={slotId}
        style={[
          styles.slotCard,
          isSelected && styles.selectedSlotCard,
          !isAvailable && styles.unavailableSlotCard,
        ]}
        onPress={() => isAvailable && onSlotSelect(slotId)}
        disabled={!isAvailable}
      >
        <BodyText
          color={
            !isAvailable ? 'secondary' : isSelected ? 'contrast' : 'primary'
          }
          style={[styles.slotText, isSelected && styles.selectedSlotText]}
        >
          {slot.label}
        </BodyText>
        {!isAvailable && (
          <Caption color="error" style={styles.unavailableText}>
            Not Available
          </Caption>
        )}
      </TouchableOpacity>
    );
  };

  const renderDateSection = (dateOption: (typeof deliveryDates)[0]) => {
    if (!dateOption.available || dateOption.slots.length === 0) {
      return null;
    }

    return (
      <View key={dateOption.date.toDateString()} style={styles.dateSection}>
        <Row style={styles.dateHeader}>
          <BodyText color="primary" style={styles.dateLabel}>
            {dateOption.label}
          </BodyText>
          <Caption color="secondary">{formatDate(dateOption.date)}</Caption>
        </Row>

        <View style={styles.slotsGrid}>
          {dateOption.slots.map(slot => renderTimeSlot(dateOption, slot))}
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        <Heading3 color="primary" style={styles.title}>
          Delivery Time
        </Heading3>

        {/* Delivery Slots */}
        <Column style={styles.datesContainer}>
          {deliveryDates.map(renderDateSection)}
        </Column>

        {/* Express Delivery Info */}
        <View style={styles.expressInfo}>
          <Row style={styles.expressRow}>
            <BodyText style={styles.expressIcon}>⚡</BodyText>
            <Column style={styles.expressText}>
              <BodyText color="primary" style={styles.expressTitle}>
                Express Delivery Available
              </BodyText>
              <Caption color="secondary">
                Get your medicines delivered in 30-45 minutes
              </Caption>
            </Column>
          </Row>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.instructionsSection}>
          <BodyText color="primary" style={styles.instructionsTitle}>
            Delivery Instructions (Optional)
          </BodyText>
          <TextInput
            style={styles.instructionsInput}
            placeholder="e.g., Ring the doorbell, Call before delivery, Leave at door..."
            placeholderTextColor={colors.light.textSecondary}
            value={deliveryInstructions}
            onChangeText={onInstructionsChange}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Selected Slot Summary */}
        {selectedSlot && (
          <View style={styles.selectedSummary}>
            <Row style={styles.summaryRow}>
              <BodyText style={styles.summaryIcon}>📅</BodyText>
              <Column style={styles.summaryText}>
                <BodyText color="primary" style={styles.summaryTitle}>
                  Selected Delivery Slot
                </BodyText>
                <Caption color="secondary">
                  {(() => {
                    const [dateStr, timeSlot] = selectedSlot.split('-');
                    const date = new Date(dateStr);
                    const slot = timeSlots.find(s => s.id === timeSlot);
                    const dateLabel =
                      date.toDateString() === today.toDateString()
                        ? 'Today'
                        : 'Tomorrow';
                    return `${dateLabel}, ${slot?.label}`;
                  })()}
                </Caption>
              </Column>
            </Row>
          </View>
        )}
      </Column>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  datesContainer: {
    gap: spacing.lg,
  },
  dateSection: {
    gap: spacing.sm,
  },
  dateHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotCard: {
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    minWidth: '45%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  selectedSlotCard: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  unavailableSlotCard: {
    backgroundColor: "gray",
    borderColor: "gray",
    opacity: 0.6,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedSlotText: {
    color: colors.white,
  },
  unavailableText: {
    fontSize: 10,
  },
  expressInfo: {
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "red"
  },
  expressRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  expressIcon: {
    fontSize: 20,
  },
  expressText: {
    flex: 1,
    gap: spacing.xs,
  },
  expressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsSection: {
    gap: spacing.sm,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  instructionsInput: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.light.textHighContrast,
    minHeight: 60,
  },
  selectedSummary: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  summaryRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryText: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DeliverySlotSelector;
