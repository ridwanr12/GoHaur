import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import fonts from '../constants/styles';
// import {launchImageLibrary} from 'react-native-image-picker';

// ini screen payment, untuk upload bukti pembayaran, baru ke screen order

const PaymentScreen = ({navigation, route}) => {
  const orderData = route.params?.orderData;

  if (!orderData) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text style={{fontFamily: fonts.poppinsMedium, fontSize: 16}}>
          Pesanan tidak ditemukan.
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: '#FF6B35',
            borderRadius: 10,
          }}
          onPress={() => navigation.goBack()}>
          <Text style={{color: 'white', fontFamily: fonts.poppinsMedium}}>
            Kembali
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [paymentProof, setPaymentProof] = useState(null);

  // Format items
  const items = orderData.order_items || orderData.items || [];
  const vendor = orderData.vendor || {
    id: orderData.store_id || '1',
    name: 'Restoran',
    location: 'Alamat Restoran',
    image: require('../../assets/restaurant.png'),
  };
  const deliveryFee = orderData.shipping_cost || orderData.deliveryFee || 0;
  const serviceFee = 2000;

  // Menghitung total harga produk
  const calculateProductTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Menghitung total keseluruhan
  const calculateGrandTotal = () => {
    return calculateProductTotal() + deliveryFee + serviceFee;
  };

  // Format currency
  const formatCurrency = value => {
    return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    // launchImageLibrary(options, response => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('Image picker error: ', response.error);
    //   } else {
    //     let imageUri = response.assets[0].uri;
    //     setPaymentProof(imageUri);
    //   }
    // });
  };

  const handleOrder = () => {
    // Implementasi logika pesanan
    console.log('Order placed successfully');
    navigation.navigate('Order');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran Pesanan</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.addressContainer}>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressLabel}>Lokasi/ Alamat Tuju:</Text>
            <Text style={styles.addressText}>
              Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum,
              Kabupaten Bandung, Jawa Barat 40915, Indonesia
            </Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Ganti</Text>
          </TouchableOpacity>
        </View>

        {/* Vendor Section */}
        <View style={styles.vendorSection}>
          <View style={styles.vendorHeader}>
            <Image source={vendor.image} style={styles.vendorImage} />
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              <Text style={styles.vendorAddress}>{vendor.location}</Text>
            </View>
          </View>

          {/* Food Items */}
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.foodItem,
                index === items.length - 1 && {borderBottomWidth: 0},
              ]}>
              <Image
                source={
                  item.image ||
                  (item.Product?.images?.[0]
                    ? {uri: item.Product.images[0]}
                    : require('../../assets/food1.png'))
                }
                style={styles.foodImage}
              />
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>
                  {item.name || item.Product?.name || 'Produk'}
                </Text>
                <Text style={styles.foodPrice}>
                  {formatCurrency(item.price)}/ Item
                </Text>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteLabel}>Note: </Text>
                  <View style={styles.noteInputContainer}>
                    <Text style={styles.noteInput}>{item.note}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceQuantityContainer}>
                <Text style={styles.totalPrice}>
                  Total: {formatCurrency(item.price * item.quantity)}
                </Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Harga Produk</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(calculateProductTotal())}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(deliveryFee)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Pengemasan</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(serviceFee)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Keseluruhan</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(calculateGrandTotal())}
            </Text>
          </View>
        </View>

        {/* Payment Proof */}
        <View style={styles.proofSection}>
          <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
          <TouchableOpacity
            style={styles.proofUploadContainer}
            onPress={handleChooseImage}>
            {paymentProof ? (
              <Image source={{uri: paymentProof}} style={styles.proofImage} />
            ) : (
              <View style={styles.proofPlaceholder}>
                <Image
                  source={require('../../assets/upload.png')}
                  style={styles.uploadIcon}
                />
                <Text style={styles.proofPlaceholderText}>
                  Tekan untuk menambahkan gambar bukti pembayaran (Max 1 gambar)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sample Payment Proof */}
          {!paymentProof && (
            <View style={styles.sampleProofContainer}>
              <Image
                source={require('../../assets/paymentSample.png')}
                style={styles.sampleProofImage}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Order Button */}
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Pesan</Text>
      </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 80, // Space for the order button
  },
  addressContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'row',
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
    borderRadius: 10,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
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
    marginTop: 5,
  },
  noteLabel: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 5,
  },
  noteInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 35,
    justifyContent: 'center',
  },
  noteInput: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    padding: 0,
    height: 30,
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
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
  totalRow: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  totalValue: {
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  proofSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  proofTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 15,
  },
  proofUploadContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CCCCCC',
    borderRadius: 10,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  proofPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    tintColor: '#FF6B35',
    marginBottom: 10,
  },
  proofPlaceholderText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#999',
    textAlign: 'center',
  },
  proofImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  sampleProofContainer: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sampleProofImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default PaymentScreen;
