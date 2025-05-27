import API_CONFIG from './config';
import {handleResponse, createUrl, timeoutPromise} from './apiUtils';
import {getToken} from '../utils/tokenStorage';

// Fungsi untuk mendapatkan header dengan token
const getAuthHeaders = async (customHeaders = {}) => {
  const token = await getToken();
  return {
    ...API_CONFIG.HEADERS,
    ...customHeaders,
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };
};

// Fungsi dasar untuk melakukan request
const request = async (
  endpoint,
  method = 'GET',
  data = null,
  customHeaders = {},
) => {
  const url = createUrl(endpoint);

  const headers = await getAuthHeaders(customHeaders);

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await timeoutPromise(
      API_CONFIG.TIMEOUT,
      fetch(url, config),
    );
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Metode HTTP yang umum digunakan
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
