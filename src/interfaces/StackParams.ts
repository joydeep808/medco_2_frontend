export type RootStackParamList = {
  HomeScreen: undefined;
  SplashScreen: undefined;
  LoginScreen: {
    redirect?: keyof RootStackParamList;
  }; // No parameters for Login screen
  Register: undefined; // No parameters for Login screen
  StoreScreen: {
    storeId: number;
  };
  PharmacyScreen: {
    pharmacyId: number;
  };
  Search: undefined;
  Cart: {
    storeId: number;
  };
  Onboarding: undefined;
  OTP: undefined;

  // Cart routes
  CartScreen: {
    pharmacyId?: number; // Optional - if provided, shows single pharmacy cart
  };
  AllCartsScreen: undefined; // Shows all pharmacy carts

  CheckoutScreen: {
    pharmacyId: string;
  };
  LocationSearch: undefined;
  ProfileScreen: undefined;
  OrderScreen: undefined;
  OrderDetailedScreen: {
    orderId: string;
  };
  CategoryScreen: {
    id: number;
  };

  // Design System Demo
  ComponentShowcase: undefined;
};
