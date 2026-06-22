import api from './client';

export const getMyProjects = () =>
  api.get('/projects').then(r => r.data.data);

export const getProjectById = (id) =>
  api.get(`/projects/${id}`).then(r => r.data.data);

export const getMilestones = (projectId) =>
  api.get(`/projects/${projectId}/milestones`).then(r => r.data.data);


export const createMilestone = (projectId, milestone) =>
  api.post(`/projects/${projectId}/milestones`, milestone).then(r => r.data.data);

export const updateMilestone = (projectId, milestoneId, milestone) =>
  api.put(`/projects/${projectId}/milestones/${milestoneId}`, milestone).then(r => r.data.data);

export const approveMilestone = (milestoneId) =>
  api.patch(`/projects/milestones/${milestoneId}/approve`).then(r => r.data.data);

export const requestRevision = (milestoneId, note) =>
  api.patch(`/projects/milestones/${milestoneId}/revision`, null, { params: { note } }).then(r => r.data.data);

export const submitMilestone = (milestoneId, note) =>
  api.patch(`/projects/milestones/${milestoneId}/submit`, null, { params: { note } }).then(r => r.data.data);

export const uploadMilestoneFiles = (milestoneId, files) => {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  return api.post(`/projects/milestones/${milestoneId}/files`, form, {
    headers: { 'Content-Type': undefined },
  }).then(r => r.data.data);
};