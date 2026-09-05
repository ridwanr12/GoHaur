import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SellerHomeScreen from '../screens/sellerHome'; // baru
import CreateProductScreen from '../screens/createProduct'; // baru
import EditProfileScreen from '../screens/editProfile';
import NotificationScreen from '../screens/notification';
import SellerProfileScreen from '../screens/sellerProfile'; // tambah import
import SellerOrderScreen from '../screens/sellerOrder';

const Stack = createNativeStackNavigator();

const SellerNavigator = () => {
  return (
    // ini buat testing screen
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={__DEV__ ? 'SellerHome' : 'SellerHome'}>
      {/* // <Stack.Navigator screenOptions={{headerShown: false}}> */}

      <Stack.Screen name="SellerHome" component={SellerHomeScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="Order" component={SellerOrderScreen} />
      <Stack.Screen name="Profile" component={SellerProfileScreen} />
      <Stack.Screen name="ProfileDetail" component={EditProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      {/* <Stack.Screen name="NewOrder" component={NewOrderScreen} /> */}
    </Stack.Navigator>
  );
};

export default SellerNavigator;
