import apiClient from '../apiClient';
import {getUserId} from '../../utils/tokenStorage';
import API_CONFIG from '../config';

const profileService = {
  // Mendapatkan data profil pengguna
  getProfile: async () => {
    const userId = await getUserId();
    console.log('User ID for profile request:', userId);
    if (!userId) {
      throw new Error('User ID tidak ditemukan');
    }
    // Pastikan endpoint sesuai dengan yang diharapkan backend
    const url = `/api/users/profile/${userId}`;
    console.log('Full profile request URL:', API_CONFIG.BASE_URL + url);
    return apiClient.get(url);
  },

  // Update data profil pengguna
  updateProfile: async profileData => {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User ID tidak ditemukan');
    }
    return apiClient.put(`/api/users/profile/${userId}`, profileData);
  },
};

export default profileService;
