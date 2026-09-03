import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnboardingScreens from '../screens/onboarding';
import SignupScreen from '../screens/signup';
import SplashScreen from '../screens/splashscreen';
import SigninScreen from '../screens/signin';
import ForgetScreen from '../screens/forget';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreens} />
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Forget" component={ForgetScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
