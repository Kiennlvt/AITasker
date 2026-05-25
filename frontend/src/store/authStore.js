import { create } from 'zustand';

const stored = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

const useAuthStore = create((set) => ({
  user: stored(),
  token: localStorage.getItem('accessToken'),

  setAuth: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      avatarUrl: data.avatarUrl,
    }));
    set({ token: data.accessToken, user: { id: data.id, email: data.email, fullName: data.fullName, role: data.role, avatarUrl: data.avatarUrl } });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
