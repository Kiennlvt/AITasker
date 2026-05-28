import api from './client';

export const getServices = (page = 0, size = 12) =>
  api.get('/services', { params: { page, size } }).then(r => r.data.data);

export const getServiceById = (id) =>
  api.get(`/services/${id}`).then(r => r.data.data);

export const getMyServices = () =>
  api.get('/services/my-services').then(r => r.data.data);