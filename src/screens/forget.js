import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import fonts from '../constants/styles';
// import {Image} from 'react-native-reanimated/lib/typescript/Animated';

const ForgetScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    // Implementasi logika pendaftaran
    console.log('Kirim email berhasil');
    // navigation.navigate('Home');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ganti Password</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <Text style={styles.title}>
          Masukkan alamat email Anda untuk menerima tautan pembaruan kata sandi.
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.forgetContainer}>
          <Text style={styles.forgetText}>
            Sudah Memiliki Akun?{' '}
            <Text
              style={styles.signInLink}
              onPress={() => navigation.navigate('Signin')}>
              Masuk Akun
            </Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Kirim Email</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
    marginBottom: 20,
    marginTop: 10,
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
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#888',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  forgetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  forgetText: {
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
  signInLink: {
    color: '#FF6B35',
    fontFamily: fonts.poppinsMedium,
  },
  button: {
    backgroundColor: '#FF6B35',
    height: 65,
    marginTop: -15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
  },
});

export default ForgetScreen;
