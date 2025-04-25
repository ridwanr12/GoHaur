import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import fonts from '../constants/styles';

const ProfileScreen = ({navigation}) => {
  const handleHome = () => {
    // Implementasi logika home
    console.log('Home button berhasil');
    navigation.navigate('Home');
  };
  const handleCart = () => {
    // Implementasi logika cart
    console.log('Cart button berhasil');
    navigation.navigate('Cart');
  };
  const handleOrder = () => {
    // Implementasi logika order
    console.log('Order button berhasil');
    navigation.navigate('Order');
  };
  const handleNotification = () => {
    // Implementasi logika notifikasi
    console.log('Notification button berhasil');
    navigation.navigate('Notification');
  };

  // Data profil pengguna
  const userData = {
    name: 'Ridwan Raditya',
    email: 'RidwanR12@gmail.com',
    profileImage: require('../../assets/profilePic.png'),
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    // Implementasi logika logout
    console.log('Logout berhasil');
    navigation.navigate('Signin');
  };

  // Fungsi untuk melihat detail profil
  const handleViewProfileDetails = () => {
    // Implementasi navigasi ke halaman detail profil
    console.log('Navigasi ke detail profil');
    // navigation.navigate('ProfileDetail');
  };

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
          <Image source={userData.profileImage} style={styles.profileImage} />
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
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
    width: 24,
    height: 24,
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
    alignItems: 'center',
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
});

export default ProfileScreen;
