// Konfigurasi API untuk koneksi ke server lokal
const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000', // Hapus /api di sini
  // BASE_URL: 'http://localhost:3000', // Gunakan localhost untuk iOS
  // BASE_URL: 'http://192.168.1.x:3000', // Gunakan IP jaringan lokal Anda untuk perangkat fisik
  TIMEOUT: 10000, // Timeout dalam milidetik
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default API_CONFIG;
