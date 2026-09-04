import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import fonts from '../constants/styles';
import {profileService, orderService} from '../api';
import {useCart} from '../context/CartContext';

const CartScreen = ({navigation}) => {
  const [userLocation, setUserLocation] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Ambil state dan fungsi dari CartContext
  const {
    cart: vendors, 
    updateQuantity, 
    updateNote, 
    toggleStoreSelection, 
    clearStoreFromCart, 
    isLoading: isCartLoading
  } = useCart();

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await profileService.getProfile();
      const userData = response.data.user;
      setUserLocation(userData.location || 'Alamat belum diatur');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserLocation('Alamat belum diatur');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const isAnyVendorSelected = () => {
    return vendors.some(vendor => vendor.selected);
  };

  const getSelectedVendor = () => {
    return vendors.find(vendor => vendor.selected) || {};
  };

  const handleHome = () => navigation.navigate('Home');
  const handleOrder = () => navigation.navigate('Order');
  const handleProfile = () => navigation.navigate('Profile');
  const handleNotification = () => navigation.navigate('Notification');
  // const handlePayment = () => navigation.navigate('Payment');

  // const handlePayment = async () => {
  //   try {
  //     const selectedVendor = getSelectedVendor();
  //     if (!selectedVendor || Object.keys(selectedVendor).length === 0) {
  //       Alert.alert('Peringatan', 'Silakan pilih pesanan terlebih dahulu');
  //       return;
  //     }

  //     // ini ke payment dulu sebelum order

  //     // Menyesuaikan format JSON yang diminta oleh Backend untuk "Products"
  //     const products = selectedVendor.items.map(item => ({
  //       product_id: item.id.toString(), 
  //       quantity: item.quantity, 
  //       note: item.note || '', 
  //     }));

  //     // Membentuk objek `orderData` utama
  //     const orderData = {
  //       store_id: selectedVendor.id.toString(), 
  //       products: products, 
  //       shipping_cost: 10000, 
  //       payment_proof: 'dummy-payment-proof.png', 
  //     };

  //     // POST ke /api/orders
  //     await orderService.createOrder(orderData);
      
  //     // Hapus keranjang restoran yang sudah di checkout
  //     clearStoreFromCart(selectedVendor.id);

  //     Alert.alert('Sukses', 'Pesanan berhasil dibuat!');
  //     navigation.navigate('Order');
  //   } catch (error) {
  //     console.error('Error creating order:', error);
  //     Alert.alert('Error', 'Gagal membuat pesanan. Pastikan server berjalan dan auth valid.');
  //   }
  // };

  const calculateTotal = items => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGrandTotal = () => {
    return vendors.reduce((total, vendor) => {
      if (vendor.selected) {
        return total + calculateTotal(vendor.items);
      }
      return total;
    }, 0);
  };

  const formatCurrency = amount => {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  if (isCartLoading) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <TouchableOpacity onPress={handleNotification}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Alamat */}
      <View style={styles.addressContainer}>
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressLabel}>Lokasi / Alamat Tuju:</Text>
          {isLoadingProfile ? (
            <ActivityIndicator size="small" color="#FF6B35" />
          ) : (
            <Text style={styles.addressText}>{userLocation}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.changeButton}
          onPress={() => navigation.navigate('ProfileDetail')}>
          <Text style={styles.changeButtonText}>Ganti</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Container */}
      <View style={styles.mainContent}>
        {vendors.length === 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: fonts.poppinsMedium, color: '#666'}}>Keranjang masih kosong</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            {vendors.map((vendor) => (
              <View key={vendor.id} style={styles.vendorSection}>
                <TouchableOpacity 
                  style={styles.vendorHeader} 
                  onPress={() => toggleStoreSelection(vendor.id)}
                >
                  {vendor.selected ? (
                    <View style={styles.selectedRadio}>
                      <View style={styles.selectedRadioInner} />
                    </View>
                  ) : (
                    <View style={styles.unselectedRadio} />
                  )}
                  <Image
                    source={require('../../assets/restaurant.png')}
                    style={styles.vendorImage}
                  />
                  <View style={styles.vendorInfo}>
                    <Text style={styles.vendorName}>{vendor.name}</Text>
                    <Text style={styles.vendorAddress}>{vendor.address}</Text>
                  </View>
                </TouchableOpacity>

                {vendor.items.map(item => (
                  <View key={item.id} style={styles.foodItem}>
                    <Image source={item.image} style={styles.foodImage} />
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodName}>{item.name}</Text>
                      <Text style={styles.foodPrice}>
                        {formatCurrency(item.price)}/ Item
                      </Text>
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteLabel}>Note: </Text>
                        <View style={styles.noteInputContainer}>
                          <TextInput 
                            style={styles.noteText}
                            value={item.note}
                            onChangeText={(text) => updateNote(vendor.id, item.id, text)}
                            placeholder="Ketik catatan..."
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.priceQuantityContainer}>
                      <Text style={styles.totalPrice}>
                        Total : {formatCurrency(item.price * item.quantity)}
                      </Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(vendor.id, item.id, item.quantity - 1)}>
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(vendor.id, item.id, item.quantity + 1)}>
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        )}

        {/* Checkout Panel */}
        {isAnyVendorSelected() && (
          <View style={styles.checkoutPanel}>
            <View style={styles.checkoutInfo}>
              <Text style={styles.checkoutTitle}>Pilih dan Bayar</Text>
              <View style={styles.checkoutDetails}>
                <Text style={styles.vendorCheckout}>
                  {getSelectedVendor().name}
                </Text>
                <Text style={styles.checkoutText}>
                  {'Total '}
                  <Text style={styles.checkoutPriceText}>
                    {formatCurrency(calculateGrandTotal())}
                  </Text>
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
              <Text style={styles.checkoutButtonText}>Bayar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Image
            source={require('../../assets/home.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <Image
            source={require('../../assets/cartActive.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>Keranjang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleOrder}>
          <Image
            source={require('../../assets/order.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Pesanan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <Image
            source={require('../../assets/profile.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.poppinsBold,
  },
  notificationIcon: {
    width: 20,
    height: 24,
    marginBottom: 5,
    tintColor: 'white',
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addressTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  changeButton: {
    backgroundColor: '#FF6B35',
    position: 'absolute',
    top: 9,
    right: 9,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 15, 
  },
  vendorSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
  },
  unselectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 10,
  },
  vendorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  vendorAddress: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  foodItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  foodDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 3,
  },
  foodPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginBottom: 5,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  noteLabel: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  noteInputContainer: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: 35
  },
  noteText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    padding: 0,
    margin: 0
  },
  priceQuantityContainer: {
    width: 120,
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 25,
    height: 25,
    backgroundColor: '#FF6B35',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginHorizontal: 10,
  },
  checkoutPanel: {
    backgroundColor: 'white',
    padding: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#EEEEEE',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTitle: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 10,
  },
  checkoutDetails: {
    flexDirection: 'column',
  },
  vendorCheckout: {
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  checkoutText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  checkoutPriceText: {
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginLeft: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginTop: 5,
  },
  navTextActive: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#FF6B35',
    marginTop: 5,
  },
});

export default CartScreen;
