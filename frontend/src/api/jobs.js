import api from './client';

export const getJobs = (page = 0, size = 10, sort = 'createdAt,desc') =>
  api.get('/jobs', { params: { page, size, sort } }).then(r => r.data.data);

export const getJobById = (id) =>
  api.get(`/jobs/${id}`).then(r => r.data.data);

export const getMyJobs = () =>
  api.get('/jobs/my-jobs').then(r => r.data.data);

export const createJob = (data) =>
  api.post('/jobs', data).then(r => r.data.data);

export const deleteJob = (id) =>
  api.delete(`/jobs/${id}`).then(r => r.data);

export const updateJob = (id, data) =>
  api.put(`/jobs/${id}`, data).then(r => r.data.data);

export const saveDraft = (data) =>
  api.post('/jobs', { ...data, draft: true }).then(r => r.data.data);

export const getMyDrafts = () =>
  api.get('/jobs/my-drafts').then(r => r.data.data);

export const publishDraft = (id) =>
  api.patch(`/jobs/${id}/publish`).then(r => r.data.data);