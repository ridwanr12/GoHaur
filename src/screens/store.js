import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import productService from '../api/services/productService';
import {useCart} from '../context/CartContext';

const StoreScreen = ({navigation, route}) => {
  const storeData = route.params?.storeData || {
    name: 'Sate Joko Khas Haur Pancuh',
    location: 'Blok A No. 12',
    totalSold: 783,
    rating: '4.5/5.0',
  };

  const showProductPopup = route.params?.showProductPopup || false;
  const selectedProductId = route.params?.selectedProductId;

  const [products, setProducts] = useState(route.params?.storeData?.Products || []);
  const [loading, setLoading] = useState(!route.params?.storeData?.Products?.length);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {addToCart} = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeData.id) return;
      try {
        const res = await productService.getStoreProducts(storeData.id);
        if (res && res.data && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeData.id]);

  // Tambahkan useEffect untuk menampilkan popup produk saat halaman dibuka
  useEffect(() => {
    if (showProductPopup && selectedProductId) {
      const product = products.find(p => p.id === parseInt(selectedProductId));
      if (product) {
        console.log('Auto opening product detail:', product.name);
        setSelectedProduct(product);
        setModalVisible(true);
      }
    }
  }, [showProductPopup, selectedProductId, products]);

  // Tambahkan useEffect untuk memantau perubahan state
  useEffect(() => {
    console.log('Modal visibility changed:', modalVisible);
    console.log('Selected product:', selectedProduct?.name);
  }, [modalVisible, selectedProduct]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddToCart = product => {
    // Add to cart default 1 item
    addToCart(storeData, product, 1);
    console.log('Produk ditambahkan ke keranjang:', product.id);
  };

  const handleViewReview = () => {
    console.log('Lihat review toko');
    navigation.navigate('Review');
  };

  const handleGoToCart = () => {
    navigation.navigate('Cart');
  };

  const formatCurrency = amount => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Pastikan fungsi ini berjalan dengan menambahkan console.log
  const openProductDetail = product => {
    console.log('Opening product detail:', product.name);
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeProductDetail = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header - Fixed */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{storeData.name}</Text>
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        {/* Store Info - Sticky */}
        <View style={styles.storeInfoWrapper}>
          <View style={styles.storeInfoContainer}>
            <Image
              source={require('../../assets/restaurant.png')}
              style={styles.storeImage}
            />
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{storeData.name}</Text>
              <Text style={styles.storeAddress}>{storeData.description || storeData.location}</Text>
              <Text style={styles.storeSold}>
                {storeData.totalSold || 0} Item Terjual
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{storeData.Ratings?.[0]?.average_rating || storeData.rating}</Text>
              <Text style={styles.ratingStar}>⭐</Text>
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleViewReview}>
              <Text style={styles.reviewButtonText}>Lihat Review Toko</Text>
            </TouchableOpacity>
          </View>

          {/* Green Divider */}
          <View style={styles.divider} />
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Produk</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FF6B35" style={{marginTop: 20}} />
          ) : (
            products.map(product => {
              const imageSource = product.images && product.images.length > 0
                ? {uri: product.images[0]}
                : require('../../assets/food1.png');

              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => {
                    openProductDetail(product);
                  }}>
                  <Image source={imageSource} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>
                      {formatCurrency(product.price)}/ Item
                    </Text>
                    <Text style={styles.productSold}>{product.stock} stok</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(product)}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Cart Button - Fixed at bottom */}
      <TouchableOpacity style={styles.cartButton} onPress={handleGoToCart}>
        <Image
          source={require('../../assets/cart.png')}
          style={styles.cartIcon}
        />
        <Text style={styles.cartButtonText}>Lanjut ke Keranjang</Text>
      </TouchableOpacity>

      {/* Product Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeProductDetail}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeProductDetail}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={closeProductDetail}>
                    <Image
                      source={require('../../assets/back.png')}
                      style={styles.backButtonIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Detail Produk</Text>
                  <View style={{width: 20}} />
                </View>

                <View style={styles.modalStoreInfo}>
                  <Image
                    source={require('../../assets/restaurant.png')}
                    style={styles.modalStoreImage}
                  />
                  <Text style={styles.modalStoreName}>{storeData.name}</Text>
                  <View style={styles.modalRating}>
                    <Text style={styles.modalRatingText}>
                      {storeData.Ratings?.[0]?.average_rating || storeData.rating}
                    </Text>
                    <Text style={styles.modalRatingStar}>⭐</Text>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <Text style={styles.modalDetailTitle}>Detail Produk</Text>

                {/* Product Detail */}
                {selectedProduct && (
                  <ScrollView style={styles.modalProductDetail}>
                    <Image
                      source={selectedProduct.images && selectedProduct.images.length > 0 ? {uri: selectedProduct.images[0]} : require('../../assets/food1.png')}
                      style={styles.modalProductImage}
                    />
                    <View style={styles.modalProductInfo}>
                      <Text style={styles.modalProductName}>
                        {selectedProduct.name}
                      </Text>
                      <Text style={styles.modalProductSold}>
                        {selectedProduct.stock} stok
                      </Text>
                      <Text style={styles.modalProductPrice}>
                        {formatCurrency(selectedProduct.price)}/ Item
                      </Text>

                      <Text style={styles.modalDescriptionTitle}>
                        Deskripsi:
                      </Text>
                      <Text style={styles.modalDescription}>
                        {selectedProduct.description || 'Tidak ada deskripsi.'}
                      </Text>
                    </View>
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonIcon: {
    width: 12,
    height: 24,
    marginBottom: 5,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: fonts.poppinsMedium,
  },
  scrollContainer: {
    flex: 1,
  },
  storeInfoWrapper: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 0,
    zIndex: 5,
  },
  storeInfoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  divider: {
    height: 10,
    backgroundColor: '#f1f1f1',
    marginTop: 15,
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  storeAddress: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  storeSold: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 5,
  },
  ratingStar: {
    fontSize: 16,
    color: '#FFD700',
  },
  reviewButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
  },
  productsSection: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 15,
    paddingBottom: 80, // Space for cart button
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    marginBottom: 5,
  },
  productSold: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#FF6B35',
    margin: 15,
    padding: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginRight: 10,
  },
  cartButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    backgroundColor: '#9F3F11',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: fonts.poppinsMedium,
  },
  modalStoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  modalStoreImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modalStoreName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    flex: 1,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    marginRight: 5,
  },
  modalRatingStar: {
    fontSize: 14,
    color: '#FFD700',
  },
  modalDivider: {
    height: 5,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 15,
  },
  modalDetailTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginVertical: 15,
    marginHorizontal: 15,
  },
  modalProductDetail: {
    paddingHorizontal: 15,
  },
  modalProductImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  modalProductInfo: {
    marginBottom: 20,
  },
  modalProductName: {
    fontSize: 20,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 5,
  },
  modalProductSold: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginBottom: 5,
  },
  modalProductPrice: {
    fontSize: 18,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 15,
  },
  modalDescriptionTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#333',
    lineHeight: 22,
  },
});

export default StoreScreen;

// // Tambahkan tombol test di bagian bawah layar
// <TouchableOpacity
//   style={[styles.cartButton, {bottom: 80, backgroundColor: 'green'}]}
//   onPress={() => {
//     if (typeof setModalVisible === 'function') {
//       setModalVisible(true);
//     } else {
//       console.warn('setModalVisible is not defined');
//     }
//   }}>
//   <Text style={styles.cartButtonText}>Test Modal</Text>
// </TouchableOpacity>;
