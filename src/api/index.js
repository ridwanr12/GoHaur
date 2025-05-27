import apiClient from './apiClient';
import API_CONFIG from './config';

// Import semua service
import authService from './services/authService';
import orderService from './services/orderService';

// Tambahkan profileService ke ekspor
import profileService from './services/profileService';

// Pastikan untuk mengekspor profileService
export {
  apiClient,
  API_CONFIG,
  authService,
  orderService,
  profileService,
};
