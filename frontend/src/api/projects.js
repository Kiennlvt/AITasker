import api from './client';

export const getMyProjects = () =>
  api.get('/projects').then(r => r.data.data);

export const getProjectById = (id) =>
  api.get(`/projects/${id}`).then(r => r.data.data);

export const getMilestones = (projectId) =>
  api.get(`/projects/${projectId}/milestones`).then(r => r.data.data);

export const approveMilestone = (milestoneId) =>
  api.patch(`/projects/milestones/${milestoneId}/approve`).then(r => r.data.data);

export const requestRevision = (milestoneId) =>
  api.patch(`/projects/milestones/${milestoneId}/revision`).then(r => r.data.data);

export const submitMilestone = (milestoneId) =>
  api.patch(`/projects/milestones/${milestoneId}/submit`).then(r => r.data.data);