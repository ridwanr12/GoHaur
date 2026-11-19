import apiClient from '../apiClient';

const orderService = {
  // Pesanan milik buyer yang sedang login
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `/api/orders/my-orders?${query}`
      : '/api/orders/my-orders';
    return apiClient.get(url);
  },

  // Pesanan yang masuk ke toko seller
  getStoreOrders: (storeId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `/api/orders/store/${storeId}?${query}`
      : `/api/orders/store/${storeId}`;
    return apiClient.get(url);
  },

  getOrderById: orderId => {
    return apiClient.get(`/api/orders/${orderId}`);
  },

  createOrder: orderData => {
    return apiClient.post('/api/orders', orderData);
  },

  // Aksi seller
  acceptOrder: orderId => {
    return apiClient.put(`/api/orders/${orderId}/accept`);
  },

  rejectOrder: (orderId, rejectionReason) => {
    return apiClient.put(`/api/orders/${orderId}/reject`, {
      rejection_reason: rejectionReason || null,
    });
  },

  shipOrder: (orderId, {courier_name, courier_plate}) => {
    return apiClient.put(`/api/orders/${orderId}/ship`, {
      courier_name,
      courier_plate,
    });
  },

  // Aksi buyer
  completeOrder: orderId => {
    return apiClient.put(`/api/orders/${orderId}/complete`);
  },

  // Seller menandai refund manual sudah dikirim
  refundOrder: (orderId, refundNote) => {
    return apiClient.put(`/api/orders/${orderId}/refund`, {
      refund_note: refundNote || null,
    });
  },
};

export default orderService;
