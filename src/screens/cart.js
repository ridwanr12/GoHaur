import React, {useState} from 'react';
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
} from 'react-native';
import fonts from '../constants/styles';

const CartScreen = ({navigation}) => {
  const handleHome = () => {
    // Implementasi logika home
    console.log('Home button berhasil');
    navigation.navigate('Home');
  };
  const handleOrder = () => {
    // Implementasi logika order
    console.log('Order button berhasil');
    navigation.navigate('Order');
  };
  const handleProfile = () => {
    // Implementasi logika profile
    console.log('Profile button berhasil');
    navigation.navigate('Profile');
  };
  const handleNotification = () => {
    // Implementasi logika notifikasi
    console.log('Notification button berhasil');
    navigation.navigate('Notification');
  };
  
  const [quantities, setQuantities] = useState({
    1: 2,
    2: 2,
    3: 2,
  });

  const vendors = [
    {
      id: 0,
      name: 'Sate Joko Khas Haur Pancuh',
      address: 'Blok A No. 12',
      selected: true,
      items: [
        {
          id: 1,
          name: 'Iga Bakar Haur',
          price: 45000,
          note: 'Pedes 1, sedeng 2',
          image: require('../../assets/food1.png'),
        },
        {
          id: 2,
          name: 'Iga Bakar Haur',
          price: 45000,
          note: 'Pedes 1, sedeng 2',
          image: require('../../assets/food1.png'),
        },
      ],
    },
    {
      id: 1,
      name: 'Sate Joko Khas Haur Pancuh',
      address: 'Blok A No. 12',
      selected: false,
      items: [
        {
          id: 3,
          name: 'Iga Bakar Haur',
          price: 45000,
          note: 'Pedes 1, sedeng 2',
          image: require('../../assets/food1.png'),
        },
      ],
    },
  ];

  const incrementQuantity = itemId => {
    setQuantities({
      ...quantities,
      [itemId]: (quantities[itemId] || 0) + 1,
    });
  };

  const decrementQuantity = itemId => {
    if (quantities[itemId] > 1) {
      setQuantities({
        ...quantities,
        [itemId]: quantities[itemId] - 1,
      });
    }
  };

  const calculateTotal = items => {
    return items.reduce((total, item) => {
      return total + item.price * (quantities[item.id] || 0);
    }, 0);
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
          <Text style={styles.addressLabel}>Lokasi/ Alamat Tuju:</Text>
          <Text style={styles.addressText}>
            Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten
            Bandung, Jawa Barat 40915, Indonesia
          </Text>
        </View>
        <TouchableOpacity style={styles.changeButton}>
          <Text style={styles.changeButtonText}>Ganti</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {vendors.map((vendor, index) => (
          <View key={vendor.id} style={styles.vendorSection}>
            <View style={styles.vendorHeader}>
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
            </View>

            {vendor.items.map(item => (
              <View key={item.id} style={styles.foodItem}>
                <Image source={item.image} style={styles.foodImage} />
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodPrice}>
                    Rp {item.price.toLocaleString('id-ID')}/ Item
                  </Text>
                  
                  <View style={styles.noteContainer}>
                    <Text style={styles.noteLabel}>Note: </Text>
                    <View style={styles.noteInputContainer}>
                      <Text style={styles.noteText}>{item.note}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.priceQuantityContainer}>
                  <Text style={styles.totalPrice}>
                    Total : Rp {(item.price * quantities[item.id]).toLocaleString('id-ID')}
                  </Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => decrementQuantity(item.id)}>
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => incrementQuantity(item.id)}>
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Checkout Panel */}
      <View style={styles.checkoutPanel}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutTitle}>Pilih dan Bayar</Text>
          <View style={styles.checkoutDetails}>
            <Text style={styles.vendorCheckout}>Sate Joko Khas Haur Pancuh</Text>
            <Text style={styles.totalCheckout}>
              Total Rp {calculateGrandTotal().toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bayarButton}>
          <Text style={styles.bayarButtonText}>Bayar</Text>
        </TouchableOpacity>
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
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
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
  },
  noteLabel: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  noteInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  noteText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  checkoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vendorCheckout: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  totalCheckout: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  bayarButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginLeft: 15,
  },
  bayarButtonText: {
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
    borderTopWidth: 2,
    borderTopColor: '#FF6B35',
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
