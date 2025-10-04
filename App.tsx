/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@contexts/ThemeContext';
import { AppRoutings } from '@screens';
import { ToastManager } from '@components';
import '@config/_axios/AxiosConfig'; // Initialize axios interceptors

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme={isDarkMode ? 'dark' : 'light'}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <AppRoutings isDark={isDarkMode} />
        <ToastManager />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
