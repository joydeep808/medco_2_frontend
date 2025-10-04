/**
 * Checkout Screen
 * Complete checkout flow with address selection, payment, and order placement
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  BodyText,
  Heading2,
  Heading3,
  Button,
  Card,
  Row,
  Column,
  spacing,
  colors,
  borderRadius,
  shadows,
} from '@components';
import { useCartStore } from '@store/CartStore';
import { getRequest, postRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';
import checkoutService, { CheckoutRequest } from '@services/CheckoutService';
import { navigate, goBack } from '@utils/NavigationUtils';

// Razorpay integration
import RazorpayCheckout from 'react-native-razorpay';
import OrderSummary from '@components/Checkout/OrderSummary';
import PrescriptionUpload from '@components/Checkout/PrescriptionUpload';
import DeliverySlotSelector from '@components/Checkout/DeliverySlotSelector';
import PaymentMethods from '@components/Checkout/PaymentMethods';
import AddressSelector from '@components/Checkout/AddressSelector';

interface Address {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions?: string;
}

interface CartData {
  id: number;
  userId: number;
  items: Array<{
    id: number;
    medicineVariantId: number;
    medicineName: string;
    medicineImage: string;
    variantName: string;
    pharmacyId: number;
    pharmacyName: string;
    quantity: number;
    mrp: number;
    sellingPrice: number;
    totalMrp: number;
    totalPrice: number;
    discount: number;
    totalDiscount: number;
    gstRate: number;
    gstAmount: number;
    itemFinalAmount: number;
    savings: number;
    stockQuantity: number;
    isAvailable: boolean;
  }>;
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  totalQuantity: number;
  couponCode?: string;
  couponDiscount: number;
  finalAmount: number;
  gstAmount: number;
  deliveryCharge: number;
  minOrderAmount: number;
  isFreeDeliveryEligible: boolean;
  totalSavings: number;
}

interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  pharmacyId: number;
  pharmacyName: string;
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  couponDiscount: number;
  offerDiscount: number;
  couponCode?: string;
  totalDiscount: number;
  paymentGatewayOrderId: string;
  razorpayOrderId: string;
  paymentStatus: string;
  orderDate: number;
  estimatedDeliveryTime: number;
  deliverySlot: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
}

type CheckoutScreenRouteProp = RouteProp<
  { CheckoutScreen: { pharmacyId: string } },
  'CheckoutScreen'
>;

export const CheckoutScreen: React.FC = () => {
  const route = useRoute<CheckoutScreenRouteProp>();
  const { pharmacyId } = route.params;

  const { carts } = useCartStore();
  const cart = carts[pharmacyId];

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'RAZORPAY' | 'COD'
  >('RAZORPAY');
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<string>('');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [prescriptionImages, setPrescriptionImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [validatingCart, setValidatingCart] = useState(false);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Your cart is empty. Please add items to proceed.',
        [{ text: 'OK', onPress: () => goBack() }],
      );
      return;
    }

    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAddresses(), fetchCartData(), validateCart()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      Alert.alert('Error', 'Failed to load checkout data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getRequest<
        ApiResponse<{
          content: Address[];
          pagination: any;
        }>
      >('/addresses?page=0&size=50');

      if (response.success) {
        setAddresses(response.data.content);
        const defaultAddress = response.data.content.find(
          addr => addr.isDefault,
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (response.data.content.length > 0) {
          setSelectedAddress(response.data.content[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchCartData = async () => {
    try {
      // Find cart ID from local cart data
      const cartId = cart.items[0]?.id; // Assuming cart has an ID
      if (!cartId) return;

      const response = await getRequest<ApiResponse<CartData>>(
        `/cart/${cartId}`,
      );

      if (response.success) {
        setCartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      // Fallback to local cart data
      const fallbackCartData: CartData = {
        id: parseInt(pharmacyId),
        userId: 1, // This should come from auth store
        items: cart.items.map(item => ({
          id: parseInt(item.id),
          medicineVariantId: parseInt(item.medicineId),
          medicineName: item.name,
          medicineImage: item.image || '',
          variantName: `${item.strength} ${item.form}`,
          pharmacyId: parseInt(item.pharmacyId),
          pharmacyName: item.pharmacyName,
          quantity: item.quantity,
          mrp: item.mrp,
          sellingPrice: item.price,
          totalMrp: item.mrp * item.quantity,
          totalPrice: item.price * item.quantity,
          discount: item.discount,
          totalDiscount: (item.mrp - item.price) * item.quantity,
          gstRate: 12,
          gstAmount: item.price * item.quantity * 0.12,
          itemFinalAmount: item.price * item.quantity * 1.12,
          savings: (item.mrp - item.price) * item.quantity,
          stockQuantity: 100, // Default
          isAvailable: item.inStock,
        })),
        subtotal: cart.subtotal,
        totalMrp: cart.subtotal + cart.discount,
        totalDiscount: cart.discount,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        couponDiscount: 0,
        finalAmount: cart.total,
        gstAmount: cart.taxes,
        deliveryCharge: cart.deliveryFee,
        minOrderAmount: 100,
        isFreeDeliveryEligible: cart.deliveryFee === 0,
        totalSavings: cart.discount,
      };
      setCartData(fallbackCartData);
    }
  };

  const validateCart = async () => {
    try {
      setValidatingCart(true);
      const cartId = cart.items[0]?.id;
      if (!cartId) return;

      const response = await checkoutService.validateCart(parseInt(cartId));

      if (response.success && !response.data.isValid) {
        Alert.alert(
          'Cart Validation',
          `Some items in your cart need attention:\n${response.data.errors.join(
            '\n',
          )}`,
          [
            { text: 'Update Cart', onPress: () => goBack() },
            { text: 'Continue', style: 'cancel' },
          ],
        );
      }
    } catch (error) {
      console.error('Error validating cart:', error);
    } finally {
      setValidatingCart(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address.');
      return;
    }

    // Check if prescription is required
    const requiresPrescription = cart.items.some(
      item => item.requiresPrescription,
    );
    if (requiresPrescription && prescriptionImages.length === 0) {
      Alert.alert(
        'Prescription Required',
        'Please upload prescription for prescription medicines.',
      );
      return;
    }

    try {
      setPlacing(true);

      // Simplified checkout data as per your requirement
      const checkoutData = {
        deliveryAddressId: selectedAddress.id,
        cartId: cartData?.id || parseInt(pharmacyId),
      };

      const response = await postRequest<CheckoutResponse>(
        '/orders/checkout',
        checkoutData,
      );

      if (response.success) {
        if (selectedPaymentMethod === 'RAZORPAY') {
          await handleRazorpayPayment(response.data);
        } else {
          // COD order placed successfully
          Alert.alert(
            'Order Placed!',
            `Your order ${response.data.orderNumber} has been placed successfully.`,
            [
              {
                text: 'View Order',
                onPress: () =>
                  navigate('OrderDetailedScreen', {
                    orderId: response.data.orderNumber,
                  }),
              },
            ],
          );
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const handleRazorpayPayment = async (orderData: CheckoutResponse) => {
    const options = {
      description: `Order ${orderData.orderNumber}`,
      currency: 'INR',
      key: 'rzp_test_hzM4YnSc7B4d2b', // Your Razorpay key
      amount: 0, // Amount will be auto-fetched from order_id
      order_id: orderData.razorpayOrderId,
      name: 'MedCo',
      prefill: {
        email: 'customer@example.com', // Get from user profile
        contact: '9999999999', // Get from user profile
        name: 'Customer Name', // Get from user profile
      },
      notes: {
        address: 'Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: function () {
          Alert.alert(
            'Payment Cancelled',
            'You cancelled the payment. Your order is still pending.',
          );
        },
      },
    };

    try {
      const data = await RazorpayCheckout.open(options);

      // Payment successful, verify with backend
      await verifyPayment({
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      Alert.alert(
        'Payment Successful!',
        `Your order ${orderData.orderNumber} has been placed successfully.`,
        [
          {
            text: 'View Order',
            onPress: () =>
              navigate('OrderDetailedScreen', {
                orderId: orderData.orderNumber,
              }),
          },
        ],
      );
    } catch (error: any) {
      console.error('Razorpay payment error:', error);

      if (error.code === 'payment_cancelled') {
        Alert.alert(
          'Payment Cancelled',
          'You cancelled the payment. Your order is still pending.',
        );
      } else {
        Alert.alert(
          'Payment Failed',
          'Payment failed. Please try again or choose a different payment method.',
        );
      }
    }
  };

  const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await postRequest(
        '/orders/verify-payment',
        paymentData,
      );

      if (!response.success) {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      Alert.alert(
        'Verification Failed',
        'Payment verification failed. Please contact support.',
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <BodyText color="secondary">Loading checkout...</BodyText>
        </View>
      </SafeAreaView>
    );
  }

  if (!cartData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <BodyText color="secondary">Failed to load cart data</BodyText>
          <Button title="Retry" variant="primary" onPress={fetchInitialData} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Row style={styles.headerContent}>
          <Button
            title="← Back"
            variant="ghost"
            style={styles.backButton}
            onPress={goBack}
          />
          <Heading2 color="primary">Checkout</Heading2>
          <View style={styles.headerSpacer} />
        </Row>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Selection */}
        <AddressSelector
          addresses={addresses}
          selectedAddress={selectedAddress}
          onAddressSelect={setSelectedAddress}
          onAddNewAddress={() => {
            // Navigate to add address screen
            console.log('Add new address');
          }}
        />

        {/* Delivery Slot Selection */}
        <DeliverySlotSelector
          selectedSlot={selectedDeliverySlot}
          onSlotSelect={setSelectedDeliverySlot}
          deliveryInstructions={deliveryInstructions}
          onInstructionsChange={setDeliveryInstructions}
        />

        {/* Prescription Upload */}
        {cart.items.some(item => item.requiresPrescription) && (
          <PrescriptionUpload
            prescriptionImages={prescriptionImages}
            onImagesChange={setPrescriptionImages}
          />
        )}

        {/* Order Summary */}
        <OrderSummary
          cartData={cartData}
          specialInstructions={specialInstructions}
          onSpecialInstructionsChange={setSpecialInstructions}
        />

        {/* Payment Methods */}
        <PaymentMethods
          selectedMethod={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
          totalAmount={cartData.finalAmount}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={
            placing
              ? 'Placing Order...'
              : `Place Order • ₹${cartData.finalAmount.toFixed(0)}`
          }
          variant="primary"
          size="lg"
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={placing || validatingCart}
          loading={placing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    ...shadows.sm,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 0,
  },
  headerSpacer: {
    width: 60, // Same width as back button for centering
  },
  content: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100, // Space for fixed button
  },
  checkoutContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    ...shadows.lg,
  },
  placeOrderButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CheckoutScreen;
