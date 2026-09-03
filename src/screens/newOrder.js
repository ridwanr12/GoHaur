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
  const orderData = route.params?.orderData;

  // Jika tidak ada data order, tampilkan pesan kosong
  if (!orderData) {
    return (
      <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{fontFamily: fonts.poppinsMedium, fontSize: 16}}>Pesanan tidak ditemukan.</Text>
        <TouchableOpacity style={{marginTop: 20, padding: 10, backgroundColor: '#FF6B35', borderRadius: 10}} onPress={() => navigation.goBack()}>
          <Text style={{color: 'white', fontFamily: fonts.poppinsMedium}}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Format data item dari response backend
  const items = orderData.order_items || [];
  const address = orderData.shipping_address || orderData.User?.location || 'Alamat tidak diketahui';
  const status = orderData.status || 'Menunggu Diproses';
  const buyer = orderData.User?.name || 'Pembeli';
  const deliveryFee = orderData.shipping_cost || 0;
  const serviceFee = 2000;

  // Menghitung total harga produk
  const calculateProductTotal = () => {
    return items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0,
    );
  };

  // Menghitung total keseluruhan
  const calculateGrandTotal = () => {
    return orderData.total_amount || (calculateProductTotal() + deliveryFee + serviceFee);
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
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Lokasi/ Alamat Tuju:</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusValue}>{status}</Text>
        </View>

        {/* Buyer Info */}
        <View style={styles.buyerContainer}>
          <Text style={styles.buyerLabel}>Nama Pembeli:</Text>
          <Text style={styles.buyerValue}>{buyer}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.orderItemsContainer}>
          {items.map((item, index) => (
            <View key={item.id} style={[styles.orderItem, index === items.length - 1 && {borderBottomWidth: 0}]}>
              <View style={styles.itemHeader}>
                <Image source={item.Product?.images?.[0] ? {uri: item.Product.images[0]} : require('../../assets/food1.png')} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.Product?.name || 'Produk'}</Text>
                  <Text style={styles.itemPrice}>
                    Rp {(item.price || 0).toLocaleString('id-ID')}/ Item
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

        <View style={styles.proofContainer}>
          <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
          <View style={styles.proofImageContainer}>
            <Image 
              source={orderData.payment_proof ? {uri: orderData.payment_proof} : require('../../assets/paymentSample.png')} 
              style={styles.proofImage} 
            />
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
