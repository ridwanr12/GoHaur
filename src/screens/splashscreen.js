import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import fonts from '../constants/styles';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigasi ke halaman berikutnya setelah 3 detik
    const timer = setTimeout(() => {
      navigation.replace('Onboarding'); // Ganti dengan screen tujuan Anda
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
