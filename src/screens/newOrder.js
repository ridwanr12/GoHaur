import logger from '../utils/logger';
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
  TextInput,
  Linking,
} from 'react-native';
import fonts from '../constants/styles';
import {orderService} from '../api';
import {resolveImageUrl} from '../utils/imageUrl';
import {statusLabel, statusColor} from '../utils/orderStatus';
import OrderItemCard from '../components/OrderItemCard';
import ImagePreviewModal from '../components/ImagePreviewModal';

const NewOrderScreen = ({navigation, route}) => {
  const orderData = route.params?.orderData;

  // Hook wajib dipanggil sebelum early return apa pun
  const [currentStatus, setCurrentStatus] = useState(orderData?.status || 'pending');
  const [courierName, setCourierName] = useState(orderData?.courier_name || '');
  const [courierPlate, setCourierPlate] = useState(orderData?.courier_plate || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [refundStatus, setRefundStatus] = useState(
    orderData?.refund_status || 'not_required',
  );
  const [refundNote, setRefundNote] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // Jika tidak ada data order, tampilkan pesan kosong
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

  // Format data item dari response backend
  const items = orderData.order_items
    ? orderData.order_items
    : (orderData.Products || []).map(product => {
        const through = product.OrderProduct || product.order_products || {};
        const quantity = through.quantity || 1;
        const lineTotal = Number(through.price || 0);
        return {
          id: product.id,
          name: product.name,
          quantity,
          price: lineTotal / quantity,
          note: through.note,
          image: product.images?.[0] || null,
        };
      });

  const address =
    orderData.delivery_address ||
    orderData.shipping_address ||
    orderData.buyer?.location ||
    'Alamat tidak diketahui';
  const buyer = orderData.buyer?.username || orderData.User?.name || 'Pembeli';
  const buyerPhone = orderData.buyer?.phone || '';
  const waNumber = buyerPhone.replace(/\D/g, '').replace(/^0/, '62');
  const buyerBankName = orderData.buyer?.bank_name || '';
  const buyerBankNumber = orderData.buyer?.bank_account_number || '';
  const buyerBankHolder = orderData.buyer?.bank_account_holder || '';
  const buyerBankAccount =
    orderData.buyer?.bank_account ||
    [buyerBankName, buyerBankNumber].filter(Boolean).join(' ');
  const deliveryFee = Number(orderData.shipping_cost || 0);
  const serviceFee = Number(orderData.packaging_fee ?? 2000);

  // Menghitung total harga produk
  const calculateProductTotal = () => {
    return items.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    );
  };

  // Menghitung total keseluruhan
  const calculateGrandTotal = () => {
    return (
      Number(orderData.total_price) ||
      Number(orderData.total_amount) ||
      calculateProductTotal() + deliveryFee + serviceFee
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
      await orderService.acceptOrder(orderData.id);
      setCurrentStatus('accepted');
      Alert.alert('Berhasil', 'Pesanan diterima. Silakan siapkan pesanan.');
    } catch (error) {
      logger.error(error);
      Alert.alert('Gagal', error?.message || 'Tidak dapat memproses pesanan.');
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Alasan wajib', 'Tulis alasan penolakan/pembatalan.');
      return;
    }
    try {
      const response = await orderService.rejectOrder(
        orderData.id,
        rejectionReason.trim(),
      );
      setCurrentStatus('rejected');
      setRefundStatus(response?.data?.order?.refund_status || 'pending');
      Alert.alert(
        'Pesanan ditolak',
        'Buyer akan melihat alasan dan status refund.',
      );
    } catch (error) {
      logger.error(error);
      Alert.alert('Gagal', error?.message || 'Tidak dapat menolak pesanan.');
    }
  };

  const handleRefund = async () => {
    try {
      await orderService.refundOrder(orderData.id, refundNote.trim());
      setRefundStatus('refunded');
      Alert.alert('Refund dicatat', 'Buyer akan mendapat notifikasi refund.');
    } catch (error) {
      logger.error(error);
      Alert.alert('Gagal', error?.message || 'Tidak dapat menandai refund.');
    }
  };

  const handleChatBuyer = () => {
    if (!waNumber) {
      Alert.alert('Nomor tidak ada', 'Buyer belum mengisi nomor telepon.');
      return;
    }
    Linking.openURL(`https://wa.me/${waNumber}`);
  };

  const handleSendOrder = async () => {
    if (!courierName.trim() || !courierPlate.trim()) {
      Alert.alert('Lengkapi data', 'Isi nama pengirim dan plat nomor kendaraan.');
      return;
    }
    try {
      await orderService.shipOrder(orderData.id, {
        courier_name: courierName.trim(),
        courier_plate: courierPlate.trim(),
      });
      setCurrentStatus('shipped');
      Alert.alert('Pesanan dikirim', 'Buyer sudah bisa melihat status Dikirim.');
    } catch (error) {
      logger.error(error);
      Alert.alert('Gagal', error?.message || 'Tidak dapat mengirim pesanan.');
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
          <Text style={styles.addressText}>
            Jarak: {orderData.distance_km != null ? `${Number(orderData.distance_km).toFixed(2)} km` : '-'}
          </Text>
        </View>

        {/* Status Section */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.statusValue, {color: statusColor(currentStatus)}]}>
            {statusLabel(currentStatus)}
          </Text>
        </View>

        {/* Buyer Info */}
        <View style={styles.buyerContainer}>
          <View style={styles.buyerRow}>
            <Text style={styles.buyerLabel}>Nama Pembeli:</Text>
            <Text style={styles.buyerValue}>{buyer}</Text>
          </View>

          <TouchableOpacity style={styles.waButton} onPress={handleChatBuyer}>
            <Text style={styles.waButtonText}>
              {buyerPhone
                ? `Chat WhatsApp (${buyerPhone})`
                : 'Nomor HP buyer belum diisi'}
            </Text>
          </TouchableOpacity>

          {(currentStatus === 'rejected' || refundStatus !== 'not_required') && (
            <View style={styles.refundBox}>
              <Text style={styles.refundTitle}>Rekening Refund Buyer</Text>
              {buyerBankAccount ? (
                <Text style={styles.refundText}>
                  {buyerBankAccount} • {buyerBankHolder || '-'}
                </Text>
              ) : (
                <Text style={styles.refundText}>
                  Buyer belum mengisi rekening refund. Silakan chat.
                </Text>
              )}
              <Text style={styles.refundText}>
                Nominal: {formatCurrency(calculateGrandTotal())}
              </Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        {items.map((item, index) => (
          <OrderItemCard key={item.id || index} item={item} />
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

        <View style={styles.proofContainer}>
          <Text style={styles.proofTitle}>Bukti Pembayaran</Text>
          <View style={styles.proofImageContainer}>
            <TouchableOpacity onPress={() => setPreviewVisible(true)}>
              <Image
                source={
                  orderData.payment_proof
                    ? {uri: resolveImageUrl(orderData.payment_proof)}
                    : require('../../assets/paymentSample.png')
                }
                style={styles.proofImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {currentStatus === 'pending' && (
            <>
              <TextInput
                style={styles.courierInput}
                placeholder="Alasan penolakan (wajib)"
                value={rejectionReason}
                onChangeText={setRejectionReason}
              />
              <TouchableOpacity style={styles.processButton} onPress={handleProcessOrder}>
                <Text style={styles.processButtonText}>Proses Pesanan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectOrder}>
                <Text style={styles.rejectButtonText}>Tolak Pesanan</Text>
              </TouchableOpacity>
            </>
          )}

          {currentStatus === 'accepted' && (
            <>
              <TextInput
                style={styles.courierInput}
                placeholder="Nama pengirim"
                value={courierName}
                onChangeText={setCourierName}
              />
              <TextInput
                style={styles.courierInput}
                placeholder="Plat nomor kendaraan"
                value={courierPlate}
                onChangeText={setCourierPlate}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendOrder}>
                <Text style={styles.sendButtonText}>Kirim Pesanan</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.courierInput}
                placeholder="Alasan pembatalan (wajib, misal stok habis)"
                value={rejectionReason}
                onChangeText={setRejectionReason}
              />
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectOrder}>
                <Text style={styles.rejectButtonText}>Batalkan Pesanan</Text>
              </TouchableOpacity>
            </>
          )}

          {currentStatus === 'rejected' && (
            <>
              <Text style={styles.mutedText}>
                Pesanan ditolak: {orderData.rejection_reason || rejectionReason}
              </Text>
              <Text style={styles.mutedText}>
                Status refund:{' '}
                {refundStatus === 'refunded'
                  ? 'sudah dikirim'
                  : refundStatus === 'pending'
                  ? 'menunggu refund'
                  : 'tidak perlu refund'}
              </Text>

              {refundStatus === 'pending' && (
                <>
                  <TextInput
                    style={styles.courierInput}
                    placeholder="Catatan refund (misal: transfer BCA 12:30)"
                    value={refundNote}
                    onChangeText={setRefundNote}
                  />
                  <TouchableOpacity style={styles.sendButton} onPress={handleRefund}>
                    <Text style={styles.sendButtonText}>Refund Sudah Dikirim</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {currentStatus === 'shipped' && (
            <Text style={styles.mutedText}>
              Pesanan sedang dikirim oleh {orderData.courier_name || courierName} (
              {orderData.courier_plate || courierPlate}).
            </Text>
          )}

          {currentStatus === 'completed' && (
            <Text style={styles.mutedText}>Pesanan sudah diterima buyer.</Text>
          )}
        </View>
      </ScrollView>

      <ImagePreviewModal
        visible={previewVisible}
        uri={orderData.payment_proof}
        onClose={() => setPreviewVisible(false)}
      />
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
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  courierInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontFamily: fonts.poppinsRegular,
  },
  mutedText: {
    color: '#666',
    fontFamily: fonts.poppinsRegular,
    textAlign: 'center',
    paddingVertical: 10,
  },
  waButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#25D366',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  waButtonText: {color: '#128C7E', fontFamily: fonts.poppinsMedium},
  refundBox: {
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 10,
  },
  refundTitle: {fontFamily: fonts.poppinsBold, fontSize: 13, marginBottom: 4},
  refundText: {fontFamily: fonts.poppinsRegular, fontSize: 12, color: '#444'},
});

export default NewOrderScreen;
