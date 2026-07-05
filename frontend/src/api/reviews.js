import api from './client';

export const createReview = (data) =>
  api.post('/reviews', data).then(r => r.data.data);

export const hasReviewed = (projectId) =>
  api.get(`/reviews/project/${projectId}/mine`).then(r => r.data.data);
