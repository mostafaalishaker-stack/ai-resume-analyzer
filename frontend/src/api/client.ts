import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  // In production, use httpOnly cookies instead of localStorage for better XSS protection
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const analyzeResume = (file: File) => {
  const fd = new FormData();
  fd.append('resume', file);
  return api.post('/resume/analyze', fd);
};

export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const register = (email: string, password: string) => api.post('/auth/register', { email, password });
