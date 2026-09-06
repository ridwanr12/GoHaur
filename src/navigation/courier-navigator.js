import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CourierOrderScreen from '../screens/courierOrder'; // ganti
import CourierProfileScreen from '../screens/courierProfile';
import EditProfileScreen from '../screens/editProfile';
import NotificationScreen from '../screens/notification';

const Stack = createNativeStackNavigator();

const MOCK_ORDERS = [
  {
    id: '1',
    status: 'out_for_delivery', // tab Siap Kirim
    created_at: '2024-02-21T00:00:00.000Z',
    shipping_address:
      'Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten Bandung, Jawa Barat 40915, Indonesia',
    Store: {name: 'Sate Joko Khas Haur Pancuh'},
    User: {name: 'Ridwan R'},
  },
  {
    id: '2',
    status: 'delivered', // tab Riwayat Kirim
    created_at: '2024-02-21T00:00:00.000Z',
    shipping_address:
      'Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten Bandung, Jawa Barat 40915, Indonesia',
    Store: {name: 'Sate Joko Khas Haur Pancuh'},
    User: {name: 'Ridwan R'},
  },
  {
    id: '3',
    status: 'delivered', // tab Riwayat Kirim
    created_at: '2024-02-21T00:00:00.000Z',
    shipping_address:
      'Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten Bandung, Jawa Barat 40915, Indonesia',
    Store: {name: 'Sate Joko Khas Haur Pancuh'},
    User: {name: 'Ridwan R'},
  },
  {
    id: '4',
    status: 'delivered', // tab Riwayat Kirim
    created_at: '2024-02-21T00:00:00.000Z',
    shipping_address:
      'Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten Bandung, Jawa Barat 40915, Indonesia',
    Store: {name: 'Sate Joko Khas Haur Pancuh'},
    User: {name: 'Ridwan R'},
  },
];

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
