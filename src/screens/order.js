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

// Data dummy untuk pesanan
const orderData = [
  {
    id: '1',
    restaurant: 'Sate Joko Khas Haur Pancuh',
    status: 'Diproses',
    date: '21 Februari 2024',
    total: 'Rp 250.000,00',
    image: require('../../assets/food1.png'),
  },
  {
    id: '2',
    restaurant: 'Sate Joko Khas Haur Pancuh',
    status: 'Diproses',
    date: '21 Februari 2024',
    total: 'Rp 250.000,00',
    image: require('../../assets/food1.png'),
  },
  {
    id: '3',
    restaurant: 'Sate Joko Khas Haur Pancuh',
    status: 'Diproses',
    date: '21 Februari 2024',
    total: 'Rp 250.000,00',
    image: require('../../assets/food1.png'),
  },
  {
    id: '4',
    restaurant: 'Sate Joko Khas Haur Pancuh',
    status: 'Diproses',
    date: '21 Februari 2024',
    total: 'Rp 250.000,00',
    image: require('../../assets/food1.png'),
  },
  {
    id: '5',
    restaurant: 'Sate Joko Khas Haur Pancuh',
    status: 'Diproses',
    date: '21 Februari 2024',
    total: 'Rp 250.000,00',
    image: require('../../assets/food1.png'),
  },
];

// Komponen untuk menampilkan item pesanan
const OrderItem = ({item}) => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <View style={styles.orderContent}>
        <Image source={item.image} style={styles.orderImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurant}</Text>
          <Text style={styles.totalText}>Total : {item.total}</Text>
        </View>
      </View>
    </View>
  );
};

const OrderScreen = ({navigation}) => {
  
  const handleHome = () => {
    // Implementasi logika home
    console.log('Home button berhasil');
    navigation.navigate('Home');
  };
  const handleCart = () => {
    // Implementasi logika cart
    console.log('Cart button berhasil');
    navigation.navigate('Cart');
  };
  const handleProfile = () => {
    // Implementasi logika profile
    console.log('Profile button berhasil');
    navigation.navigate('Profile');
  };

  const [activeTab, setActiveTab] = useState('Semua');

  const tabs = ['Semua', 'Menunggu Diproses', 'Sedang Diproses', 'Dikirim'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan</Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={orderData}
        renderItem={({item}) => <OrderItem item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.orderList}
      />

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Image
            source={require('../../assets/home.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleCart}>
          <Image
            source={require('../../assets/cart.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Keranjang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/orderActive.png')}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.activeNavText]}>Pesanan</Text>
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
  tabContainer: {
    backgroundColor: '#FF6B35',
    marginTop: -20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  tabItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'relative',
  },
  activeTabItem: {
    backgroundColor: 'transparent',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    right: 15,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  orderList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  statusText: {
    color: '#0066CC',
    fontFamily: fonts.poppinsMedium,
    fontSize: 12,
  },
  dateText: {
    color: '#666',
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
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

export default OrderScreen;
