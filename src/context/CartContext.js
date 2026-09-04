import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('@gohaur_cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('@gohaur_cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };
    if (!isLoading) {
      saveCart();
    }
  }, [cart, isLoading]);

  // Add item to cart
  const addToCart = (store, product, quantity = 1, note = '') => {
    setCart(prevCart => {
      // Cari apakah toko sudah ada di keranjang
      const existingStoreIndex = prevCart.findIndex(s => s.id === store.id);

      let newCart = prevCart.map(cartStore => ({
        ...cartStore,
        selected: cartStore.id === store.id,
      }));

      if (existingStoreIndex >= 0) {
        // Toko sudah ada, cek apakah produk sudah ada
        const storeInCart = newCart[existingStoreIndex];
        const existingProductIndex = storeInCart.items.findIndex(
          item => item.id === product.id,
        );

        if (existingProductIndex >= 0) {
          // Produk sudah ada, update quantity
          storeInCart.items[existingProductIndex].quantity += quantity;
          // Update note jika ada note baru yang diisi
          if (note) {
            storeInCart.items[existingProductIndex].note = note;
          }
        } else {
          // Produk baru di toko ini
          storeInCart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            note: note,
            image:
              product.images && product.images.length > 0
                ? {uri: product.images[0]}
                : require('../../assets/food1.png'),
          });
        }
      } else {
        // Toko belum ada di keranjang, buat entri toko baru
        newCart.push({
          id: store.id,
          name: store.name,
          address:
            store.description || store.location || 'Alamat tidak tersedia',
          selected: true, // Default dipilih saat masuk cart
          items: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity,
              note: note,
              image:
                product.images && product.images.length > 0
                  ? {uri: product.images[0]}
                  : require('../../assets/food1.png'),
            },
          ],
        });
      }

      Alert.alert('Sukses', `${product.name} ditambahkan ke keranjang!`);
      return newCart;
    });
  };

  // Remove specific item from cart
  const removeFromCart = (storeId, productId) => {
    setCart(prevCart => {
      return prevCart
        .map(store => {
          if (store.id === storeId) {
            return {
              ...store,
              items: store.items.filter(item => item.id !== productId),
            };
          }
          return store;
        })
        .filter(store => store.items.length > 0); // Hapus toko jika item kosong
    });
  };

  // Update item quantity
  const updateQuantity = (storeId, productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(storeId, productId);
      return;
    }

    setCart(prevCart => {
      return prevCart.map(store => {
        if (store.id === storeId) {
          return {
            ...store,
            items: store.items.map(item =>
              item.id === productId ? {...item, quantity: newQuantity} : item,
            ),
          };
        }
        return store;
      });
    });
  };

  // Update item note
  const updateNote = (storeId, productId, newNote) => {
    setCart(prevCart => {
      return prevCart.map(store => {
        if (store.id === storeId) {
          return {
            ...store,
            items: store.items.map(item =>
              item.id === productId ? {...item, note: newNote} : item,
            ),
          };
        }
        return store;
      });
    });
  };

  // Toggle store selection in cart (for checkout)
  const toggleStoreSelection = storeId => {
    setCart(prevCart => {
      return prevCart.map(store => {
        if (store.id === storeId) {
          return {...store, selected: !store.selected};
        }

        return {...store, selected: false};
      });
    });
  };

  // Clear specific store (after checkout)
  const clearStoreFromCart = storeId => {
    setCart(prevCart => prevCart.filter(store => store.id !== storeId));
  };

  // Clear entirely
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateNote,
        toggleStoreSelection,
        clearStoreFromCart,
        clearCart,
        isLoading,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
