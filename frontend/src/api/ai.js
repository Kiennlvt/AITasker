import api from './client';

export const generatePRD = (jobData) =>
  api.post('/ai/generate-prd', jobData).then((r) => r.data.data);

export const suggestExperts = (jobData) =>
  api.post('/ai/suggest-experts', jobData).then((r) => r.data.data);

export const getProposalInsights = (jobId) =>
  api.get(`/ai/proposal-insights/${jobId}`).then((r) => r.data.data);
