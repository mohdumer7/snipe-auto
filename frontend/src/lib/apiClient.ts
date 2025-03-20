import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Use relative URL so that Next.js routes are used.
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' && localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
