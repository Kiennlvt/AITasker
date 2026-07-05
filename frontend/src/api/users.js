import api from './client';

export const getMe = () =>
  api.get('/users/me').then(r => r.data.data);

export const updateMe = (data) =>
  api.put('/users/me', data).then(r => r.data.data);

export const getUserById = (id) =>
  api.get(`/users/${id}`).then(r => r.data.data);

export const getUserPublicStats = (id) =>
  api.get(`/users/${id}/stats`).then(r => r.data.data);

export const changePassword = (data) =>
  api.post('/users/me/change-password', data).then(r => r.data);