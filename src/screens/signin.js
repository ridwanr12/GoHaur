import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import {useAuth} from '../context/AuthContext';
import {Alert} from 'react-native';

const SigninScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      // Panggil fungsi login dari AuthContext, bukan authService langsung.
      // Ini akan memperbarui state global (user, token) sehingga RootNavigator 
      // secara otomatis akan memindahkan kita ke halaman (Navigator) yang tepat.
      const response = await login({email, password});
      console.log('Login berhasil:', response.data);

      // Tidak perlu navigation.navigate('Home') karena RootNavigator akan merender ulang 
      // dan langsung menampilkan BuyerNavigator (yang layar pertamanya adalah Home) 
      // berdasarkan state token yang sudah terisi.
    } catch (error) {
      console.error('Login gagal:', error.message);
      Alert.alert(
        'Login Gagal',
        error.response?.data?.message || 'Terjadi kesalahan pada server',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Masuk</Text>

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

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.forgetContainer}>
          <Text
            style={styles.forgetLink}
            onPress={() => navigation.navigate('Forget')}>
            Lupa Password
          </Text>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Belum Memiliki Akun?{' '}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate('Signup')}>
              Daftar Akun
            </Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 300,
    height: 90,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 20,
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
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#AAAAAA',
    fontFamily: fonts.poppinsRegular,
  },
  dropdownIcon: {
    color: '#FF6B35',
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
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginTop: -30, // Tambahkan margin-top negatif untuk menggeser link ke atas sejauh 10 unit
  },
  forgetLink: {
    color: '#FF6B35',
    fontFamily: fonts.poppinsMedium,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUpText: {
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
  signUpLink: {
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

export default SigninScreen;
