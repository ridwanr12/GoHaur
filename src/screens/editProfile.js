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
  StatusBar,
} from 'react-native';
import fonts from '../constants/styles';

const EditProfileScreen = ({navigation, route}) => {
  // Data profil default atau dari route params
  const defaultProfile = {
    name: 'Ridwan Raditya',
    email: 'RidwanR12@gmail.com',
    phone: '081234324342',
    address:
      'Jl. Dipatiukur No. 20, Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung, Jawa Barat',
    profileImage: require('../../assets/profilePic.png'),
  };

  const [profile, setProfile] = useState(
    route.params?.profile || defaultProfile,
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Implementasi logika penyimpanan profil
    console.log('Profil disimpan:', profile);
    navigation.goBack();
  };

  const handleEditAddress = () => {
    // Navigasi ke halaman edit alamat
    navigation.navigate('EditAddress', {address: profile.address});
  };

  const handleChangePassword = () => {
    // Navigasi ke halaman ubah password
    navigation.navigate('ChangePassword');
  };

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
        <Text style={styles.headerTitle}>Detail Profil dan Alamat</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image source={profile.profileImage} style={styles.profileImage} />
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
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
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressTitle}>Alamat Kirim</Text>
            <TouchableOpacity onPress={handleEditAddress}>
              <Image
                source={require('../../assets/editProfile.png')}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.addressContent}>
            <Text style={styles.addressText}>{profile.address}</Text>
          </View>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}>
          <Text style={styles.changePasswordText}>Ubah Password</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
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
  addressSection: {
    backgroundColor: '#F40',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f40',
    overflow: 'hidden',
    marginBottom: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  addressTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  addressContent: {
    backgroundColor: '#fff',
    padding: 15,
  },
  addressText: {
    color: 'black',
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
});

export default EditProfileScreen;
