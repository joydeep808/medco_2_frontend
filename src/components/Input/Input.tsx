/**
 * Reusable Input Component
 * Provides consistent form input styling with validation states
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '../../styles/colors';
import { spacing, typography, borderRadius } from '../../styles/globalStyles';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: InputVariant;
  state?: InputState;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  variant = 'outlined',
  state = 'default',
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputStyle = [
    styles.base,
    styles[variant],
    isFocused && styles.focused,
    state === 'error' && styles.error,
    state === 'success' && styles.success,
    state === 'disabled' && styles.disabled,
    style,
  ];

  const displayText = errorText || helperText;
  const textColor = errorText ? colors.error.DEFAULT : colors.light.textMuted;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={state !== 'disabled'}
        placeholderTextColor={colors.light.textMuted}
        {...props}
      />

      {displayText && (
        <Text style={[styles.helperText, { color: textColor }]}>
          {displayText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.light.textPrimary,
    marginBottom: spacing.xs,
  },

  base: {
    fontSize: typography.fontSize.base,
    color: colors.light.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.md,
    minHeight: 48,
  },

  default: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },

  filled: {
    backgroundColor: colors.light.surfaceHighlight,
    borderWidth: 0,
  },

  outlined: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.light.border,
  },

  focused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
  },

  error: {
    borderColor: colors.error.DEFAULT,
    borderWidth: 2,
  },

  success: {
    borderColor: colors.success.DEFAULT,
    borderWidth: 2,
  },

  disabled: {
    backgroundColor: colors.light.surface,
    opacity: 0.6,
  },

  helperText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;
