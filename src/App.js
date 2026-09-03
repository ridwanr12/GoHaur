import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import RootNavigator from './navigation/root-navigator';
import {AuthProvider} from './context/AuthContext';
import {CartProvider} from './context/CartContext';

/**
 * Komponen utama (Entry Point) dari aplikasi React Native GoHaur.
 */
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
