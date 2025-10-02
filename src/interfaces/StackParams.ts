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
  Search: undefined;
  Cart: {
    storeId: number;
  };
  Onboarding: undefined;
  OTP: undefined;

  CartScreen: {
    storeId: number;
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
