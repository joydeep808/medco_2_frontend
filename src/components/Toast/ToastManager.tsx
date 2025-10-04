/**
 * Toast Manager
 * Global toast management system
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast, ToastProps, ToastType } from './Toast';

interface ToastItem extends ToastProps {
  id: string;
}

interface ToastManagerRef {
  show: (
    message: string,
    type?: ToastType,
    options?: Partial<ToastProps>,
  ) => void;
  success: (message: string, options?: Partial<ToastProps>) => void;
  error: (message: string, options?: Partial<ToastProps>) => void;
  warning: (message: string, options?: Partial<ToastProps>) => void;
  info: (message: string, options?: Partial<ToastProps>) => void;
}

let toastManagerRef: ToastManagerRef | null = null;

export const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      options: Partial<ToastProps> = {},
    ) => {
      const id = Date.now().toString();
      const toast: ToastItem = {
        id,
        message,
        type,
        ...options,
        onHide: () => {
          setToasts(prev => prev.filter(t => t.id !== id));
          options.onHide?.();
        },
      };

      setToasts(prev => {
        // Keep only the latest 3 toasts
        const newToasts = [toast, ...prev.slice(0, 2)];
        return newToasts;
      });
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      show(message, 'success', options);
    },
    [show],
  );

  const error = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      show(message, 'error', options);
    },
    [show],
  );

  const warning = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      show(message, 'warning', options);
    },
    [show],
  );

  const info = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      show(message, 'info', options);
    },
    [show],
  );

  // Set the ref for global access
  React.useEffect(() => {
    toastManagerRef = { show, success, error, warning, info };
    return () => {
      toastManagerRef = null;
    };
  }, [show, success, error, warning, info]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast, index) => (
        <View
          key={toast.id}
          style={[styles.toastWrapper, { top: 50 + index * 80 }]}
          pointerEvents="box-none"
        >
          <Toast {...toast} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

// Global toast functions
export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: Partial<ToastProps>,
) => {
  toastManagerRef?.show(message, type, options);
};

export const showSuccessToast = (
  message: string,
  options?: Partial<ToastProps>,
) => {
  toastManagerRef?.success(message, options);
};

export const showErrorToast = (
  message: string,
  options?: Partial<ToastProps>,
) => {
  toastManagerRef?.error(message, options);
};

export const showWarningToast = (
  message: string,
  options?: Partial<ToastProps>,
) => {
  toastManagerRef?.warning(message, options);
};

export const showInfoToast = (
  message: string,
  options?: Partial<ToastProps>,
) => {
  toastManagerRef?.info(message, options);
};

export default ToastManager;
