import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import RootNavigator from './navigation/root-navigator';
import {AuthProvider} from './context/AuthContext';

/**
 * Komponen utama (Entry Point) dari aplikasi React Native GoHaur.
 * 
 * Di sini kita membungkus seluruh aplikasi dengan dua penyedia (provider) utama:
 * 1. AuthProvider: Menyediakan state global untuk autentikasi (user, token, fungsi login/logout).
 *    Komponen apa saja di dalam aplikasi bisa mengakses status login dari sini.
 * 2. NavigationContainer: Mengelola state navigasi (perpindahan antar layar).
 *    RootNavigator adalah komponen yang akan menentukan layar mana yang pertama muncul (berdasarkan role).
 */
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
