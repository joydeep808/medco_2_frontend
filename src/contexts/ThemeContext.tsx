/**
 * Theme Context Provider
 * Manages theme state and provides theme switching functionality
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Theme, ThemeMode, lightTheme, darkTheme } from '../styles/theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    initialTheme || (Appearance.getColorScheme() as ThemeMode) || 'light',
  );
  const [isSystemTheme, setIsSystemTheme] = useState(!initialTheme);

  // Listen to system theme changes
  useEffect(() => {
    if (isSystemTheme) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme) {
          setThemeModeState(colorScheme as ThemeMode);
        }
      });

      return () => subscription?.remove();
    }
  }, [isSystemTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setIsSystemTheme(false);
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const setSystemTheme = (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    if (useSystem) {
      const systemTheme = Appearance.getColorScheme() as ThemeMode;
      if (systemTheme) {
        setThemeModeState(systemTheme);
      }
    }
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isSystemTheme,
    setSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
