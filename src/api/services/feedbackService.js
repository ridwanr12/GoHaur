import apiClient from '../apiClient';

const feedbackService = {
  // GET: Mendapatkan daftar feedback untuk toko tertentu
  getStoreFeedbacks: (storeId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/feedback/store/${storeId}?${queryString}` : `/api/feedback/store/${storeId}`;
    return apiClient.get(url);
  },

  // GET: Mendapatkan rata-rata rating untuk toko tertentu
  getStoreRating: (storeId) => {
    return apiClient.get(`/api/feedback/store/${storeId}/rating`);
  },

  // GET: Mendapatkan feedback untuk pesanan tertentu
  getOrderFeedback: (orderId) => {
    return apiClient.get(`/api/feedback/order/${orderId}`);
  },

  // GET: Mendapatkan detail feedback berdasarkan ID
  getFeedbackById: (id) => {
    return apiClient.get(`/api/feedback/${id}`);
  },

  // POST: Membuat feedback baru (khusus pembeli)
  createFeedback: (feedbackData) => {
    // feedbackData minimal berisi: order_id, rating, description
    return apiClient.post('/api/feedback', feedbackData);
  },

  // PUT: Memperbarui feedback (khusus pembeli)
  updateFeedback: (id, feedbackData) => {
    return apiClient.put(`/api/feedback/${id}`, feedbackData);
  },

  // DELETE: Menghapus feedback (khusus pembeli)
  deleteFeedback: (id) => {
    return apiClient.delete(`/api/feedback/${id}`);
  },
};

export default feedbackService;
