import apiClient from '../apiClient';

const notificationService = {
  getNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/api/notifications?${query}` : '/api/notifications';
    return apiClient.get(url);
  },

  getUnreadCount: () => {
    return apiClient.get('/api/notifications/unread-count');
  },

  markRead: id => {
    return apiClient.patch(`/api/notifications/${id}/read`);
  },

  markAllRead: () => {
    return apiClient.patch('/api/notifications/read-all');
  },
};

export default notificationService;
