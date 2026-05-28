import api from './client';

export const getJobs = (page = 0, size = 10) =>
  api.get('/jobs', { params: { page, size, sort: 'createdAt,desc' } }).then(r => r.data.data);

export const getJobById = (id) =>
  api.get(`/jobs/${id}`).then(r => r.data.data);

export const getMyJobs = () =>
  api.get('/jobs/my-jobs').then(r => r.data.data);

export const createJob = (data) =>
  api.post('/jobs', data).then(r => r.data.data);

export const deleteJob = (id) =>
  api.delete(`/jobs/${id}`).then(r => r.data);