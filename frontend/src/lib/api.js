import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';

    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const auth = useAuthStore.getState();

      if (!auth.refreshToken) {
        auth.logout();
        return Promise.reject(error);
      }

      try {
        if (!refreshing) {
          refreshing = axios.post(`${API_BASE}/auth/refresh`, { refreshToken: auth.refreshToken })
            .then((r) => r.data)
            .finally(() => { refreshing = null; });
        }
        const data = await refreshing;
        auth.setSession(data);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        auth.logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
