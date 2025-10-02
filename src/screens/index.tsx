
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '@interfaces/StackParams';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef();




export const AppRoutings=({isDark}:{isDark:boolean})=>{

    return (
        <NavigationContainer  ref={navigationRef}>
            <StatusBar  barStyle={isDark ? 'light-content' : 'dark-content'} />
            <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen name="LoginScreen" component={Login} />
            </Stack.Navigator>                

        </NavigationContainer>
    )
}