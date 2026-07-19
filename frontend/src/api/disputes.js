import api from './client';

export const fileDispute = (milestoneId, reason) =>
  api.post(`/disputes/milestones/${milestoneId}`, { reason }).then(r => r.data.data);

export const uploadDisputeEvidence = (disputeId, files) => {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  return api.post(`/disputes/${disputeId}/evidence`, form, {
    headers: { 'Content-Type': undefined },
  }).then(r => r.data.data);
};

export const respondToDispute = (disputeId, response) =>
  api.post(`/disputes/${disputeId}/respond`, { response }).then(r => r.data.data);

export const getDispute = (disputeId) =>
  api.get(`/disputes/${disputeId}`).then(r => r.data.data);

export const getProjectDisputes = (projectId) =>
  api.get(`/disputes/project/${projectId}`).then(r => r.data.data);
