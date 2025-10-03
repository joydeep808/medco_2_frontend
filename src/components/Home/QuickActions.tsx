/**
 * Quick Actions Component
 * Quick access buttons for common actions like Upload Prescription, Emergency, etc.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  style?: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  style,
}) => {
  const defaultActions: QuickAction[] = [
    {
      id: 'prescription',
      title: 'Upload\nPrescription',
      icon: '📋',
      color: '#007AFF',
      backgroundColor: '#E3F2FD',
      onPress: () => console.log('Upload prescription'),
    },
    {
      id: 'emergency',
      title: 'Emergency\nMedicines',
      icon: '🚨',
      color: '#F44336',
      backgroundColor: '#FFEBEE',
      onPress: () => console.log('Emergency medicines'),
    },
    {
      id: 'health-checkup',
      title: 'Health\nCheckup',
      icon: '🩺',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      onPress: () => console.log('Health checkup'),
    },
    {
      id: 'lab-tests',
      title: 'Lab\nTests',
      icon: '🧪',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      onPress: () => console.log('Lab tests'),
    },
  ];

  const quickActions = actions || defaultActions;

  const renderAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <Text style={[styles.actionTitle, { color: action.color }]}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>{quickActions.map(renderAction)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default QuickActions;
