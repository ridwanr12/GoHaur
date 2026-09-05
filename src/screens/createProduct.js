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
// import {launchImageLibrary} from 'react-native-image-picker';
import fonts from '../constants/styles';

const CreateProductScreen = ({navigation, route}) => {
  const {productData, isEdit} = route.params || {};

  const [name, setName] = useState(productData?.name || '');
  const [description, setDescription] = useState(
    productData?.description || '',
  );
  const [price, setPrice] = useState(productData?.price?.toString() || '');
  const [image, setImage] = useState(productData?.images?.[0] || null);

  // const handlePickImage = () => {
  //   launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
  //     if (!response.didCancel && response.assets?.[0]) {
  //       setImage(response.assets[0].uri);
  //     }
  //   });
  // };

  // Ganti handlePickImage jadi dummy
  const handlePickImage = () => {
    // Dummy untuk testing - pakai placeholder image
    setImage('https://via.placeholder.com/300?text=Produk');
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert('Lengkapi Data', 'Nama produk dan harga wajib diisi.');
      return;
    }
    try {
      // await productService.createProduct({name, description, price, image});
      Alert.alert(
        'Berhasil',
        isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil dibuat!',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      Alert.alert('Gagal', 'Tidak dapat menyimpan produk.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Produk' : 'Buat Produk'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Nama Produk */}
        <Text style={styles.label}>Nama Produk</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama produk"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* Deskripsi */}
        <Text style={styles.label}>Deskripsi Produk</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Deskripsi produk"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        {/* Harga */}
        <Text style={styles.label}>Harga/ Item</Text>
        <View style={styles.priceContainer}>
          <View style={styles.rpBox}>
            <Text style={styles.rpText}>Rp</Text>
          </View>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Gambar Produk */}
        <Text style={styles.label}>Gambar Produk</Text>

        {/* Upload area - selalu tampil */}
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handlePickImage}>
          <Text style={styles.uploadIcon}>🖼️+</Text>
          <Text style={styles.uploadText}>
            Tekan untuk menambahkan gambar produk (Max 1 gambar)
          </Text>
        </TouchableOpacity>

        {/* Preview gambar kalau sudah dipilih */}
        {image && (
          <View style={styles.previewContainer}>
            <Image source={{uri: image}} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}>
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tombol Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {isEdit ? 'Simpan Perubahan' : 'Buat Produk'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButtonIcon: {
    width: 12,
    height: 24,
    tintColor: 'white',
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: fonts.poppinsMedium,
  },
  content: {flex: 1},
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rpBox: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  rpText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8F5',
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    fontFamily: fonts.poppinsRegular,
    color: '#999',
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
    fontFamily: fonts.poppinsBold,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default CreateProductScreen;
