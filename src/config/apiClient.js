import axios from 'axios';
import API_BASE_URL from './api';

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  console.log(`[API] ${response.status} ${response.config.url}`);
  return response;
}, (error) => {
  console.error(`[API] Error ${error.response?.status || 'NETWORK'} ${error.config?.url}:`, error.message);
  if (error.response?.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  }
  return Promise.reject(error);
});

export default apiClient;
