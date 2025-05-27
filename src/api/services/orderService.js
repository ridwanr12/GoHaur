import apiClient from '../apiClient';

// Layanan untuk pesanan
const orderService = {
  // Mendapatkan semua pesanan
  getAllOrders: () => {
    return apiClient.get('/orders');
  },

  // Mendapatkan detail pesanan berdasarkan ID
  getOrderById: orderId => {
    return apiClient.get(`/orders/${orderId}`);
  },

  // Membuat pesanan baru
  createOrder: orderData => {
    return apiClient.post('/orders', orderData);
  },

  // Memperbarui status pesanan
  updateOrderStatus: (orderId, statusData) => {
    return apiClient.patch(`/orders/${orderId}/status`, statusData);
  },
};

export default orderService;
