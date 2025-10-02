/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppRoutings } from 'src/screens';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppRoutings isDark={isDarkMode}/>
  );
}

export default App;
