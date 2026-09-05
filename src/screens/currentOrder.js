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
  Alert,
} from 'react-native';
import fonts from '../constants/styles';
import {orderService} from '../api';

const CurrentOrderScreen = ({navigation, route}) => {
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

  const items = orderData.order_items || [];
  const address =
    orderData.shipping_address ||
    orderData.User?.location ||
    'Alamat tidak diketahui';
  const status = orderData.status || 'pending';
  const buyerName = orderData.User?.name || 'Pembeli';
  const deliveryFee = orderData.shipping_cost || 0;
  const serviceFee = 2000;
  const courier = orderData.Courier || null; // data kurir dari backend

  const calculateProductTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGrandTotal = () => {
    return (
      orderData.total_amount ||
      calculateProductTotal() + deliveryFee + serviceFee
    );
  };

  const formatCurrency = value => {
    return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  // =============================================
  // Warna status dinamis sesuai kondisi
  // =============================================
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'menunggu diproses':
        return '#FF9800'; // orange
      case 'approved':
      case 'sedang diproses':
        return '#FF9800'; // orange
      case 'out_for_delivery':
      case 'dikirim':
        return '#2196F3'; // biru
      case 'delivered':
      case 'selesai':
        return '#4CAF50'; // hijau
      case 'canceled':
        return '#F44336'; // merah
      default:
        return '#FF9800';
    }
  };

  // =============================================
  // Label status yang ditampilkan ke user
  // =============================================
  const getStatusLabel = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Menunggu Diproses';
      case 'approved':
        return 'Sedang Diproses';
      case 'out_for_delivery':
        return 'Dikirim';
      case 'delivered':
        return 'Selesai';
      case 'canceled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  // =============================================
  // Tombol aksi buyer - sesuai foto
  // =============================================
  const handlePesananTiba = async () => {
    try {
      await orderService.updateOrderStatus(orderData.id, {
        status: 'delivered',
      });
      navigation.replace('CurrentOrder', {
        orderData: {...orderData, status: 'delivered'},
      });
    } catch (error) {
      Alert.alert('Gagal', 'Tidak dapat mengkonfirmasi pesanan tiba.');
    }
  };

  const handleReviewPesanan = () => {
    navigation.navigate('ReviewOrder', {orderData});
  };

  const renderActionButton = () => {
    switch (status.toLowerCase()) {
      case 'out_for_delivery':
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePesananTiba}>
            <Text style={styles.actionButtonText}>Pesanan Tiba</Text>
          </TouchableOpacity>
        );
      case 'delivered':
        return (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReviewPesanan}>
            <Text style={styles.actionButtonText}>Review Pesanan</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Address */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Lokasi/ Alamat Tuju:</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {/* Status - warna dinamis + Kurir dalam 1 card */}
        <View style={styles.sectionContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusValue, {color: getStatusColor()}]}>
              {getStatusLabel()}
            </Text>
          </View>

          {/* Kurir - hanya muncul saat dikirim atau selesai */}
          {(status.toLowerCase() === 'out_for_delivery' ||
            status.toLowerCase() === 'delivered') &&
            courier && (
              <>
                <Text style={styles.courierSectionLabel}>Kurir:</Text>
                <View style={styles.courierCard}>
                  <Image
                    source={
                      courier.photo
                        ? {uri: courier.photo}
                        : require('../../assets/profilePic.png')
                    }
                    style={styles.courierPhoto}
                  />
                  <View style={styles.courierInfo}>
                    <Text style={styles.courierName}>{courier.name}</Text>
                    <Text style={styles.courierPhone}>{courier.phone}</Text>
                    <Text style={styles.courierCode}>{courier.code}</Text>
                  </View>
                </View>
              </>
            )}
        </View>

        {/* Buyer Info */}
        <View style={styles.buyerContainer}>
          <Text style={styles.buyerLabel}>Nama Pembeli:</Text>
          <Text style={styles.buyerValue}>{buyerName}</Text>
        </View>

        {/* Order Items */}
        {items.map((item, index) => (
          <View key={item.id || index} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Image
                source={
                  item.Product?.images?.[0]
                    ? {uri: item.Product.images[0]}
                    : require('../../assets/food1.png')
                }
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.Product?.name || 'Produk'}
                </Text>
                <Text style={styles.itemPrice}>
                  Rp {(item.price || 0).toLocaleString('id-ID')}/ Item
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

        {/* Bukti Pembayaran */}
        <View style={styles.proofContainer}>
          <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
          <View style={styles.proofImageContainer}>
            <Image
              source={
                orderData.payment_proof
                  ? {uri: orderData.payment_proof}
                  : require('../../assets/paymentSample.png')
              }
              style={styles.proofImage}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Button - fixed di bawah */}
      {renderActionButton() && (
        <View style={styles.bottomButtonContainer}>{renderActionButton()}</View>
      )}
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
  },
  // Kurir
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // jarak ke info kurir kalau ada
  },
  courierSectionLabel: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 10,
    marginTop: 5,
  },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
  },
  courierPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  courierPhone: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  courierCode: {
    fontSize: 12,
    fontFamily: fonts.poppinsBold,
    color: '#000',
  },
  buyerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
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
  // Bottom action button
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'transparent',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default CurrentOrderScreen;
