import api from './client';

export const getSavedServices = () =>
  api.get('/saved-services').then(r => r.data.data);

export const checkSaved = (serviceId) =>
  api.get(`/saved-services/${serviceId}/check`).then(r => r.data.data.saved);

export const saveService = (serviceId) =>
  api.post(`/saved-services/${serviceId}`).then(r => r.data.data.saved);

export const unsaveService = (serviceId) =>
  api.delete(`/saved-services/${serviceId}`).then(r => r.data.data.saved);