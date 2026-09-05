import React from 'react';
import {useAuth} from '../context/AuthContext';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

import AuthNavigator from './auth-navigator';
import BuyerNavigator from './buyer-navigator';
import SellerNavigator from './seller-navigator';
import CourierNavigator from './courier-navigator';
import colors from '../constants/styles'; // asumsi ada file colors

// ========================================
// 🔧 DEV ONLY - Ubah sesuai kebutuhan testing
const DEV_BYPASS = __DEV__ && true; // ganti false jika mau balik normal
const DEV_ROLE = 'seller'; // 'buyer' | 'seller' | 'courier'
// ========================================

/**
 * RootNavigator adalah komponen cerdas pemisah navigasi berdasarkan Role pengguna.
 * Kita tidak meletakkan semua rute (layar) di satu tempat agar keamanannya terjamin.
 * Misalnya, seorang Pembeli tidak akan pernah bisa menavigasi ke layar khusus Penjual
 * karena layarnya memang tidak pernah dirender di dalam Stack mereka.
 */
const RootNavigator = () => {
  // Mengambil state global dari AuthContext
  const {isAuthenticated, isLoading, user} = useAuth();

  // Bypass semua logic auth saat development
  if (DEV_BYPASS) {
    switch (DEV_ROLE) {
      case 'seller':
        return <SellerNavigator />;
      case 'courier':
        return <CourierNavigator />;
      case 'buyer':
      default:
        return <BuyerNavigator />;
    }
  }

  // Saat pertama aplikasi dibuka, isLoading bernilai true (mengecek storage)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={'#000'} />
      </View>
    );
  }

  // Jika tidak terotentikasi (belum login), kembalikan AuthNavigator (Berisi halaman Login/Register)
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Jika terotentikasi, cek role dari pengguna
  const role = user?.roles || user?.role_name || 'buyer'; // fallback keamanan jika data role kosong

  // Render Navigator yang berbeda sesuai dengan role masing-masing
  switch (role.toLowerCase()) {
    case 'seller':
      return <SellerNavigator />;
    case 'courier':
      return <CourierNavigator />;
    case 'buyer':
    default:
      // Default untuk pembeli, semua navigasi berpusat di buyer-navigator
      return <BuyerNavigator />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
