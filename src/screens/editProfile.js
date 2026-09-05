import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import {profileService} from '../api';
import {getUserData, getUserId} from '../utils/tokenStorage';

// disini bentuk edit profile udah di cek sesuai role nya agar seperti figma,
// jika role buyer : alamat kirim
// jika role seller : deskripsi toko dan alamat toko
// jika role courier : ada plateNumber
// tapi pas di cek seller deksipsi toko ga ada cuma ada alamat toko, mungkin di database
// dan kalo kurir platNumber nya ilang mungkin juga di database
// padahal pas register udah dimasukin

const EditProfileScreen = ({navigation, route}) => {
  // State untuk data profil dan loading
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState('buyer');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi untuk mengambil data profil
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const userId = await getUserId();
      console.log('Attempting to fetch profile with user ID:', userId);

      const response = await profileService.getProfile();
      console.log('Profile data received:', response.data);

      // Menyesuaikan format data dari API ke format yang digunakan di form
      const userData = response.data.user;
      const storedUserData = await getUserData();
      const roles = userData?.roles ?? storedUserData?.roles ?? [];
      const roleNames = (Array.isArray(roles) ? roles : [roles])
        .map(r =>
          typeof r === 'string' ? r : r?.name || r?.role || r?.role_name,
        )
        .filter(Boolean)
        .map(r => r.toLowerCase());

      const roleFromScalar = (
        userData?.role ||
        userData?.role_name ||
        storedUserData?.role ||
        storedUserData?.role_name ||
        'buyer'
      ).toLowerCase();

      const role = roleNames.includes('seller')
        ? 'seller'
        : roleNames.includes('courier')
        ? 'courier'
        : roleNames.includes('buyer')
        ? 'buyer'
        : roleFromScalar;

      setUserRole(role);

      setProfile({
        name: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        description: userData.description || '',
        plateNumber: userData.plateNumber || userData.plate_number || '',
        profileImage: userData.profileImage
          ? {uri: userData.profileImage}
          : require('../../assets/profilePic.png'),
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      let errorMessage = 'Gagal mengambil data profil. Silakan coba lagi.';

      if (error.message === 'User ID tidak ditemukan') {
        errorMessage = 'ID pengguna tidak ditemukan. Silakan login kembali.';
      } else if (error.response) {
        errorMessage = `Error ${error.response.status}: ${
          error.response.statusText || 'Terjadi kesalahan pada server'
        }`;
      }

      Alert.alert('Error', errorMessage);

      // Jika error 401 (Unauthorized) atau error ID tidak ditemukan, arahkan ke halaman login
      if (
        (error.response && error.response.status === 401) ||
        error.message === 'User ID tidak ditemukan'
      ) {
        navigation.navigate('Signin');
      } else {
        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mengambil data profil saat komponen dimuat
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    // Validasi data profil
    if (!profile.name || !profile.email || !profile.phone) {
      Alert.alert('Error', 'Nama, email, dan nomor telepon harus diisi');
      return;
    }

    if (userRole === 'seller' && !profile.description) {
      Alert.alert('Error', 'Deskripsi toko harus diisi');
      return;
    }

    if (userRole === 'courier' && !profile.plateNumber) {
      Alert.alert('Error', 'No plat kendaraan harus diisi');
      return;
    }

    setIsSaving(true);
    try {
      // Menyiapkan data untuk dikirim ke API
      const profileData = {
        username: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        ...(userRole === 'seller' ? {description: profile.description} : null),
        ...(userRole === 'courier' ? {plateNumber: profile.plateNumber} : null),
      };

      // Memanggil API untuk update profil
      const response = await profileService.updateProfile(profileData);
      console.log('Profile updated:', response.data);

      Alert.alert('Sukses', 'Profil berhasil diperbarui', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Gagal memperbarui profil. Silakan coba lagi.';

      if (error.message === 'User ID tidak ditemukan') {
        errorMessage = 'ID pengguna tidak ditemukan. Silakan login kembali.';
      } else if (error.response) {
        errorMessage = `Error ${error.response.status}: ${
          error.response.statusText || 'Terjadi kesalahan pada server'
        }`;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditlocation = () => {
    // Navigasi ke halaman edit alamat
    navigation.navigate('Editlocation', {location: profile.location});
  };

  const handleChangePassword = () => {
    // Navigasi ke halaman ubah password
    navigation.navigate('ChangePassword');
  };

  // Tampilkan loading spinner saat data sedang diambil
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Memuat data profil...</Text>
      </SafeAreaView>
    );
  }

  // Jika data profil belum tersedia, tampilkan pesan
  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Data profil tidak tersedia</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfileData}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>
          {userRole === 'seller'
            ? 'Detail Toko Saya'
            : userRole === 'courier'
            ? 'Detail Profil dan Kendaraan'
            : 'Detail Profil dan Alamat'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={profile.profileImage}
            style={[
              styles.profileImage,
              userRole !== 'buyer' ? styles.profileImageLarge : null,
            ]}
          />
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {userRole === 'seller' ? (
            <>
              <Text style={styles.label}>Nama Toko</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.name}
                onChangeText={text => setProfile({...profile, name: text})}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.email}
                keyboardType="email-address"
                onChangeText={text => setProfile({...profile, email: text})}
              />

              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.phone}
                keyboardType="phone-pad"
                onChangeText={text => setProfile({...profile, phone: text})}
              />

              <Text style={styles.label}>Deskripsi Toko</Text>
              <TextInput
                style={styles.inputSellerMultiline}
                value={profile.description}
                multiline={true}
                numberOfLines={4}
                onChangeText={text =>
                  setProfile({...profile, description: text})
                }
              />
            </>
          ) : userRole === 'courier' ? (
            <>
              <Text style={styles.label}>Nama</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.name}
                onChangeText={text => setProfile({...profile, name: text})}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.email}
                keyboardType="email-address"
                onChangeText={text => setProfile({...profile, email: text})}
              />

              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.phone}
                keyboardType="phone-pad"
                onChangeText={text => setProfile({...profile, phone: text})}
              />

              <Text style={styles.label}>No Plat Kendaraan</Text>
              <TextInput
                style={styles.inputSeller}
                value={profile.plateNumber}
                autoCapitalize="characters"
                onChangeText={text =>
                  setProfile({...profile, plateNumber: text})
                }
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Nama</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={text => setProfile({...profile, name: text})}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                keyboardType="email-address"
                onChangeText={text => setProfile({...profile, email: text})}
              />

              <Text style={styles.label}>Nomor Telepon</Text>
              <TextInput
                style={styles.input}
                value={profile.phone}
                keyboardType="phone-pad"
                onChangeText={text => setProfile({...profile, phone: text})}
              />

              {/* <Text style={styles.label}>Alamat Kirim</Text>
              <TextInput
                style={styles.inputlocation}
                value={profile.location}
                multiline={true}
                numberOfLines={3}
                onChangeText={text => setProfile({...profile, location: text})}
              /> */}
              <TouchableOpacity
                style={styles.addressCard}
                onPress={handleEditlocation}
                activeOpacity={0.9}>
                <View style={styles.addressCardHeader}>
                  <Text style={styles.addressCardHeaderText}>Alamat Kirim</Text>
                  <Image
                    source={require('../../assets/editProfile.png')}
                    style={styles.addressCardEditIcon}
                  />
                </View>
                <View style={styles.addressCardBody}>
                  <Text style={styles.addressCardBodyText}>
                    {profile.location || '-'}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {userRole === 'seller' ? (
          <TouchableOpacity
            style={styles.addressCard}
            onPress={handleEditlocation}
            activeOpacity={0.9}>
            <View style={styles.addressCardHeader}>
              <Text style={styles.addressCardHeaderText}>Alamat Toko</Text>
              <Image
                source={require('../../assets/editProfile.png')}
                style={styles.addressCardEditIcon}
              />
            </View>
            <View style={styles.addressCardBody}>
              <Text style={styles.addressCardBodyText}>
                {profile.location || '-'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Change Password Button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}>
          <Text style={styles.changePasswordText}>
            {userRole === 'seller' || userRole === 'courier'
              ? '***  Ubah Password'
              : 'Ubah Password'}
          </Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan</Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },
  profileImageLarge: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ff6835',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    backgroundColor: 'white',
  },
  inputlocation: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ff6835',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  inputSeller: {
    height: 56,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 18,
    paddingHorizontal: 18,
    marginBottom: 15,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    backgroundColor: '#F7F7F7',
  },
  inputSellerMultiline: {
    height: 120,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 18,
    paddingHorizontal: 18,
    marginBottom: 15,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    textAlignVertical: 'top',
    backgroundColor: '#F7F7F7',
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressCardHeader: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressCardHeaderText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  addressCardEditIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  addressCardBody: {
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  addressCardBodyText: {
    color: '#000',
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    lineHeight: 20,
  },
  changePasswordButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  changePasswordText: {
    color: '#FF6B35',
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#FF6B35',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    width: '50%',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  locationText: {
    flex: 1,
    color: 'white',
    fontFamily: fonts.poppinsRegular,
    fontSize: 16,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});

export default EditProfileScreen;
