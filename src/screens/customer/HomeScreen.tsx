/**
 * Home Screen
 * Main dashboard with navigation to other features using established patterns
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  Screen,
  Container,
  Card,
  Column,
  Row,
  Button,
  Heading1,
  Heading3,
  BodyText,
  Caption,
  Spacer,
  Divider,
} from '@components';
import { useTheme } from '@contexts/ThemeContext';
import { useAuthStore, removeToken } from '@store/AuthStore';
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';
import { getRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';

// Define interfaces for dashboard data
interface DashboardStats {
  activeOrders: number;
  nearbyStores: number;
  prescriptions: number;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'info';
}

export const HomeScreen: React.FC = () => {
  const { toggleTheme, themeMode } = useTheme();
  const { user, isUserLoggedIn } = useAuthStore();

  // Local state
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    nearbyStores: 0,
    prescriptions: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn) {
      loadDashboardData();
    }
  }, [isUserLoggedIn]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load dashboard stats
      const statsResponse: ApiResponse<DashboardStats> =
        await getRequest<DashboardStats>('/dashboard/stats');
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load recent activities
      const activitiesResponse: ApiResponse<RecentActivity[]> =
        await getRequest<RecentActivity[]>('/dashboard/activities');
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data);
      }
    } catch (error) {
      // For demo purposes, use mock data
      setStats({
        activeOrders: 12,
        nearbyStores: 5,
        prescriptions: 3,
      });

      setActivities([
        {
          id: '1',
          title: 'Order #12345 delivered',
          description: '2 hours ago',
          timestamp: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          title: 'Prescription refill reminder',
          description: '1 day ago',
          timestamp: new Date().toISOString(),
          status: 'pending',
        },
        {
          id: '3',
          title: 'New store nearby',
          description: '3 days ago',
          timestamp: new Date().toISOString(),
          status: 'info',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          removeToken(); // Clear auth state using your AuthStore
          resetAndNavigate('LoginScreen'); // Navigate using your NavigationUtils
        },
      },
    ]);
  };

  const quickActions = [
    {
      title: 'Search Stores',
      description: 'Find nearby pharmacies',
      action: () => navigate('Search'),
    },
    {
      title: 'My Orders',
      description: 'Track your orders',
      action: () => navigate('OrderScreen'),
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      action: () => navigate('ProfileScreen'),
    },
    {
      title: 'Component Demo',
      description: 'View design system',
      action: () => navigate('ComponentShowcase'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Completed';
      case 'pending':
        return '⚠ Pending';
      case 'info':
        return 'ℹ Info';
      default:
        return '';
    }
  };

  return (
    <Screen>
      <Container padded>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Row
            justify="space-between"
            style={{ marginTop: 20, marginBottom: 24 }}
          >
            <Column>
              <Heading1 color="contrast">
                Welcome{user?.name ? `, ${user.name}` : ' to MedCo'}
              </Heading1>
              <Caption color="muted">Your healthcare companion</Caption>
            </Column>
            <Row gap="sm">
              <Button
                title={themeMode === 'light' ? '🌙' : '☀️'}
                variant="outline"
                size="sm"
                onPress={toggleTheme}
              />
              <Button
                title="Logout"
                variant="ghost"
                size="sm"
                onPress={handleLogout}
              />
            </Row>
          </Row>

          {/* Quick Stats */}
          <Card style={{ marginBottom: 24 }}>
            <Heading3 style={{ marginBottom: 16 }}>Quick Overview</Heading3>
            <Row justify="space-between">
              <Column align="center">
                <Heading3 color="primary">{stats.activeOrders}</Heading3>
                <Caption color="muted">Active Orders</Caption>
              </Column>
              <Column align="center">
                <Heading3 color="success">{stats.nearbyStores}</Heading3>
                <Caption color="muted">Nearby Stores</Caption>
              </Column>
              <Column align="center">
                <Heading3 color="warning">{stats.prescriptions}</Heading3>
                <Caption color="muted">Prescriptions</Caption>
              </Column>
            </Row>
          </Card>

          {/* Quick Actions */}
          <Heading3 style={{ marginBottom: 16 }}>Quick Actions</Heading3>
          <Column gap="md">
            {quickActions.map((action, index) => (
              <Card key={index} variant="outlined">
                <Row justify="space-between" align="center">
                  <Column style={{ flex: 1 }}>
                    <BodyText style={{ fontWeight: '600', marginBottom: 4 }}>
                      {action.title}
                    </BodyText>
                    <Caption color="muted">{action.description}</Caption>
                  </Column>
                  <Button
                    title="Go"
                    variant="primary"
                    size="sm"
                    onPress={action.action}
                  />
                </Row>
              </Card>
            ))}
          </Column>

          <Spacer size="xl" />

          {/* Recent Activity */}
          <Card>
            <Heading3 style={{ marginBottom: 16 }}>Recent Activity</Heading3>
            <Column gap="md">
              {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <Row justify="space-between">
                    <Column style={{ flex: 1 }}>
                      <BodyText>{activity.title}</BodyText>
                      <Caption color="muted">{activity.description}</Caption>
                    </Column>
                    <Caption color={getStatusColor(activity.status) as any}>
                      {getStatusIcon(activity.status)}
                    </Caption>
                  </Row>
                  {index < activities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Column>
          </Card>

          <Spacer size="xxxl" />
        </ScrollView>
      </Container>
    </Screen>
  );
};

export default HomeScreen;
