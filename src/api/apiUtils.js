import API_CONFIG from './config';

// Fungsi untuk menangani respons dari fetch
const handleResponse = async response => {
  if (!response.ok) {
    let message = response.statusText || 'Terjadi kesalahan pada server';

    try {
      const errorData = await response.json();
      if (Array.isArray(errorData?.message)) {
        message = errorData.message.join(', ');
      } else if (errorData?.message) {
        message = String(errorData.message);
      } else if (errorData?.error) {
        message = String(errorData.error);
      }
    } catch (parseError) {
      // Body bukan JSON; pakai statusText.
    }

    throw new Error(`${response.status}: ${message}`);
  }

  // Cek jika respons kosong
  if (response.status === 204) {
    return null;
  }

  // Parse respons JSON
  return response.json();
};

// Fungsi untuk membuat URL lengkap
const createUrl = endpoint => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fungsi untuk menambahkan timeout ke fetch request
const timeoutPromise = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, ms);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
};

export {handleResponse, createUrl, timeoutPromise};
