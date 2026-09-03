import apiClient from '../apiClient';

/**
 * Service khusus untuk mengelola Endpoint '/api/orders'.
 * Memisahkan pemanggilan API dari halaman UI agar kode lebih bersih (Clean Architecture).
 */
const orderService = {
  // Mendapatkan semua pesanan (Biasanya untuk pembeli)
  getAllOrders: () => {
    return apiClient.get('/api/orders/my-orders');
  },

  // Mendapatkan detail satu pesanan secara spesifik
  getOrderById: orderId => {
    return apiClient.get(`/api/orders/${orderId}`);
  },

  // Membuat pesanan baru saat menekan tombol "Bayar" di CartScreen
  createOrder: orderData => {
    // Memanggil fungsi POST ke /api/orders
    return apiClient.post('/api/orders', orderData);
  },

  // Memperbarui status pesanan (Misal dari Seller menyetujui pesanan)
  updateOrderStatus: (orderId, statusData) => {
    // Backend menggunakan PUT untuk mengupdate status
    return apiClient.put(`/api/orders/${orderId}/status`, statusData);
  },
};

export default orderService;
