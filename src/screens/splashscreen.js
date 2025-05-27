import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import fonts from '../constants/styles';
import {useAuth} from '../context/AuthContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const {isAuthenticated, isLoading} = useAuth();

  useEffect(() => {
    // Navigasi ke halaman berikutnya setelah 3 detik
    const timer = setTimeout(() => {
      // Cek apakah user sudah login (memiliki token dan ID)
      if (isAuthenticated) {
        // Jika sudah login, langsung ke Home
        navigation.replace('Home');
      } else {
        // Jika belum login, arahkan ke Onboarding
        navigation.replace('Onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated]);

  return (
    <View style={styles.container}>
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/splashscreen.png')} // Pastikan path logo sesuai
          style={styles.logo}
          resizeMode="contain"
        />
        {/* <Text style={styles.tagline}>
          HAUR PANCUH 2 - MAKAN ENAK, PESAN PRAKTIS!
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  tagline: {
    marginTop: 10,
    color: '#9B0000',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    textAlign: 'center',
    transform: [{rotate: '-5deg'}],
  },
});

export default SplashScreen;
