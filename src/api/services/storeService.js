import apiClient from '../apiClient';

const storeService = {
  // Mendapatkan semua toko (bisa dengan query params: page, limit, search)
  getAllStores: (params = {}) => {
    // Membuat string query
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/stores?${queryString}` : '/api/stores';
    return apiClient.get(url);
  },

  // Mendapatkan detail toko berdasarkan ID
  getStoreById: (id) => {
    return apiClient.get(`/api/stores/${id}`);
  },

  // Mendapatkan toko milik penjual (seller) yang sedang login
  getMyStore: () => {
    return apiClient.get('/api/stores/my/store');
  },

  // Membuat toko baru
  createStore: (storeData) => {
    return apiClient.post('/api/stores', storeData);
  },

  // Memperbarui informasi toko
  updateStore: (id, storeData) => {
    return apiClient.put(`/api/stores/${id}`, storeData);
  },

  // Menghapus toko
  deleteStore: (id) => {
    return apiClient.delete(`/api/stores/${id}`);
  },
};

export default storeService;
