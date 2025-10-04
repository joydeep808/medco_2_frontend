/**
 * Bottom Tab Navigator
 * Main tab navigation with Home, Search, Cart, and Profile tabs
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCartStore } from '@store/CartStore';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import CartScreen from '../screens/cart/CartScreen.new';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { totalItems } = useCartStore();

  const renderTabIcon = (routeName: string, focused: boolean) => {
    let icon = '';
    let color = focused ? '#007AFF' : '#666';

    switch (routeName) {
      case 'Home':
        icon = '🏠';
        break;
      case 'Search':
        icon = '🔍';
        break;
      case 'Cart':
        icon = '🛒';
        break;
      case 'Profile':
        icon = '👤';
        break;
      default:
        icon = '📱';
    }

    return (
      <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, { color }]}>{icon}</Text>
        {routeName === 'Cart' && totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabLabel = (routeName: string, focused: boolean) => {
    const color = focused ? '#007AFF' : '#666';
    return <Text style={[styles.tabLabel, { color }]}>{routeName}</Text>;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
        tabBarLabel: ({ focused }) => renderTabLabel(route.name, focused),
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{}} />
      <Tab.Screen name="Search" component={SearchScreen} options={{}} />
      <Tab.Screen name="Cart" component={CartScreen} options={{}} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButtonTestID: 'profile-tab',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator;
