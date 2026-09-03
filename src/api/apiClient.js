import API_CONFIG from './config';
import {handleResponse, createUrl, timeoutPromise} from './apiUtils';
import {getToken} from '../utils/tokenStorage';

/**
 * Fungsi untuk menyematkan (inject) Token JWT ke dalam Headers setiap request HTTP.
 * Ini memastikan bahwa backend mengenali siapa user yang sedang mengakses API (terotentikasi).
 */
const getAuthHeaders = async (customHeaders = {}) => {
  const token = await getToken(); // Mengambil token dari memori lokal HP (AsyncStorage)
  return {
    ...API_CONFIG.HEADERS, // Misal: {'Content-Type': 'application/json'}
    ...customHeaders,
    // Jika token ada, tambahkan 'Authorization: Bearer <token>'
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
};

/**
 * Fungsi inti (core) untuk melakukan request ke backend.
 * Semua pemanggilan GET, POST, PUT, DELETE akan melewati fungsi ini.
 * Keuntungannya: kita hanya butuh satu fungsi untuk mengatur timeout, error handling, dan header auth.
 */
const request = async (
  endpoint,
  method = 'GET',
  data = null,
  customHeaders = {},
) => {
  // Menggabungkan BASE_URL dengan endpoint (contoh: http://localhost:5000 + /api/stores)
  const url = createUrl(endpoint);

  const headers = await getAuthHeaders(customHeaders);

  const config = {
    method,
    headers,
  };

  // Jika ada payload (data body), konversi ke JSON string
  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    // Memanggil API menggunakan fetch bawaan JavaScript dengan batas waktu (timeout)
    const response = await timeoutPromise(
      API_CONFIG.TIMEOUT,
      fetch(url, config),
    );
    // Mengubah response dari HTTP menjadi format yang siap dipakai (JSON)
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * apiClient adalah objek utilitas yang diekspor untuk dipakai oleh Service-Service kita.
 * Mempermudah memanggil `apiClient.get('/path')` dibanding menggunakan `fetch` berulang kali.
 */
const apiClient = {
  get: (endpoint, customHeaders = {}) => {
    return request(endpoint, 'GET', null, customHeaders);
  },

  post: (endpoint, data, customHeaders = {}) => {
    return request(endpoint, 'POST', data, customHeaders);
  },

  put: (endpoint, data, customHeaders = {}) => {
    return request(endpoint, 'PUT', data, customHeaders);
  },

  patch: (endpoint, data, customHeaders = {}) => {
    return request(endpoint, 'PATCH', data, customHeaders);
  },

  delete: (endpoint, customHeaders = {}) => {
    return request(endpoint, 'DELETE', null, customHeaders);
  },
};

export default apiClient;
