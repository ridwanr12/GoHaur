import apiClient from './apiClient';
import API_CONFIG from './config';

// Import semua service
import authService from './services/authService';
import orderService from './services/orderService';
import profileService from './services/profileService';
import storeService from './services/storeService';
import productService from './services/productService';
import uploadService from './services/uploadService';
import feedbackService from './services/feedbackService';

// Pastikan untuk mengekspor semua service
export {
  apiClient,
  API_CONFIG,
  authService,
  orderService,
  profileService,
  storeService,
  productService,
  uploadService,
  feedbackService,
};
