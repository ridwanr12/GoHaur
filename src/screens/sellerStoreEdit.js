import logger from '../utils/logger';
import React, {useCallback, useEffect, useState} from 'react';
import {
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
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import fonts from '../constants/styles';
import storeService from '../api/services/storeService';
import uploadService from '../api/services/uploadService';
import profileService from '../api/services/profileService';
import {resolveImageUrl} from '../utils/imageUrl';
import LocationPicker from '../components/LocationPicker';

const SellerStoreEditScreen = ({navigation}) => {
  const [store, setStore] = useState(null);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({latitude: null, longitude: null});
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [storeResponse, profileResponse] = await Promise.all([
        storeService.getMyStore(),
        profileService.getProfile(),
      ]);
      const data = storeResponse?.data?.store;
      if (data) {
        setStore(data);
        setName(data.name || '');
        setDescription(data.description || '');
        setAddress(data.address || '');
        setCoords({
          latitude: data.latitude != null ? Number(data.latitude) : null,
          longitude: data.longitude != null ? Number(data.longitude) : null,
        });
        setImage(data.image || null);
      }
      setProfile(profileResponse?.data?.user || null);
    } catch (error) {
      logger.error('Failed to load store for edit:', error);
      Alert.alert('Gagal', 'Tidak dapat memuat data toko.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8, selectionLimit: 1}, async response => {
      if (response.didCancel || !response.assets?.length) {
        return;
      }
      const file = response.assets[0];
      setIsUploading(true);
      try {
        const url = await uploadService.uploadImage(file);
        setImage(url);
      } catch (error) {
        logger.error('Failed to upload store image:', error);
        Alert.alert('Gagal', 'Foto gagal diunggah.');
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleSave = async () => {
    if (!store) {
      return;
    }
    if (!name.trim() || name.trim().length < 3) {
      Alert.alert('Validasi', 'Nama toko minimal 3 karakter.');
      return;
    }
    if (coords.latitude == null || coords.longitude == null) {
      Alert.alert('Validasi', 'Tentukan lokasi toko terlebih dahulu.');
      return;
    }

    setIsSaving(true);
    try {
      await storeService.updateStore(store.id, {
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        image,
      });
      Alert.alert('Berhasil', 'Data toko tersimpan.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      logger.error('Failed to update store:', error);
      Alert.alert('Gagal', error?.message || 'Tidak dapat menyimpan toko.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>Toko belum dibuat.</Text>
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
        <Text style={styles.headerTitle}>Detail Toko Saya</Text>
        <View style={styles.backIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.photoWrapper} onPress={handlePickImage}>
          {image ? (
            <Image source={{uri: resolveImageUrl(image)}} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoPlaceholderText}>Tambah Foto</Text>
            </View>
          )}
          {isUploading && (
            <View style={styles.photoOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nama Toko</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, styles.readonly]} value={profile?.email || ''} editable={false} />

        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput style={[styles.input, styles.readonly]} value={profile?.phone || ''} editable={false} />

        <Text style={styles.label}>Deskripsi Toko</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Deskripsi toko dan informasi rekening pembayaran"
        />

        <Text style={styles.label}>Alamat Toko</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          multiline
          placeholder="Alamat lengkap toko"
        />

        <TouchableOpacity style={styles.locationButton} onPress={() => setPickerVisible(true)}>
          <Text style={styles.locationButtonText}>
            {coords.latitude != null
              ? `Lokasi: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
              : 'Atur Titik Lokasi Toko'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving || isUploading}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <LocationPicker
        visible={pickerVisible}
        initial={coords.latitude != null ? coords : undefined}
        onClose={() => setPickerVisible(false)}
        onConfirm={result => {
          setCoords({latitude: result.latitude, longitude: result.longitude});
          if (result.address) {
            setAddress(result.address);
          }
          setPickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  center: {justifyContent: 'center', alignItems: 'center'},
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
  content: {padding: 20, paddingBottom: 40},
  photoWrapper: {alignSelf: 'center', marginBottom: 20},
  photo: {width: 140, height: 140, borderRadius: 70, backgroundColor: '#E5E5E5'},
  photoPlaceholder: {justifyContent: 'center', alignItems: 'center'},
  photoPlaceholderText: {color: '#666', fontFamily: fonts.poppinsMedium},
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {fontFamily: fonts.poppinsBold, fontSize: 15, marginBottom: 6, marginTop: 12},
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.poppinsRegular,
    color: '#222',
  },
  readonly: {backgroundColor: '#EFEFEF', color: '#777'},
  textArea: {minHeight: 90, textAlignVertical: 'top'},
  locationButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  locationButtonText: {color: '#FF6B35', fontFamily: fonts.poppinsMedium, textAlign: 'center'},
  saveButton: {
    marginTop: 24,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {opacity: 0.6},
  saveButtonText: {color: '#fff', fontFamily: fonts.poppinsBold, fontSize: 16},
});

export default SellerStoreEditScreen;
