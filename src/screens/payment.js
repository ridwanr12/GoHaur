import logger from '../utils/logger';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import fonts from '../constants/styles';
import orderService from '../api/services/orderService';
import profileService from '../api/services/profileService';
import storeService from '../api/services/storeService';
import uploadService from '../api/services/uploadService';
import {useCart} from '../context/CartContext';
import {
  getShippingCost,
  haversineDistanceKm,
  MAX_DELIVERY_DISTANCE_KM,
  PACKAGING_FEE,
  roundDistanceKm,
  formatDistance,
  formatRupiah,
} from '../utils/geo';
import LocationPicker from '../components/LocationPicker';
import {resolveImageUrl} from '../utils/imageUrl';

const PaymentScreen = ({navigation, route}) => {
  const orderData = route.params?.orderData;
  const store = orderData?.store;
  const items = orderData?.items || [];
  const {clearStoreFromCart} = useCart();

  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofUrl, setProofUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [liveStore, setLiveStore] = useState(null);

  // Ambil data toko terbaru. Cart bisa menyimpan koordinat lama kalau seller
  // memindahkan lokasi toko setelah produk masuk keranjang.
  useEffect(() => {
    let active = true;
    if (!store?.id) {
      return undefined;
    }

    storeService
      .getStoreById(store.id)
      .then(response => {
        if (active && response?.data?.store) {
          setLiveStore(response.data.store);
        }
      })
      .catch(error => logger.error('Failed to refresh store:', error));

    return () => {
      active = false;
    };
  }, [store?.id]);

  const effectiveStore = liveStore || store;

  const applyLocation = useCallback(
    (nextCoords, nextAddress) => {
      setCoords(nextCoords);
      if (nextAddress) {
        setAddress(nextAddress);
      }
    },
    [],
  );

  const loadSavedLocation = useCallback(async () => {
    try {
      const response = await profileService.getProfile();
      const user = response?.data?.user;

      const hasProfilePoint = user?.latitude != null && user?.longitude != null;
      const hasStorePoint =
        effectiveStore?.latitude != null && effectiveStore?.longitude != null;

      if (hasProfilePoint && hasStorePoint) {
        const profileCoords = {
          latitude: Number(user.latitude),
          longitude: Number(user.longitude),
        };
        const profileDistance = haversineDistanceKm(
          profileCoords.latitude,
          profileCoords.longitude,
          effectiveStore.latitude,
          effectiveStore.longitude,
        );

        if (profileDistance < MAX_DELIVERY_DISTANCE_KM) {
          applyLocation(profileCoords, user.location || '');
          return;
        }
      }

      // Profil kosong atau terlalu jauh: titik pengiriman harus dipilih manual.
      setCoords(null);
      setAddress('');
    } catch (error) {
      logger.error('Failed to load profile location:', error);
      setCoords(null);
      setAddress('');
    }
  }, [applyLocation, effectiveStore]);

  useEffect(() => {
    loadSavedLocation();
  }, [loadSavedLocation]);

  const distanceKm = useMemo(() => {
    if (
      !coords ||
      effectiveStore?.latitude == null ||
      effectiveStore?.longitude == null
    ) {
      return null;
    }
    return haversineDistanceKm(
      coords.latitude,
      coords.longitude,
      effectiveStore.latitude,
      effectiveStore.longitude,
    );
  }, [coords, effectiveStore]);

  const hasDeliveryPoint = Boolean(coords);
  const roundedDistanceKm = distanceKm != null ? roundDistanceKm(distanceKm) : null;
  const isOutOfRange =
    roundedDistanceKm != null && roundedDistanceKm >= MAX_DELIVERY_DISTANCE_KM;
  const hasValidPoint = hasDeliveryPoint && roundedDistanceKm != null && !isOutOfRange;

  const shippingCost = hasValidPoint ? getShippingCost(roundedDistanceKm) : null;
  const productTotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
  const grandTotal =
    shippingCost != null ? productTotal + shippingCost + PACKAGING_FEE : null;

  const handlePickProof = () => {
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8, selectionLimit: 1},
      async response => {
        if (response.didCancel || !response.assets?.length) {
          return;
        }
        const file = response.assets[0];
        setProofFile(file);
        setIsUploading(true);
        try {
          const url = await uploadService.uploadImage(file);
          setProofUrl(url);
        } catch (error) {
          logger.error('Failed to upload payment proof:', error);
          Alert.alert('Gagal', 'Bukti pembayaran gagal diunggah.');
        } finally {
          setIsUploading(false);
        }
      },
    );
  };

  const handleConfirmLocation = result => {
    setPickerVisible(false);
    applyLocation(
      {latitude: result.latitude, longitude: result.longitude},
      result.address,
    );

    const nextDistance = roundDistanceKm(
      haversineDistanceKm(
        result.latitude,
        result.longitude,
        effectiveStore.latitude,
        effectiveStore.longitude,
      ),
    );

    if (nextDistance >= MAX_DELIVERY_DISTANCE_KM) {
      Alert.alert(
        'Di luar jangkauan',
        `Jarak alamat ini ${formatDistance(
          nextDistance,
        )}. Maksimal ${MAX_DELIVERY_DISTANCE_KM} km. Pilih alamat lain atau kembali ke Home.`,
        [
          {
            text: 'Ganti Alamat',
            onPress: () => setPickerVisible(true),
          },
          {
            text: 'Kembali ke Home',
            onPress: () => navigation.navigate('Home'),
            style: 'cancel',
          },
        ],
      );
    }
  };

  const handleCreateOrder = async () => {
    if (!coords) {
      Alert.alert('Lokasi belum ada', 'Tentukan titik pengiriman terlebih dahulu.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Alamat kosong', 'Isi alamat pengiriman terlebih dahulu.');
      return;
    }
    if (roundedDistanceKm == null || roundedDistanceKm >= MAX_DELIVERY_DISTANCE_KM) {
      Alert.alert('Di luar jangkauan', 'Alamat pengiriman lebih dari 5 km dari toko.');
      return;
    }
    if (!proofUrl) {
      Alert.alert('Bukti pembayaran', 'Unggah bukti pembayaran terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.createOrder({
        store_id: store.id,
        products: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          note: item.note || '',
        })),
        delivery_address: address.trim(),
        delivery_latitude: coords.latitude,
        delivery_longitude: coords.longitude,
        payment_proof: proofUrl,
      });

      clearStoreFromCart(store.id);
      Alert.alert('Berhasil', 'Pesanan dibuat. Menunggu konfirmasi penjual.', [
        {text: 'OK', onPress: () => navigation.navigate('Order')},
      ]);
    } catch (error) {
      logger.error('Failed to create order:', error);
      const message = String(error?.message || '');

      if (/distance|jarak/i.test(message)) {
        Alert.alert('Di luar jangkauan', message, [
          {text: 'Ganti Alamat', onPress: () => setPickerVisible(true)},
          {
            text: 'Kembali ke Home',
            onPress: () => navigation.navigate('Home'),
            style: 'cancel',
          },
        ]);
      } else {
        Alert.alert(
          'Gagal',
          message || 'Pesanan gagal dibuat. Periksa kembali data pesanan.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>Pesanan tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran Pesanan</Text>
        <View style={styles.backIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lokasi / Alamat Tujuan</Text>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Tulis alamat lengkap pengiriman"
            multiline
          />
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>
              {coords
                ? roundedDistanceKm != null
                  ? `Jarak: ${formatDistance(roundedDistanceKm)}`
                  : 'Jarak belum diketahui'
                : 'Titik pengiriman belum diatur'}
            </Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Text style={styles.link}>
                {coords ? 'Ubah Titik' : 'Atur Titik'}
              </Text>
            </TouchableOpacity>
          </View>
          {!coords && (
            <Text style={styles.muted}>
              Pilih titik pengiriman dulu untuk melihat ongkir dan total.
            </Text>
          )}
          {isOutOfRange && (
            <Text style={styles.danger}>
              Jarak {formatDistance(roundedDistanceKm)} melebihi{' '}
              {MAX_DELIVERY_DISTANCE_KM} km. Pilih titik lain.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.storeRow}>
            {effectiveStore.image ? (
              <Image
                source={{uri: resolveImageUrl(effectiveStore.image)}}
                style={styles.storeImage}
              />
            ) : (
              <Image
                source={require('../../assets/restaurant.png')}
                style={styles.storeImage}
              />
            )}
            <View style={{flex: 1}}>
              <Text style={styles.storeName}>{effectiveStore.name}</Text>
              <Text style={styles.muted} numberOfLines={2}>
                {effectiveStore.description || 'Deskripsi toko'}
              </Text>
            </View>
          </View>
          <Text style={styles.bankLabel}>Info Pembayaran Toko</Text>
          {effectiveStore.bank_account ? (
            <>
              <Text style={styles.bankText}>{effectiveStore.bank_account}</Text>
              <Text style={styles.bankText}>
                a/n {effectiveStore.bank_account_holder || '-'}
              </Text>
            </>
          ) : (
            <Text style={styles.bankText}>
              Penjual belum mengisi rekening pembayaran.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Produk</Text>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.itemPrice}>
                {formatRupiah(Number(item.price) * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Total Harga Produk</Text>
            <Text style={styles.value}>{formatRupiah(productTotal)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Ongkos Kirim</Text>
            <Text style={styles.value}>
              {shippingCost != null ? formatRupiah(shippingCost) : '-'}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Biaya Pengemasan</Text>
            <Text style={styles.value}>{formatRupiah(PACKAGING_FEE)}</Text>
          </View>
          <View style={[styles.rowBetween, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Keseluruhan</Text>
            <Text style={styles.totalValue}>
              {grandTotal != null ? formatRupiah(grandTotal) : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bukti Pembayaran</Text>
          <TouchableOpacity style={styles.proofBox} onPress={handlePickProof}>
            {proofFile ? (
              <Image source={{uri: proofFile.uri}} style={styles.proofImage} />
            ) : (
              <Text style={styles.muted}>
                Tekan untuk memilih screenshot bukti pembayaran
              </Text>
            )}
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {hasValidPoint && (
          <TouchableOpacity
            style={[
              styles.orderButton,
              (isSubmitting || isUploading) && styles.orderButtonDisabled,
            ]}
            onPress={handleCreateOrder}
            disabled={isSubmitting || isUploading}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.orderButtonText}>Buat Pesanan</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <LocationPicker
        visible={pickerVisible}
        initial={coords || undefined}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleConfirmLocation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backIcon: {width: 24, height: 24, tintColor: '#fff'},
  headerTitle: {color: '#fff', fontSize: 18, fontFamily: fonts.poppinsBold},
  content: {padding: 16, paddingBottom: 40},
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {fontFamily: fonts.poppinsBold, fontSize: 15, marginBottom: 10},
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#222',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  muted: {color: '#666', fontFamily: fonts.poppinsRegular, fontSize: 12},
  link: {color: '#FF6B35', fontFamily: fonts.poppinsMedium},
  danger: {color: '#F44336', marginTop: 6, fontSize: 12},
  storeRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  storeImage: {width: 56, height: 56, borderRadius: 28, marginRight: 12},
  storeName: {fontFamily: fonts.poppinsBold, fontSize: 16},
  bankLabel: {
    marginTop: 14,
    fontFamily: fonts.poppinsMedium,
    fontSize: 13,
    color: '#333',
  },
  bankText: {fontFamily: fonts.poppinsRegular, color: '#444', marginTop: 4},
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {fontFamily: fonts.poppinsRegular, flex: 1, marginRight: 8},
  itemPrice: {fontFamily: fonts.poppinsMedium},
  divider: {height: 1, backgroundColor: '#eee', marginVertical: 10},
  value: {fontFamily: fonts.poppinsMedium, color: '#222'},
  totalRow: {marginTop: 10},
  totalLabel: {fontFamily: fonts.poppinsBold, fontSize: 15},
  totalValue: {fontFamily: fonts.poppinsBold, fontSize: 16, color: '#FF6B35'},
  proofBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  proofImage: {width: '100%', height: 220, resizeMode: 'contain'},
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  orderButtonDisabled: {opacity: 0.5},
  orderButtonText: {color: '#fff', fontFamily: fonts.poppinsBold, fontSize: 16},
});

export default PaymentScreen;
