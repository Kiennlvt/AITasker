import api from './client';

export const findOrCreateDirect = (recipientId) =>
  api.post(`/conversations/direct?recipientId=${recipientId}`).then(r => r.data.data);
