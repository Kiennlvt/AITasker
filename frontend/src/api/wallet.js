import api from './client';

export const getWallet = () =>
  api.get('/wallet').then(r => r.data.data);

export const getTransactions = (page = 0, size = 10) =>
  api.get('/wallet/transactions', { params: { page, size } }).then(r => r.data.data);

export const deposit = (amount) =>
  api.post('/wallet/deposit', { amount }).then(r => r.data.data);
