import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/home'; // Sementara menggunakan Home, bisa diganti SellerDashboard nantinya
import OrderScreen from '../screens/order'; // List pesanan masuk
import ProfileScreen from '../screens/profile';
import EditProfileScreen from '../screens/editProfile';
import NotificationScreen from '../screens/notification';

const Stack = createNativeStackNavigator();

const SellerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileDetail" component={EditProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default SellerNavigator;
