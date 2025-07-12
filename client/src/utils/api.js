import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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

// Item API (for garment/clothing swap)
export const itemAPI = {
  getItems: (params) => api.get('/items', { params }),
  getItem: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  updateItemStatus: (id, status) => api.patch(`/items/${id}/status`, status),
  toggleLike: (id) => api.post(`/items/${id}/like`),
  getMyItems: (params) => api.get('/items/my-items', { params }),
  getDashboardStats: () => api.get('/items/dashboard/stats'),
};

// Swap API (for managing swap requests and points)
export const swapAPI = {
  createSwapRequest: (swapData) => api.post('/swaps', swapData),
  getUserSwapRequests: (params) => api.get('/swaps/user', { params }),
  getSwapRequest: (id) => api.get(`/swaps/${id}`),
  acceptSwapRequest: (id, responseData) => api.patch(`/swaps/${id}/accept`, responseData),
  declineSwapRequest: (id, responseData) => api.patch(`/swaps/${id}/decline`, responseData),
  completeSwapRequest: (id, completionData) => api.patch(`/swaps/${id}/complete`, completionData),
  cancelSwapRequest: (id) => api.patch(`/swaps/${id}/cancel`),
  getSwapStats: () => api.get('/swaps/stats'),
};

// Request API (legacy - keeping for backward compatibility)
export const requestAPI = {
  getRequests: (params) => api.get('/requests', { params }),
  getRequest: (id) => api.get(`/requests/${id}`),
  createRequest: (requestData) => api.post('/requests', requestData),
  updateRequest: (id, requestData) => api.put(`/requests/${id}`, requestData),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
  addComment: (id, comment) => api.post(`/requests/${id}/comments`, comment),
  getDashboardStats: () => api.get('/requests/dashboard/stats'),
};

// Admin API (for admin moderation and management)
export const adminAPI = {
  // Dashboard stats
  getAdminStats: () => api.get('/admin/stats'),

  // Item management
  getPendingItems: (params) => api.get('/admin/items/pending', { params }),
  getAllItems: (params) => api.get('/admin/items', { params }),
  approveItem: (id, data) => api.patch(`/admin/items/${id}/approve`, data),
  rejectItem: (id, data) => api.patch(`/admin/items/${id}/reject`, data),
  bulkApproveItems: (data) => api.patch('/admin/items/bulk-approve', data),
  bulkRejectItems: (data) => api.patch('/admin/items/bulk-reject', data),

  // User management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, data) => api.patch(`/admin/users/${id}/role`, data),
  suspendUser: (id, data) => api.patch(`/admin/users/${id}/suspend`, data),
  deleteUser: (id, data) => api.delete(`/admin/users/${id}`, { data }),
  getUserStats: () => api.get('/admin/users/stats'),
  resetUserPassword: (id, data) => api.patch(`/admin/users/${id}/reset-password`, data),
};

export default api;
