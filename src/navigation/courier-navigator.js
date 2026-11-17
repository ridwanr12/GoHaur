import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CourierOrderScreen from '../screens/courierOrder'; // ganti
import CourierProfileScreen from '../screens/courierProfile';
import EditProfileScreen from '../screens/editProfile';
import NotificationScreen from '../screens/notification';

const Stack = createNativeStackNavigator();

const CourierNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen
        name="Order"
        component={CourierOrderScreen}
        initialParams={__DEV__ ? {mockOrders: MOCK_ORDERS} : undefined}
      /> */}
      <Stack.Screen name="Order" component={CourierOrderScreen} />
      <Stack.Screen name="Profile" component={CourierProfileScreen} />
      <Stack.Screen name="ProfileDetail" component={EditProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default CourierNavigator;
