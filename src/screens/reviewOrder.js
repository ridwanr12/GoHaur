import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import fonts from '../constants/styles';
import {reviewService} from '../api'; // sesuaikan dengan api kamu

const ReviewOrderScreen = ({navigation, route}) => {
  const {orderData} = route.params || {};
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState('');

  // Ambil info toko dari orderData
  const storeName =
    orderData?.Store?.name ||
    orderData?.order_items?.[0]?.Product?.Store?.name ||
    'Nama Toko';
  const storeImage =
    orderData?.Store?.image ||
    orderData?.order_items?.[0]?.Product?.Store?.image ||
    null;

  const handleSave = async () => {
    if (rating === 0) {
      Alert.alert('Rating diperlukan', 'Pilih bintang terlebih dahulu.');
      return;
    }
    try {
      await reviewService.createReview({
        order_id: orderData?.id,
        rating,
        description,
      });
      Alert.alert('Berhasil', 'Review berhasil disimpan!', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);
    } catch (error) {
      Alert.alert('Gagal', 'Tidak dapat menyimpan review.');
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
        <Text style={styles.headerTitle}>Review Pesanan</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        {/* Info Toko */}
        <View style={styles.storeContainer}>
          <Image
            source={
              storeImage ? {uri: storeImage} : require('../../assets/food1.png')
            }
            style={styles.storeImage}
          />
          <Text style={styles.storeName}>{storeName}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bintang Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text
                style={[
                  styles.star,
                  {color: star <= rating ? '#FFC107' : '#E0E0E0'},
                ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Deskripsi Review */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Deskripsi Review</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tulis review kamu di sini..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Tombol Simpan - fixed di bawah */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
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
  },
  contentContainer: {
    paddingBottom: 100,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  storeName: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    flex: 1,
  },
  divider: {
    height: 8,
    backgroundColor: '#F0F0F0',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    backgroundColor: 'white',
    gap: 5, // dari 10 jadi 4
  },
  star: {
    fontSize: 55, // dari 50 jadi 42
  },
  descriptionContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    minHeight: 120,
    backgroundColor: '#FAFAFA',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default ReviewOrderScreen;
