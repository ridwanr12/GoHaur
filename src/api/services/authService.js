import apiClient from '../apiClient';
import {
  storeToken,
  storeUserData,
  removeToken,
  removeUserData,
} from '../../utils/tokenStorage';

// Layanan untuk autentikasi
const authService = {
  // Login user
  // Di dalam fungsi login
  login: async credentials => {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      console.log('Login response:', response.data);

      // Simpan token dan data user jika login berhasil
      if (response.data && response.data.token) {
        await storeToken(response.data.token);
        // Pastikan data user memiliki ID
        if (response.data.user && response.data.user.id) {
          console.log('Storing user data with ID:', response.data.user.id);
          await storeUserData(response.data.user);

          // Verifikasi data tersimpan
          // const storedData = await getUserData(); // Import getUserData from tokenStorage

          // console.log('Verified stored user data:', storedData);
        } else {
          console.error('User data tidak memiliki ID');
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async userData => {
    try {
      const response = await apiClient.post('/api/auth/register', userData);

      // Jika API mengembalikan token setelah registrasi, simpan token
      if (response.data && response.data.token) {
        await storeToken(response.data.token);
        await storeUserData(response.data.user || {});
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post('/api/auth/logout');

      // Hapus token dan data user dari penyimpanan lokal
      await removeToken();
      await removeUserData();

      return response;
    } catch (error) {
      // Tetap hapus token dan data user meskipun API logout gagal
      await removeToken();
      await removeUserData();
      throw error;
    }
  },
};

export default authService;
