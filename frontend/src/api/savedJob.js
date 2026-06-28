import api from './client';

export const getSavedJobs = () =>
  api.get('/saved-jobs').then(r => r.data.data);

export const checkJobSaved = (jobId) =>
  api.get(`/saved-jobs/${jobId}/check`).then(r => r.data.data.saved);

export const saveJob = (jobId) =>
  api.post(`/saved-jobs/${jobId}`).then(r => r.data.data.saved);

export const unsaveJob = (jobId) =>
  api.delete(`/saved-jobs/${jobId}`).then(r => r.data.data.saved);
