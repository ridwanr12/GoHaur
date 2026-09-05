import React, {useState, useEffect} from 'react';
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
import {orderService} from '../api';

const OrderItem = ({item, onPress}) => {
  const total = item.total_amount
    ? `Rp ${item.total_amount.toLocaleString('id-ID')}`
    : 'Rp 0';

  const dateObj = new Date(item.created_at);
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Tanggal tidak diketahui';

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress(item)}>
      <View style={styles.orderHeader}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status || 'Diproses'}</Text>
        </View>
        <Text style={styles.dateText}>{dateStr}</Text>
      </View>
      <View style={styles.orderContent}>
        <Image
          source={require('../../assets/restaurant.png')}
          style={styles.orderImage}
        />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>
            {item.Store?.name || item.User?.name || 'Pembeli tidak diketahui'}
          </Text>
          <Text style={styles.totalText}>Total : {total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SellerOrderScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    'Semua',
    'Menunggu Diproses',
    'Sedang Diproses',
    'Dikirim',
    'Selesai',
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders();
        if (response.data?.orders) {
          setOrders(response.data.orders);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe;
  }, [navigation]);

  const goToOrderDetail = item => {
    // Seller ke NewOrder, bukan CurrentOrder
    navigation.navigate('NewOrder', {orderData: item});
  };

  const getFilteredOrders = () => {
    if (activeTab === 'Semua') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Tab Filter */}
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

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : getFilteredOrders().length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Tidak ada pesanan</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={({item}) => (
            <OrderItem item={item} onPress={goToOrderDetail} />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.orderList}
        />
      )}

      {/* Bottom Navigation - 3 item seller */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('SellerHome')}>
          <Image
            source={require('../../assets/home.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Toko</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/orderActive.png')}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.activeNavText]}>Pesanan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}>
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
  tabContainer: {
    backgroundColor: '#FF6B35',
    marginTop: -20,
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingLeft: 15,
  },
  tabItem: {
    paddingHorizontal: 10,
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
    left: 10,
    right: 10,
    marginBottom: 1,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.poppinsMedium,
    color: '#666',
    fontSize: 16,
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
    shadowOffset: {width: 0, height: 2},
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
    resizeMode: 'cover',
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

export default SellerOrderScreen;
