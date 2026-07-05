import api from './client';

export const getProposalsByJob = (jobId) =>
  api.get(`/proposals/job/${jobId}`).then(r => r.data.data);

export const getMyProposals = () =>
  api.get('/proposals/my-proposals').then(r => r.data.data);

export const acceptProposal = (id) =>
  api.patch(`/proposals/${id}/accept`).then(r => r.data.data);

export const rejectProposal = (id) =>
  api.patch(`/proposals/${id}/reject`).then(r => r.data.data);

export const submitProposal = (data) =>
  api.post('/proposals', data).then(r => r.data.data);

export const withdrawProposal = (id) =>
  api.patch(`/proposals/${id}/withdraw`).then(r => r.data.data);