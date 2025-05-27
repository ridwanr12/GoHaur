import API_CONFIG from './config';

// Fungsi untuk menangani respons dari fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    // Jika respons bukan 2xx, coba parse error message
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Terjadi kesalahan pada server');
    } catch (error) {
      throw new Error(`${response.status}: ${response.statusText || 'Terjadi kesalahan pada server'}`);
    }
  }
  
  // Cek jika respons kosong
  if (response.status === 204) {
    return null;
  }
  
  // Parse respons JSON
  return response.json();
};

// Fungsi untuk membuat URL lengkap
const createUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fungsi untuk menambahkan timeout ke fetch request
const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

export { handleResponse, createUrl, timeoutPromise };