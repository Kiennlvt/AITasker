import api from './client';

export const getServices = (page = 0, size = 12, sort = 'createdAt,desc') =>
  api.get('/services', { params: { page, size, sort } }).then(r => r.data.data);

export const getServiceById = (id) =>
  api.get(`/services/${id}`).then(r => r.data.data);

export const getMyServices = () =>
  api.get('/services/my-services').then(r => r.data.data);

export const createService = (data) =>
  api.post('/services', data).then(r => r.data.data);

export const getServicesByExpert = (expertId) =>
  api.get(`/services/expert/${expertId}`).then(r => r.data.data);