import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '@interfaces/StackParams';
import { navigationRef } from '@utils/NavigationUtils';

// Import screens
import SplashScreen from './splash/SplashScreen';
import LoginScreen from './auth/LoginScreen';
import HomeScreen from './customer/HomeScreen';
import ComponentShowcase from './example/ComponentShowcase';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppRoutings = ({ isDark }: { isDark: boolean }) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        {/* Add the component showcase for demo purposes */}
        <Stack.Screen
          name="ComponentShowcase"
          component={ComponentShowcase}
          options={{ headerShown: true, title: 'Design System' }}
        />

        {/* Placeholder screens for navigation - you can implement these later */}
        <Stack.Screen name="Register" component={PlaceholderScreen} />
        <Stack.Screen name="Search" component={PlaceholderScreen} />
        <Stack.Screen name="OrderScreen" component={PlaceholderScreen} />
        <Stack.Screen name="ProfileScreen" component={PlaceholderScreen} />
        <Stack.Screen name="StoreScreen" component={PlaceholderScreen} />
        <Stack.Screen name="Cart" component={PlaceholderScreen} />
        <Stack.Screen name="CartScreen" component={PlaceholderScreen} />
        <Stack.Screen name="Onboarding" component={PlaceholderScreen} />
        <Stack.Screen name="OTP" component={PlaceholderScreen} />
        <Stack.Screen name="LocationSearch" component={PlaceholderScreen} />
        <Stack.Screen
          name="OrderDetailedScreen"
          component={PlaceholderScreen}
        />
        <Stack.Screen name="CategoryScreen" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Placeholder component for unimplemented screens
const PlaceholderScreen: React.FC = () => {
  const { Container, Heading2, BodyText, Button } = require('@components');
  const { useNavigation } = require('@react-navigation/native');

  const navigation = useNavigation();

  return (
    <Container centered padded>
      <Heading2 style={{ textAlign: 'center', marginBottom: 16 }}>
        Coming Soon
      </Heading2>
      <BodyText
        color="secondary"
        style={{ textAlign: 'center', marginBottom: 24 }}
      >
        This screen is not implemented yet.
      </BodyText>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
        variant="primary"
      />
    </Container>
  );
};
