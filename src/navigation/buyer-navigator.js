import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/home';
import CartScreen from '../screens/cart';
import OrderScreen from '../screens/order';
import CurrentOrderScreen from '../screens/currentOrder';
import ProfileScreen from '../screens/profile';
import NotificationScreen from '../screens/notification';
import StoreScreen from '../screens/store';
import PaymentScreen from '../screens/payment';
import EditProfileScreen from '../screens/editProfile';
import ReviewScreen from '../screens/review';
import ReviewOrderScreen from '../screens/reviewOrder'; // import screen baru
import NewOrderScreen from '../screens/newOrder';

// Menggunakan Native Stack untuk performa yang lebih baik di mobile (daripada Stack Navigator biasa)
const Stack = createNativeStackNavigator();

/**
 * BuyerNavigator berisi kumpulan layar (screen) yang hanya bisa diakses oleh Pembeli (Buyer).
 * Konfigurasi `headerShown: false` berarti kita menyembunyikan header bawaan React Navigation
 * karena kita telah membuat custom header sendiri di dalam masing-masing layar.
 */
const BuyerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      // tambah ini buat tes screen langsung
      initialRouteName={__DEV__ ? 'CurrentOrder' : 'Home'}>
      {/* // buyer-navigator.js */}
      <Stack.Screen
        name="CurrentOrder"
        component={CurrentOrderScreen}
        initialParams={{
          orderData: {
            id: 1,
            status: 'delivered', // ganti-ganti: 'pending' | 'approved' | 'out_for_delivery' | 'delivered'
            shipping_address: 'Jl. Raya Pancuh No. 21, Bandung',
            shipping_cost: 10000,
            total_amount: 90000,
            payment_proof: null,
            User: {name: 'RidwanR12'},
            Courier: {
              name: 'Ryan',
              phone: '0812-3427-5812',
              code: 'D5213IDJ',
              photo: null,
            },
            order_items: [
              {
                id: 1,
                price: 45000,
                quantity: 2,
                note: 'Pedes 1, sedeng 2',
                Product: {name: 'Iga Bakar Haur', images: []},
              },
            ],
          },
        }}
      />

      {/* Setiap Stack.Screen mewakili sebuah halaman. 
          name="..." adalah identifier unik yang digunakan untuk berpindah halaman (misal: navigation.navigate('Cart')) */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      {/* <Stack.Screen name="CurrentOrder" component={CurrentOrderScreen} /> */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="ProfileDetail" component={EditProfileScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
      <Stack.Screen name="NewOrder" component={NewOrderScreen} />
    </Stack.Navigator>
  );
};

export default BuyerNavigator;
