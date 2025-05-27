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
  Alert,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import {authService} from '../api';

const SignupScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState(''); // Tambahkan state untuk deskripsi toko
  const [plateNumber, setPlateNumber] = useState(''); // Tambahkan state untuk nomor plat
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState(''); // Tambahkan state untuk location
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi untuk memilih role
  const selectRole = selectedRole => {
    setRole(selectedRole);
    // Reset field yang tidak relevan berdasarkan role
    if (selectedRole === 'seller') {
      setPlateNumber('');
    } else if (selectedRole === 'courier') {
      setDescription('');
    } else {
      setDescription('');
      setPlateNumber('');
    }
  };

  // Validasi form
  const validateForm = () => {
    const baseRequiredFields =
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !role ||
      !location;

    // Tambahkan validasi khusus berdasarkan role
    if (baseRequiredFields) {
      setError('Semua field harus diisi');
      return false;
    }

    // Validasi field khusus berdasarkan role
    if (role === 'seller' && !description) {
      setError('Deskripsi toko harus diisi');
      return false;
    }

    if (role === 'courier' && !plateNumber) {
      setError('Nomor plat kendaraan harus diisi');
      return false;
    }

    // Validasi field email
    if (!email) {
      setError('Email harus diisi');
      return false;
    }

    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid. Format yang benar: xxx@xxx.xxx');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }

    // Validasi nomor telepon (minimal 10 digit)
    const phoneRegex = /^[0-9]{10,}$/;
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('Nomor telepon tidak valid (minimal 10 digit)');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    // Reset error
    setError('');

    // Validasi form
    if (!validateForm()) {
      Alert.alert('Error', error);
      return;
    }

    // Siapkan data untuk register
    const userData = {
      username: fullName,
      email: email,
      password: password,
      role: role,
      phone: phoneNumber,
      location: location || 'string',
    };

    console.log('Data yang dikirim:', userData); // Tambahkan log ini

    // Tambahkan field tambahan berdasarkan role
    if (role === 'seller') {
      userData.description = description;
    } else if (role === 'courier') {
      userData.plateNumber = plateNumber;
    }

    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      console.log('Register berhasil:', response);

      Alert.alert(
        'Pendaftaran Berhasil',
        'Akun Anda telah berhasil dibuat. Silakan login.',
        [{text: 'OK', onPress: () => navigation.navigate('Signin')}],
      );
    } catch (error) {
      console.error('Register gagal:', error.message);
      Alert.alert(
        'Pendaftaran Gagal',
        error.message || 'Terjadi kesalahan saat mendaftar',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown options untuk role
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const roleOptions = [
    {id: 'buyer', label: 'Pembeli'},
    {id: 'seller', label: 'Penjual'},
    {id: 'courier', label: 'Kurir'},
  ];

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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRoleOptions(!showRoleOptions)}>
            <Text
              style={role ? styles.dropdownTextSelected : styles.dropdownText}>
              {role
                ? roleOptions.find(option => option.id === role)?.label
                : 'Pilih Role'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {showRoleOptions && (
            <View style={styles.optionsContainer}>
              {roleOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => {
                    selectRole(option.id);
                    setShowRoleOptions(false);
                  }}>
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={styles.note}>
            Catatan: Setelah terdaftar role tidak bisa diubah
          </Text>

          {/* Field Deskripsi Toko hanya untuk role seller */}
          {role === 'seller' && (
            <>
              <Text style={styles.label}>Deskripsi Toko</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan deskripsi toko mu"
                placeholderTextColor="#AAAAAA"
                value={description}
                onChangeText={setDescription}
              />
            </>
          )}

          {/* Field Nomor Plat hanya untuk role courier */}
          {role === 'courier' && (
            <>
              <Text style={styles.label}>Nomor Plat Kendaraan</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor plat kendaraan"
                placeholderTextColor="#AAAAAA"
                value={plateNumber}
                onChangeText={setPlateNumber}
              />
            </>
          )}
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

          <Text style={styles.label}>Lokasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan lokasi Anda"
            placeholderTextColor="#AAAAAA"
            value={location}
            onChangeText={setLocation}
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
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
  errorText: {
    color: 'red',
    fontFamily: fonts.poppinsMedium,
    marginBottom: 10,
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
  dropdownTextSelected: {
    color: '#000',
    fontFamily: fonts.poppinsRegular,
  },
  dropdownIcon: {
    color: '#FF6B35',
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
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
