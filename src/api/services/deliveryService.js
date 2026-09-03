import apiClient from '../apiClient';

const deliveryService = {
  // Mendapatkan detail pengiriman berdasarkan ID pengiriman
  getDeliveryById: (id) => {
    return apiClient.get(`/api/deliveries/${id}`);
  },

  // Mendapatkan detail pengiriman berdasarkan ID pesanan
  getDeliveryByOrderId: (orderId) => {
    return apiClient.get(`/api/deliveries/order/${orderId}`);
  },

  // Memperbarui status pengiriman (khusus kurir)
  // Status yang valid: 'order_received', 'out_for_delivery', 'completed'
  updateDeliveryStatus: (id, status) => {
    return apiClient.put(`/api/deliveries/${id}/status`, { status });
  },
};

export default deliveryService;
