import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with proper configuration
const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API Methods
export const adminApiService = {
  // Get admin statistics
  getStats: async () => {
    try {
      const response = await adminAPI.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  // Get all users
  getUsers: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await adminAPI.get('/admin/users', {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get all items
  getItems: async (page = 1, limit = 10, status = '', category = '') => {
    try {
      const response = await adminAPI.get('/admin/items', {
        params: { page, limit, status, category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch items');
    }
  },

  // Get pending items
  getPendingItems: async (page = 1, limit = 10) => {
    try {
      const response = await adminAPI.get('/admin/pending-items', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending items:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending items');
    }
  },

  // Approve item
  approveItem: async (itemId) => {
    try {
      const response = await adminAPI.post(`/admin/items/${itemId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving item:', error);
      throw new Error(error.response?.data?.message || 'Failed to approve item');
    }
  },

  // Reject item
  rejectItem: async (itemId, reason = '') => {
    try {
      const response = await adminAPI.post(`/admin/items/${itemId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting item:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject item');
    }
  },

  // Bulk approve items
  bulkApproveItems: async (itemIds) => {
    try {
      const response = await adminAPI.post('/admin/items/bulk-approve', { itemIds });
      return response.data;
    } catch (error) {
      console.error('Error bulk approving items:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk approve items');
    }
  },

  // Bulk reject items
  bulkRejectItems: async (itemIds, reason = '') => {
    try {
      const response = await adminAPI.post('/admin/items/bulk-reject', { itemIds, reason });
      return response.data;
    } catch (error) {
      console.error('Error bulk rejecting items:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk reject items');
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await adminAPI.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  },

  // Suspend user
  suspendUser: async (userId, reason = '') => {
    try {
      const response = await adminAPI.post(`/admin/users/${userId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw new Error(error.response?.data?.message || 'Failed to suspend user');
    }
  },

  // Unsuspend user
  unsuspendUser: async (userId) => {
    try {
      const response = await adminAPI.post(`/admin/users/${userId}/unsuspend`);
      return response.data;
    } catch (error) {
      console.error('Error unsuspending user:', error);
      throw new Error(error.response?.data?.message || 'Failed to unsuspend user');
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await adminAPI.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await adminAPI.get('/admin/test');
      return response.data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw new Error(error.response?.data?.message || 'Failed to connect to admin API');
    }
  }
};

export default adminApiService;
