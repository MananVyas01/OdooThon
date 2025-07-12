import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Request API
export const requestAPI = {
  getRequests: (params) => api.get('/requests', { params }),
  getRequest: (id) => api.get(`/requests/${id}`),
  createRequest: (requestData) => api.post('/requests', requestData),
  updateRequest: (id, requestData) => api.put(`/requests/${id}`, requestData),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
  addComment: (id, comment) => api.post(`/requests/${id}/comments`, comment),
  getDashboardStats: () => api.get('/requests/dashboard/stats'),
};

export default api;
