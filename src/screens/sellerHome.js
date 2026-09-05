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
  Alert,
} from 'react-native';
import fonts from '../constants/styles';
import storeService from '../api/services/storeService';

const SellerHomeScreen = ({navigation}) => {
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        // getMyStore tidak perlu params, backend auto filter by token
        const response = await storeService.getMyStore();
        if (response?.data?.store) {
          const store = response.data.store;
          setStoreData(store);
          setProducts(store.Products || []);
        }
      } catch (error) {
        console.error('Failed to fetch store:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchMyStore);
    return unsubscribe;
  }, [navigation]);

  const handleDeleteProduct = productId => {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      {text: 'Batal', style: 'cancel'},
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            // await productService.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
          } catch (error) {
            Alert.alert('Gagal', 'Tidak dapat menghapus produk.');
          }
        },
      },
    ]);
  };

  const ratingObj = storeData?.Ratings?.[0] || {average_rating: 0, amount: 0};
  const ratingText =
    ratingObj.average_rating > 0 ? `${ratingObj.average_rating}/5.0` : 'Baru';

  const renderProduct = ({item}) => (
    <View style={styles.productCard}>
      <Image
        source={
          item.images?.[0]
            ? {uri: item.images[0]}
            : require('../../assets/food1.png')
        }
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {/* price dari backend adalah string "18000.00", parseFloat dulu */}
          Rp {parseFloat(item.price).toLocaleString('id-ID')}/ Item
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('CreateProduct', {
              productData: item,
              isEdit: true,
            })
          }>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.id)}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toko Saya</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Info Toko */}
              <View style={styles.storeInfoContainer}>
                <Image
                  source={require('../../assets/food1.png')}
                  style={styles.storeImage}
                />
                <View style={styles.storeDetails}>
                  <View style={styles.storeNameRow}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {storeData?.name || 'Nama Toko'}
                    </Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.ratingText}>{ratingText}</Text>
                      <Text style={styles.starIcon}>⭐</Text>
                    </View>
                  </View>
                  <Text style={styles.storeAddress}>
                    {storeData?.address ||
                      storeData?.location ||
                      storeData?.description ||
                      'Alamat toko'}
                  </Text>
                  <Text style={styles.storeSold}>
                    {storeData?.total_sold || 0} Item Terjual
                  </Text>
                </View>
              </View>

              {/* Tombol Lihat Review */}
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigation.navigate('Review')}>
                <Text style={styles.reviewButtonText}>Lihat Review Toko</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Label Produk */}
              <Text style={styles.sectionTitle}>Produk</Text>
            </>
          }
          renderItem={renderProduct}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada produk</Text>
          }
        />
      )}

      {/* FAB Tambah Produk */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateProduct', {isEdit: false})}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/homeActive.png')}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.activeNavText]}>Toko</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Order')}>
          <Image
            source={require('../../assets/order.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Pesanan</Text>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  storeName: {
    fontSize: 15,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 3,
  },
  starIcon: {
    fontSize: 13,
  },
  storeAddress: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginBottom: 2,
  },
  storeSold: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  reviewButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 15,
    marginVertical: 12,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
  },
  divider: {
    height: 8,
    backgroundColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#FF6B35',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: {
    color: 'white',
    fontSize: 28,
    fontFamily: fonts.poppinsBold,
    lineHeight: 30,
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

export default SellerHomeScreen;
