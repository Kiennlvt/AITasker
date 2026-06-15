import api from './client';

// ── Stats ──────────────────────────────────────────────────────────────────
export const getAdminStats = () =>
  api.get('/admin/stats').then(r => r.data.data);

// ── Users ──────────────────────────────────────────────────────────────────
export const getAdminUsers = (role = 'ALL') =>
  api.get('/admin/users', { params: { role } }).then(r => r.data.data);

export const toggleUserStatus = (id) =>
  api.patch(`/admin/users/${id}/toggle-status`).then(r => r.data.data);

// ── Jobs ───────────────────────────────────────────────────────────────────
export const getAdminJobs = (status = 'ALL', page = 0, size = 20) =>
  api.get('/admin/jobs', { params: { status, page, size, sort: 'createdAt,desc' } }).then(r => r.data.data);

export const approveJob = (id) =>
  api.patch(`/admin/jobs/${id}/approve`).then(r => r.data.data);

export const rejectJob = (id) =>
  api.patch(`/admin/jobs/${id}/reject`).then(r => r.data.data);