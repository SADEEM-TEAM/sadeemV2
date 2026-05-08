import axios from 'axios';
import { mockAdapter, isMockMode } from './mock-adapter';

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  if (isMockMode()) {
    cfg.adapter = mockAdapter;
  }
  const token = localStorage.getItem('sadeen.token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('sadeen.token');
    }
    return Promise.reject(err);
  }
);
