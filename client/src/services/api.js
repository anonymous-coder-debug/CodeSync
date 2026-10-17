import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every outgoing request, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('codesync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize the "session expired" experience
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codesync_token');
      localStorage.removeItem('codesync_user');
    }
    return Promise.reject(error);
  }
);

// Pulls a human-readable message out of any Axios/API error shape
export const getErrorMessage = (error) => {
  if (error.response?.data?.details?.length) {
    return error.response.data.details.join(', ');
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Please check your connection and try again.';
  }
  return error.message || 'Something went wrong. Please try again.';
};

export default api;
