import api from './client';

export const getClientDashboard = () =>
  api.get('/dashboard/client').then((r) => r.data.data);

export const getExpertDashboard = () =>
  api.get('/dashboard/expert').then((r) => r.data.data);

export const getJobs = (page = 0, size = 10) =>
  api.get('/jobs', { params: { page, size, sort: 'createdAt,desc' } }).then((r) => r.data.data);

export const getMyJobs = () =>
  api.get('/jobs/my-jobs').then((r) => r.data.data);

export const getMyProjects = () =>
  api.get('/projects').then((r) => r.data.data);

export const getServices = (page = 0, size = 12) =>
  api.get('/services', { params: { page, size } }).then((r) => r.data.data);
