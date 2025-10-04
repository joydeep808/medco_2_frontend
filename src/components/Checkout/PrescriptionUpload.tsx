/**
 * Prescription Upload Component
 * Allows users to upload prescription images for prescription medicines
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import {
  BodyText,
  Heading3,
  Caption,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';

interface PrescriptionUploadProps {
  prescriptionImages: string[];
  onImagesChange: (images: string[]) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  prescriptionImages,
  onImagesChange,
}) => {
  const handleAddPrescription = () => {
    // In a real app, you would use react-native-image-picker or similar
    Alert.alert(
      'Upload Prescription',
      'Choose how you want to upload your prescription',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Mock adding a prescription image
            const mockImageUrl = `https://example.com/prescription_${Date.now()}.jpg`;
            onImagesChange([...prescriptionImages, mockImageUrl]);
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Mock adding a prescription image
            const mockImageUrl = `https://example.com/prescription_${Date.now()}.jpg`;
            onImagesChange([...prescriptionImages, mockImageUrl]);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  const handleRemovePrescription = (index: number) => {
    Alert.alert(
      'Remove Prescription',
      'Are you sure you want to remove this prescription image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedImages = prescriptionImages.filter(
              (_, i) => i !== index,
            );
            onImagesChange(updatedImages);
          },
        },
      ],
    );
  };

  const renderPrescriptionImage = (imageUrl: string, index: number) => (
    <View key={index} style={styles.prescriptionImageContainer}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.prescriptionImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePrescription(index)}
      >
        <BodyText style={styles.removeButtonText}>×</BodyText>
      </TouchableOpacity>
    </View>
  );

  return (
    <Card style={styles.container}>
      <Column style={styles.content}>
        <Row style={styles.header}>
          <Column style={styles.headerText}>
            <Heading3 color="primary" style={styles.title}>
              Upload Prescription
            </Heading3>
            <Caption color="secondary">
              Required for prescription medicines
            </Caption>
          </Column>
          <BodyText style={styles.requiredIcon}>📋</BodyText>
        </Row>

        {/* Upload Instructions */}
        <View style={styles.instructionsContainer}>
          <BodyText color="primary" style={styles.instructionsTitle}>
            Guidelines for uploading prescription:
          </BodyText>
          <Column style={styles.instructionsList}>
            <Row style={styles.instructionItem}>
              <BodyText style={styles.bullet}>•</BodyText>
              <BodyText color="secondary" style={styles.instructionText}>
                Ensure prescription is clearly visible and readable
              </BodyText>
            </Row>
            <Row style={styles.instructionItem}>
              <BodyText style={styles.bullet}>•</BodyText>
              <BodyText color="secondary" style={styles.instructionText}>
                Include doctor's name, signature, and date
              </BodyText>
            </Row>
            <Row style={styles.instructionItem}>
              <BodyText style={styles.bullet}>•</BodyText>
              <BodyText color="secondary" style={styles.instructionText}>
                Upload original prescription (not photocopies)
              </BodyText>
            </Row>
            <Row style={styles.instructionItem}>
              <BodyText style={styles.bullet}>•</BodyText>
              <BodyText color="secondary" style={styles.instructionText}>
                Maximum 3 images allowed
              </BodyText>
            </Row>
          </Column>
        </View>

        {/* Uploaded Prescriptions */}
        {prescriptionImages.length > 0 && (
          <View style={styles.uploadedSection}>
            <BodyText color="primary" style={styles.uploadedTitle}>
              Uploaded Prescriptions ({prescriptionImages.length})
            </BodyText>
            <View style={styles.prescriptionGrid}>
              {prescriptionImages.map(renderPrescriptionImage)}
            </View>
          </View>
        )}

        {/* Upload Button */}
        {prescriptionImages.length < 3 && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleAddPrescription}
          >
            <Column style={styles.uploadContent}>
              <BodyText style={styles.uploadIcon}>📷</BodyText>
              <BodyText color="primary" style={styles.uploadText}>
                {prescriptionImages.length === 0
                  ? 'Upload Prescription'
                  : 'Add Another'}
              </BodyText>
              <Caption color="secondary">
                Tap to take photo or choose from gallery
              </Caption>
            </Column>
          </TouchableOpacity>
        )}

        {/* Verification Notice */}
        <View style={styles.verificationNotice}>
          <Row style={styles.noticeRow}>
            <BodyText style={styles.noticeIcon}>ℹ️</BodyText>
            <Column style={styles.noticeText}>
              <BodyText color="primary" style={styles.noticeTitle}>
                Prescription Verification
              </BodyText>
              <Caption color="secondary">
                Our pharmacist will verify your prescription before dispensing
                medicines. Invalid prescriptions will result in order
                cancellation.
              </Caption>
            </Column>
          </Row>
        </View>

        {/* Upload Status */}
        {prescriptionImages.length > 0 && (
          <View style={styles.statusContainer}>
            <Row style={styles.statusRow}>
              <BodyText style={styles.statusIcon}>✅</BodyText>
              <BodyText color="success" style={styles.statusText}>
                {prescriptionImages.length} prescription
                {prescriptionImages.length > 1 ? 's' : ''} uploaded successfully
              </BodyText>
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
  header: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    marginBottom: 0,
  },
  requiredIcon: {
    fontSize: 24,
  },
  instructionsContainer: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsList: {
    gap: spacing.xs,
  },
  instructionItem: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
    marginTop: 2,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  uploadedSection: {
    gap: spacing.sm,
  },
  uploadedTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  prescriptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  prescriptionImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    backgroundColor: colors.light.surface,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
  },
  uploadButton: {
    backgroundColor: colors.light.surface,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  uploadContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verificationNotice: {
    backgroundColor: colors.warning[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  noticeRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  noticeIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    gap: spacing.xs,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: colors.success[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  statusRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});

export default PrescriptionUpload;
