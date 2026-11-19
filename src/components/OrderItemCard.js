import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import fonts from '../constants/styles';
import {resolveImageUrl} from '../utils/imageUrl';

const formatRupiah = value =>
  `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

/**
 * Kartu produk di detail pesanan. Dipakai buyer dan seller supaya tampilan
 * serta sumber gambar selalu sama.
 */
const OrderItemCard = ({item}) => {
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const imageUrl = item.image || item.images?.[0] || item.Product?.images?.[0];
  const name = item.name || item.Product?.name || 'Produk';
  const note = item.note ?? item.OrderProduct?.note ?? item.order_products?.note;

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{uri: resolveImageUrl(imageUrl)}} style={styles.image} />
      ) : (
        <Image
          source={require('../../assets/food1.png')}
          style={styles.image}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.unitPrice}>{formatRupiah(price)}/ Item</Text>
        <View style={styles.noteRow}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteValue} numberOfLines={2}>
            {note || '-'}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.lineTotal}>Total: {formatRupiah(price * quantity)}</Text>
        <Text style={styles.quantity}>Kuantitas: {quantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  info: {flex: 1, paddingRight: 8},
  name: {fontFamily: fonts.poppinsBold, fontSize: 15, color: '#111'},
  unitPrice: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noteRow: {flexDirection: 'row', marginTop: 8, alignItems: 'center'},
  noteLabel: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
    color: '#666',
    marginRight: 6,
  },
  noteValue: {
    flex: 1,
    fontFamily: fonts.poppinsMedium,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  right: {alignItems: 'flex-end'},
  lineTotal: {fontFamily: fonts.poppinsBold, fontSize: 13, color: '#111'},
  quantity: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
});

export default OrderItemCard;
