import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import fonts from '../constants/styles';

const CurrentOrderScreen = ({navigation, route}) => {
  // Data pesanan dari halaman sebelumnya atau data default
  const orderData = route.params?.orderData || {
    id: '1',
    status: 'Menunggu Diproses',
    buyer: 'RidwanR12',
    address:
      'Jl. Raya Pancuh No. 21, Desa Sukamaju, Kecamatan Citarum, Kabupaten Bandung, Jawa Barat 40915, Indonesia',
    items: [
      {
        id: '1',
        name: 'Iga Bakar Haur',
        price: 45000,
        quantity: 2,
        note: 'Pedas 1, sedang 2',
        image: require('../../assets/food1.png'),
      },
      {
        id: '2',
        name: 'Iga Bakar Haur',
        price: 45000,
        quantity: 2,
        note: 'Pedas 1, sedang 2',
        image: require('../../assets/food1.png'),
      },
    ],
    deliveryFee: 10000,
    serviceFee: 2000,
    paymentProof: require('../../assets/paymentSample.png'),
  };

  // Menghitung total harga produk
  const calculateProductTotal = () => {
    return orderData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  // Menghitung total keseluruhan
  const calculateGrandTotal = () => {
    return (
      calculateProductTotal() + orderData.deliveryFee + orderData.serviceFee
    );
  };

  // Format currency
  const formatCurrency = value => {
    return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleBack = () => {
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Lokasi/ Alamat Tuju:</Text>
          <Text style={styles.addressText}>{orderData.address}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusValue}>{orderData.status}</Text>
        </View>

        {/* Buyer Info */}
        <View style={styles.buyerContainer}>
          <Text style={styles.buyerLabel}>Nama Pembeli:</Text>
          <Text style={styles.buyerValue}>{orderData.buyer}</Text>
        </View>

        {/* Order Items */}
        {orderData.items.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  Rp {item.price.toLocaleString('id-ID')}/ Item
                </Text>
              </View>
              <View style={styles.itemTotal}>
                <Text style={styles.totalText}>
                  Total: Rp{' '}
                  {(item.price * item.quantity).toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
            <View style={styles.itemFooter}>
              <View style={styles.noteContainer}>
                <Text style={styles.noteLabel}>Note:</Text>
                <View style={styles.noteInputContainer}>
                  <Text style={styles.noteText}>{item.note}</Text>
                </View>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Kuantitas:</Text>
                <Text style={styles.quantityValue}>{item.quantity}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Harga Produk</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(calculateProductTotal())}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(orderData.deliveryFee)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Pengemasan</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(orderData.serviceFee)}
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
        <View style={styles.proofContainer}>
          <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
          <View style={styles.proofImageContainer}>
            <Image source={orderData.paymentProof} style={styles.proofImage} />
          </View>
        </View>
      </ScrollView>
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
    padding: 15,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionLabel: {
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#FF9800',
  },
  buyerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buyerLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 10,
  },
  buyerValue: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  itemTotal: {
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingVertical: 5,
  },
  noteText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityLabel: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 5,
  },
  quantityValue: {
    fontSize: 12,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  proofContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  proofTitle: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 15,
  },
  proofImageContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  proofImage: {
    width: '100%',
    height: 320,
    resizeMode: 'contain',
  },
  okButton: {
    backgroundColor: '#0066CC',
    padding: 10,
    alignItems: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
  },
});

export default CurrentOrderScreen;
