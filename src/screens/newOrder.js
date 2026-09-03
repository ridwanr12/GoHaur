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
  Alert,
} from 'react-native';
import fonts from '../constants/styles';
import {orderService} from '../api';

const NewOrderScreen = ({navigation, route}) => {
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

  const handleProcessOrder = async () => {
    try {
      await orderService.updateOrderStatus(orderData.id, { status: 'approved' });
      console.log('Pesanan diproses');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Tidak dapat memproses pesanan.');
    }
  };

  const handleRejectOrder = async () => {
    try {
      await orderService.updateOrderStatus(orderData.id, { status: 'canceled' });
      console.log('Pesanan ditolak');
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Tidak dapat menolak pesanan.');
    }
  };

  const handleSendOrder = async () => {
    try {
      await orderService.updateOrderStatus(orderData.id, { status: 'out_for_delivery' });
      console.log('Pesanan dikirim');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Tidak dapat mengirim pesanan.');
    }
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
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Lokasi/ Alamat Tuju:</Text>
          <Text style={styles.addressText}>{orderData.address}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusText}>{orderData.status}</Text>
          {/* <View style={styles.statusBadge}>
          </View> */}
        </View>

        {/* Buyer Info */}
        <View style={styles.buyerContainer}>
          <Text style={styles.buyerLabel}>Nama Pembeli:</Text>
          <Text style={styles.buyerName}>{orderData.buyer}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.orderItemsContainer}>
          {orderData.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.orderItem,
                index === orderData.items.length - 1 && {borderBottomWidth: 0},
              ]}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {formatCurrency(item.price)}/ Item
                </Text>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteLabel}>Note:</Text>
                  <Text style={styles.noteText}>{item.note}</Text>
                </View>
              </View>
              <View style={styles.quantityPriceContainer}>
                <Text style={styles.totalPrice}>
                  Total: {formatCurrency(item.price * item.quantity)}
                </Text>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Kuantitas:</Text>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

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

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.processButton}
            onPress={handleProcessOrder}>
            <Text style={styles.processButtonText}>Proses Pesanan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleRejectOrder}>
            <Text style={styles.rejectButtonText}>Tolak Pesanan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendOrder}>
            <Text style={styles.sendButtonText}>Kirim Pesanan</Text>
          </TouchableOpacity>
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
    paddingTop: 20, // Space for the header an
    paddingHorizontal: 15,
    paddingBottom: 80, // Space for the order button
  },
  addressContainer: {
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
    marginRight: 60,
  },
  // statusBadge: {
  //   // backgroundColor: '#FFC107',
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   borderRadius: 15,
  // },
  statusText: {
    fontSize: 14,
    fontFamily: fonts.poppinsSemiBold,
    color: '#FF7B00',
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
  buyerName: {
    fontSize: 14,
    fontFamily: fonts.poppinsSemiBold,
    color: '#000',
  },
  orderItemsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
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
    marginRight: 5,
  },
  noteText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  quantityPriceContainer: {
    width: 100,
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 12,
    fontFamily: fonts.poppinsSemiBold,
    color: '#000',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginRight: 5,
  },
  quantityValue: {
    fontSize: 12,
    fontFamily: fonts.poppinsSemiBold,
    color: '#000',
  },
  summaryContainer: {
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
    marginBottom: 20,
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
  actionButtonsContainer: {
    marginBottom: 35,
  },
  processButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  processButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  rejectButton: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default NewOrderScreen;
