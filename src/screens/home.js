import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import fonts from '../constants/styles';

// Data dummy untuk restoran
const restaurantData = [
  {
    id: '1',
    name: 'Sate Joko Khas Haur Pancuh',
    location: 'Blok A No. 12',
    rating: '4.5/5.0',
    totalOrders: '143 terjual',
    image: require('../../assets/restaurant.png'),
    menu: [
      {
        id: '1',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '2',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '3',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
    ],
  },
  {
    id: '2',
    name: 'Sate Joko Khas Haur Pancuh',
    location: 'Blok A No. 12',
    rating: '4.5/5.0',
    totalOrders: '143 terjual',
    image: require('../../assets/restaurant.png'),
    menu: [
      {
        id: '1',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '2',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '3',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
    ],
  },
  {
    id: '3',
    name: 'Sate Joko Khas Haur Pancuh',
    location: 'Blok A No. 12',
    rating: '4.5/5.0',
    totalOrders: '143 terjual',
    image: require('../../assets/restaurant.png'),
    menu: [
      {
        id: '1',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '2',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
      {
        id: '3',
        name: 'Iga Bakar Haur',
        price: 'Rp 45.000',
        sold: '143 terjual',
        image: require('../../assets/food1.png'),
      },
    ],
  },
];

// Komponen untuk menampilkan menu item
const MenuItem = ({item}) => {
  return (
    <View style={styles.menuItem}>
      <Image source={item.image} style={styles.menuImage} />
      <Text style={styles.menuName}>{item.name}</Text>
      <View style={styles.menuPriceContainer}>
        <Text style={styles.menuPrice}>{item.price}</Text>
        <Text style={styles.menuSold}>{item.sold}</Text>
      </View>
    </View>
  );
};

// Komponen untuk menampilkan restoran
const RestaurantCard = ({item}) => {
  return (
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantHeader}>
        <View style={styles.restaurantInfo}>
          <Image source={item.image} style={styles.restaurantImage} />
          <View>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantLocation}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.totalOrders}>{item.totalOrders}</Text>
          <View style={styles.ratingWrapper}>
            <Text style={styles.rating}>{item.rating}</Text>
            <Image
              source={require('../../assets/star.png')}
              style={styles.starIcon}
            />
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {item.menu.map(menuItem => (
            <MenuItem key={menuItem.id} item={menuItem} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const handleCart = () => {
    // Implementasi logika cart
    console.log('Cart button berhasil');
    navigation.navigate('Cart');
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

      <FlatList
        data={restaurantData}
        renderItem={({item}) => <RestaurantCard item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

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
    width: 24,
    height: 24,
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
    alignItems: 'center',
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
