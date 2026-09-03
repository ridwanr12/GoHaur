import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import storeService from '../api/services/storeService';

/**
 * HomeScreen adalah halaman pertama yang dilihat pembeli setelah login.
 * Halaman ini akan mengambil data daftar restoran (store) dari backend API.
 */

const MenuItem = ({item, restaurant, navigation}) => {
  const handleProductPress = () => {
    navigation.navigate('Store', {
      storeData: restaurant,
      selectedProductId: item.id,
      showProductPopup: true,
    });
  };

  const imageSource = item.images && item.images.length > 0
    ? {uri: item.images[0]}
    : require('../../assets/food1.png');

  return (
    <TouchableOpacity onPress={handleProductPress}>
      <View style={styles.menuItem}>
        <Image source={imageSource} style={styles.menuImage} />
        <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.menuPriceContainer}>
          <Text style={styles.menuPrice}>Rp {item.price}</Text>
          <Text style={styles.menuSold}>{item.stock} stok</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


// Komponen untuk menampilkan restoran
const RestaurantCard = ({item, navigation}) => {
  const handleRestaurant = () => {
    navigation.navigate('Store', {storeData: item});
  };

  const ratingObj = item.Ratings && item.Ratings.length > 0 ? item.Ratings[0] : { average_rating: 0, amount: 0 };
  const ratingText = ratingObj.average_rating > 0 ? `${ratingObj.average_rating}/5.0` : 'Baru';
  const totalOrdersText = ratingObj.amount > 0 ? `${ratingObj.amount} ulasan` : '0 ulasan';
  
  const menuList = item.Products || [];

  return (
    <View style={styles.restaurantCard}>
      <TouchableOpacity onPress={handleRestaurant}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Image source={require('../../assets/restaurant.png')} style={styles.restaurantImage} />
            <View>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.restaurantLocation}>{item.description || 'Deskripsi toko'}</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.totalOrders}>{totalOrdersText}</Text>
            <View style={styles.ratingWrapper}>
              <Text style={styles.rating}>{ratingText}</Text>
              <Image
                source={require('../../assets/star.png')}
                style={styles.starIcon}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {menuList.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.menuContainer}>
            {menuList.map(menuItem => (
              <MenuItem
                key={menuItem.id}
                item={menuItem}
                restaurant={item}
                navigation={navigation}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  // State `stores` menyimpan daftar restoran yang dikembalikan dari API
  const [stores, setStores] = useState([]);
  // State `loading` digunakan untuk menampilkan spinner (ActivityIndicator) saat menunggu data
  const [loading, setLoading] = useState(true);

  // useEffect dieksekusi saat komponen dirender.
  // Dalam kasus ini, kita memanggil fungsi fetchStores.
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Memanggil service untuk GET /api/stores
        const response = await storeService.getAllStores({ showProducts: true, showRating: true });
        if (response && response.data && response.data.stores) {
          // Menyimpan data dari server ke state lokal
          setStores(response.data.stores);
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false); // Mematikan animasi loading
      }
    };
    
    // Listener 'focus' memastikan bahwa setiap kali pengguna membuka kembali halaman Home (navigasi balik),
    // aplikasi akan mengambil data toko terbaru dari database backend.
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStores();
    });

    // Cleanup listener untuk mencegah memory leak
    return unsubscribe;
  }, [navigation]);

  const handleCart = () => {
    navigation.navigate('Cart');
  };
  const handleOrder = () => {
    navigation.navigate('Order');
  };
  const handleProfile = () => {
    navigation.navigate('Profile');
  };
  const handleNotification = () => {
    navigation.navigate('Notification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GOHAUR</Text>
        <TouchableOpacity onPress={handleNotification}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={[styles.restaurantList, { flex: 1, justifyContent: 'center' }]}>
           <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={stores}
          renderItem={({item}) => (
            <RestaurantCard item={item} navigation={navigation} />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.restaurantList}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Belum ada toko yang tersedia</Text>}
        />
      )}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/homeActive.png')}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.activeNavText]}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleCart}>
          <Image
            source={require('../../assets/cart.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Keranjang</Text>
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
  restaurantCard: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingVertical: 15,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  restaurantName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  restaurantLocation: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  totalOrders: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 5,
  },
  starIcon: {
    width: 12,
    height: 12,
  },
  menuContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  menuItem: {
    width: 120,
    marginHorizontal: 5,
  },
  menuImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  menuName: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginTop: 5,
  },
  menuPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  menuSold: {
    fontSize: 10,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  activeNavText: {
    color: '#FF6B35',
    fontFamily: fonts.poppinsMedium,
  },
});

export default HomeScreen;
