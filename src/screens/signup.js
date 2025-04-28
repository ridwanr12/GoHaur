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
} from 'react-native';
import fonts from '../constants/styles';

const SignupScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Implementasi logika pendaftaran
    console.log('Pendaftaran berhasil');
    navigation.navigate('Home');
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

        <Text style={styles.title}>Daftar Akun</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nama Lengkap / Nama Toko</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#AAAAAA"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Role</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Pilih Role</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            Catatan: Setelah terdaftar role tidak bisa diubah
          </Text>

          <Text style={styles.label}>Deskripsi Toko</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan deskripsi toko mu"
            placeholderTextColor="#AAAAAA"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            placeholder="0812 1234 5678"
            placeholderTextColor="#AAAAAA"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Text style={styles.label}>Password Baru</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Konfirmasi Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Sudah Memiliki Akun?{' '}
            <Text
              style={styles.signInLink}
              onPress={() => navigation.navigate('Signin')}>
              Masuk Akun
            </Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Daftar</Text>
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
    marginBottom: 20, // Tambahkan margin bawah untuk memberikan ruang antara logo dan teks "Daftar Akun"
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signInText: {
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

export default SignupScreen;
