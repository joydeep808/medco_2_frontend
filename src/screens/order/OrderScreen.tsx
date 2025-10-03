import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BodyText, Heading2, Button } from '@components';
import { useOrderStore } from '@store/OrderStore';
import { navigate } from '@utils/NavigationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderScreen: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { orders, loading, error, getMyOrders } = useOrderStore();

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
    await getMyOrders(0, 20, status);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FF9500';
      case 'CONFIRMED':
        return '#007AFF';
      case 'PREPARED':
        return '#5856D6';
      case 'PICKED_UP':
        return '#AF52DE';
      case 'DELIVERED':
        return '#34C759';
      case 'CANCELLED':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PREPARED':
        return 'Ready for Pickup';
      case 'PICKED_UP':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStatusButton = (status: string, label: string) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        selectedStatus === status && styles.activeStatusButton,
      ]}
      onPress={() => setSelectedStatus(status)}
    >
      <BodyText
        color={selectedStatus === status ? 'white' : 'secondary'}
        size="sm"
      >
        {label}
      </BodyText>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() =>
        navigate('OrderDetails', { orderNumber: item.orderNumber })
      }
    >
      <View style={styles.orderHeader}>
        <View>
          <Heading2 size="sm" color="primary">
            {item.orderNumber}
          </Heading2>
          <BodyText color="secondary" size="sm">
            {item.pharmacyName}
          </BodyText>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <BodyText color="white" size="xs" weight="bold">
              {getStatusText(item.status)}
            </BodyText>
          </View>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <BodyText color="secondary" size="sm">
          {item.totalQuantity} items • ₹{item.totalAmount}
        </BodyText>
        <BodyText color="secondary" size="sm">
          Ordered on {formatDate(item.orderDate)}
        </BodyText>
      </View>

      {item.items && item.items.length > 0 && (
        <View style={styles.itemsPreview}>
          <BodyText color="primary" size="sm">
            {item.items[0].medicineName}
            {item.items.length > 1 && ` +${item.items.length - 1} more`}
          </BodyText>
        </View>
      )}

      <View style={styles.orderActions}>
        {item.status === 'PENDING' && (
          <Button
            title="Cancel Order"
            variant="outline"
            size="sm"
            onPress={() =>
              navigate('CancelOrder', { orderNumber: item.orderNumber })
            }
          />
        )}
        {item.status === 'DELIVERED' && (
          <Button
            title="Reorder"
            variant="outline"
            size="sm"
            onPress={() => {
              // Handle reorder
              console.log('Reorder:', item.orderNumber);
            }}
          />
        )}
        <Button
          title="View Details"
          size="sm"
          onPress={() =>
            navigate('OrderDetails', { orderNumber: item.orderNumber })
          }
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BodyText color="secondary" align="center" size="lg">
        📦
      </BodyText>
      <BodyText color="secondary" align="center" style={styles.emptyTitle}>
        No orders found
      </BodyText>
      <BodyText color="secondary" align="center" size="sm">
        {selectedStatus === 'ALL'
          ? "You haven't placed any orders yet"
          : `No ${selectedStatus.toLowerCase()} orders found`}
      </BodyText>
      <Button
        title="Start Shopping"
        style={styles.emptyButton}
        onPress={() => navigate('HomeScreen')}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Button
          title="← Back"
          variant="ghost"
          size="sm"
          onPress={() => navigate('HomeScreen')}
        />
        <Heading2 color="primary">My Orders</Heading2>
        <View style={{ width: 60 }} />
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        {renderStatusButton('ALL', 'All')}
        {renderStatusButton('PENDING', 'Pending')}
        {renderStatusButton('CONFIRMED', 'Confirmed')}
        {renderStatusButton('DELIVERED', 'Delivered')}
        {renderStatusButton('CANCELLED', 'Cancelled')}
      </View>

      {/* Loading */}
      {loading && orders.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <BodyText color="secondary" style={styles.loadingText}>
            Loading orders...
          </BodyText>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <BodyText color="error" align="center">
            {error}
          </BodyText>
          <Button
            title="Retry"
            variant="outline"
            size="sm"
            onPress={loadOrders}
            style={styles.retryButton}
          />
        </View>
      )}

      {/* Orders List */}
      {!loading && !error && (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderNumber}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            orders.length === 0 ? styles.emptyListContainer : undefined
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeStatusButton: {
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 16,
  },
  orderItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderDetails: {
    marginBottom: 8,
    gap: 2,
  },
  itemsPreview: {
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyButton: {
    marginTop: 24,
  },
});

export default OrderScreen;
