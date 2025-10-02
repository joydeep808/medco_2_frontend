/**
 * Reusable Layout Components
 * Provides consistent spacing and layout patterns
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/globalStyles';

// Container component
interface ContainerProps {
  children: React.ReactNode;
  padded?: boolean;
  centered?: boolean;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padded = false,
  centered = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    padded && styles.padded,
    centered && styles.centered,
    style,
  ];

  return <View style={containerStyle}>{children}</View>;
};

// Screen wrapper component
interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  padded = true,
  style,
  ...props
}) => {
  const screenStyle = [styles.screen, padded && styles.padded, style];

  if (scrollable) {
    return (
      <ScrollView
        style={screenStyle}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={screenStyle}>{children}</View>;
};

// Row component for horizontal layouts
interface RowProps {
  children: React.ReactNode;
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  wrap?: boolean;
  gap?: keyof typeof spacing;
  style?: ViewStyle;
}

export const Row: React.FC<RowProps> = ({
  children,
  justify = 'flex-start',
  align = 'center',
  wrap = false,
  gap,
  style,
}) => {
  const rowStyle = [
    styles.row,
    {
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: gap ? spacing[gap] : 0,
    },
    style,
  ];

  return <View style={rowStyle}>{children}</View>;
};

// Column component for vertical layouts
interface ColumnProps {
  children: React.ReactNode;
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: keyof typeof spacing;
  style?: ViewStyle;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  justify = 'flex-start',
  align = 'stretch',
  gap,
  style,
}) => {
  const columnStyle = [
    styles.column,
    {
      justifyContent: justify,
      alignItems: align,
      gap: gap ? spacing[gap] : 0,
    },
    style,
  ];

  return <View style={columnStyle}>{children}</View>;
};

// Spacer component for adding space between elements
interface SpacerProps {
  size?: keyof typeof spacing;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  horizontal = false,
}) => {
  const spacerStyle = horizontal
    ? { width: spacing[size] }
    : { height: spacing[size] };

  return <View style={spacerStyle} />;
};

// Divider component
interface DividerProps {
  vertical?: boolean;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  style,
}) => {
  const dividerStyle = [
    vertical ? styles.dividerVertical : styles.dividerHorizontal,
    style,
  ];

  return <View style={dividerStyle} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  padded: {
    paddingHorizontal: spacing.md,
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  screen: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  row: {
    flexDirection: 'row',
  },

  column: {
    flexDirection: 'column',
  },

  dividerHorizontal: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.md,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: colors.light.border,
    marginHorizontal: spacing.md,
  },
});

export default { Container, Screen, Row, Column, Spacer, Divider };
