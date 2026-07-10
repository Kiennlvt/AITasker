import api from './client';

export const getCategories = () =>
  api.get('/categories').then(r => r.data.data)