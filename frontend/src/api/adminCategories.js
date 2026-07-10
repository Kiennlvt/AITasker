import api from './client';

export const getAdminCategories = () =>
  api.get('/admin/categories').then(r => r.data.data);

export const getAdminCategoryStats = () =>
  api.get('/admin/categories/stats').then(r => r.data.data);

export const createCategory = (data) =>
  api.post('/admin/categories', data).then(r => r.data.data);

export const updateCategory = (id, data) =>
  api.put(`/admin/categories/${id}`, data).then(r => r.data.data);

export const toggleCategory = (id) =>
  api.patch(`/admin/categories/${id}/toggle`).then(r => r.data.data);

export const deleteCategory = (id) =>
  api.delete(`/admin/categories/${id}`).then(r => r.data);
