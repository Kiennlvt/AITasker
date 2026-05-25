import api from './client';

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data.data);

export const register = (email, password, fullName, role) =>
  api.post('/auth/register', { email, password, fullName, role }).then((r) => r.data.data);

export const getMe = () =>
  api.get('/users/me').then((r) => r.data.data);
