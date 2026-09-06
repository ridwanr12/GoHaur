import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import fonts from '../constants/styles';
import {orderService} from '../api';

const OrderCard = ({item, onPress}) => {
  const dateObj = new Date(item.created_at);
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Tanggal tidak diketahui';

  const isDelivered =
    item.status?.toLowerCase() === 'delivered' ||
    item.status?.toLowerCase() === 'selesai';

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress(item)}>
      <View style={styles.cardTop}>
        <Image
          source={require('../../assets/food1.png')}
          style={styles.storeImage}
        />
        <View style={styles.cardTopInfo}>
          <Text style={styles.statusText}>
            {isDelivered ? 'Sudah Selesai' : 'Siap Dikirim'}
          </Text>
          <Text style={styles.storeName}>
            {item.Store?.name || 'Nama Toko'}
          </Text>
        </View>
        <Text style={styles.dateText}>{dateStr}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View style={styles.destinationRow}>
          <Text style={styles.destinationLabel}>Tujuan :</Text>
          <Text style={styles.destinationName}>
            {item.User?.name || item.User?.username || 'Pembeli'}
          </Text>
        </View>
        <Text style={styles.destinationAddress}>
          {item.shipping_address ||
            item.User?.location ||
            'Alamat tidak diketahui'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CourierOrderScreen = ({navigation, route}) => { // tambah route
  // const CourierOrderScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('siap');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await orderService.getAllOrders();
  //       if (response.data?.orders) {
  //         setOrders(response.data.orders);
  //       } else if (Array.isArray(response.data)) {
  //         setOrders(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch orders:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const unsubscribe = navigation.addListener('focus', fetchOrders);
  //   return unsubscribe;
  // }, [navigation]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // Pakai mock data kalau ada (dev mode)
        if (route.params?.mockOrders) {
          setOrders(route.params.mockOrders);
          return;
        }

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

  const getFilteredOrders = () => {
    if (activeTab === 'siap') {
      // Siap Kirim = status out_for_delivery
      return orders.filter(o => o.status?.toLowerCase() === 'out_for_delivery');
    } else {
      // Riwayat Kirim = status delivered
      return orders.filter(
        o =>
          o.status?.toLowerCase() === 'delivered' ||
          o.status?.toLowerCase() === 'selesai',
      );
    }
  };

  const goToOrderDetail = item => {
    navigation.navigate('CourierOrderDetail', {orderData: item});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Kirim</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Tab */}
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('siap')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'siap' && styles.activeTabText,
            ]}>
            Siap Kirim
          </Text>
          {activeTab === 'siap' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('riwayat')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'riwayat' && styles.activeTabText,
            ]}>
            Riwayat Kirim
          </Text>
          {activeTab === 'riwayat' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : getFilteredOrders().length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            {activeTab === 'siap'
              ? 'Tidak ada pesanan siap kirim'
              : 'Belum ada riwayat pengiriman'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={({item}) => (
            <OrderCard item={item} onPress={goToOrderDetail} />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Bottom Navigation - 2 item courier */}
      <View style={styles.bottomNavigation}>
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
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  header: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: fonts.poppinsBold,
  },
  notificationIcon: {
    width: 20,
    height: 24,
    tintColor: 'white',
  },
  tabWrapper: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
  },
  activeTabText: {
    color: 'white',
    fontFamily: fonts.poppinsBold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 3,
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
    fontSize: 14,
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardTopInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 13,
    fontFamily: fonts.poppinsMedium,
    color: '#4A6CF7',
    marginBottom: 3,
  },
  storeName: {
    fontSize: 15,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 10,
  },
  cardBottom: {
    gap: 4,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destinationLabel: {
    fontSize: 13,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  destinationName: {
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  destinationAddress: {
    fontSize: 13,
    fontFamily: fonts.poppinsRegular,
    color: '#333',
    lineHeight: 20,
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

export default CourierOrderScreen;
