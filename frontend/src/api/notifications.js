import api from './client';

export const getMyNotifications = () =>
  api.get('/notifications').then(r => r.data.data);

export const getUnreadNotificationsCount = () =>
  api.get('/notifications/unread/count').then(r => r.data.data);

export const markNotificationAsRead = (id) =>
  api.patch(`/notifications/${id}/read`).then(r => r.data.data);

export const markAllNotificationsAsRead = () =>
  api.patch('/notifications/read-all').then(r => r.data.data);
