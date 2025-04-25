import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import OnboardingScreens from './screens/onboarding';
import SignupScreen from './screens/signup';
import SplashScreen from './screens/splashscreen';
import SigninScreen from './screens/signin';
import ForgetScreen from './screens/forget';
import fonts from './constants/styles';
import HomeScreen from './screens/home';
import OrderScreen from './screens/order';
import ProfileScreen from './screens/profile';
import NotificationScreen from './screens/notification';
import CartScreen from './screens/cart';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Signin"
          component={SigninScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreens}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Forget"
          component={ForgetScreen}
          options={{
            title: 'Lupa Password',
            headerStyle: {
              backgroundColor: '#FF6B35',
              height: 100,
            },
            headerTitleStyle: {
              fontFamily: fonts.poppinsMedium,
              fontSize: 18,
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
