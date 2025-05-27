import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import fonts from '../constants/styles';
import {profileService} from '../api';
import {
  removeToken,
  removeUserData,
  getUserData,
  getUserId,
} from '../utils/tokenStorage';

const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data profil
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // Tambahkan log untuk debugging
      const userId = await getUserId();
      console.log('Attempting to fetch profile with user ID:', userId);

      const response = await profileService.getProfile();
      console.log('Profile data received:', response.data);
      console.log('Jadi ini data profilnya:', response.data);
      setUserData(response.data.user);
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
        await handleLogout();
      } else {
        handleHome();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Perbaiki useEffect untuk mencegah loop tak terbatas dan tambahkan debugging
  useEffect(() => {
    const checkUserData = async () => {
      const userData = await getUserData();
      console.log('User Data in AsyncStorage:', userData);
      if (userData && userData.id) {
        console.log('User ID found:', userData.id);
      } else {
        console.error('User ID not found in stored data');
      }
      fetchProfileData();
    };

    checkUserData();
  }, []); // Tambahkan array kosong sebagai dependency

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleCart = () => {
    navigation.navigate('Cart');
  };

  const handleOrder = () => {
    navigation.navigate('Order');
  };

  const handleNotification = () => {
    navigation.navigate('Notification');
  };

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      // Hapus token dan data user dari penyimpanan lokal
      await removeToken();
      await removeUserData();
      // Navigasi ke halaman login
      navigation.navigate('Signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fungsi untuk melihat detail profil
  const handleViewProfileDetails = () => {
    navigation.navigate('ProfileDetail');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={handleNotification}>
          <Image
            source={require('../../assets/notification.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userData?.profileImage
                ? {uri: userData.profileImage}
                : require('../../assets/profilePic.png')
            }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>
          {userData?.username || 'Nama Pengguna'}
        </Text>
        <Text style={styles.userEmail}>
          {userData?.email || 'email@example.com'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={handleViewProfileDetails}>
        <Text style={styles.detailButtonText}>Detail Profil dan Alamat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image
          source={require('../../assets/logoutIcon.png')}
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Image
            source={require('../../assets/home.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleCart}>
          <Image
            source={require('../../assets/cart.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Keranjang</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Order')}>
          <Image
            source={require('../../assets/order.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Pesanan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleOrder}>
          <Image
            source={require('../../assets/profileActive.png')}
            style={styles.navIcon}
          />
          <Text style={[styles.navText, styles.activeNavText]}>Profil</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: fonts.poppinsBold,
  },
  notificationIcon: {
    width: 20,
    height: 24,
    marginBottom: 5,
    tintColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 22,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginBottom: 30,
  },
  detailButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF6B35',
    marginTop: 20,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#FF6B35',
  },
  logoutText: {
    color: '#FF6B35',
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
    marginTop: 5,
  },
  activeNavText: {
    color: '#FF6B35',
    fontFamily: fonts.poppinsMedium,
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
});

export default ProfileScreen;
