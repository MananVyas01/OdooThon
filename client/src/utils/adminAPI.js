// Fixed admin API service
const adminAPI = {
  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`/api${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Admin statistics
  async getAdminStats() {
    return this.makeRequest('/admin/stats');
  },

  // Item management
  async getItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/admin/items${queryString ? `?${queryString}` : ''}`);
  },

  async getPendingItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/admin/pending-items${queryString ? `?${queryString}` : ''}`);
  },

  async approveItem(itemId) {
    return this.makeRequest(`/admin/items/${itemId}/approve`, {
      method: 'POST',
    });
  },

  async rejectItem(itemId, reason = '') {
    return this.makeRequest(`/admin/items/${itemId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async bulkApproveItems(itemIds) {
    return this.makeRequest('/admin/items/bulk-approve', {
      method: 'POST',
      body: JSON.stringify({ itemIds }),
    });
  },

  async bulkRejectItems(itemIds, reason = '') {
    return this.makeRequest('/admin/items/bulk-reject', {
      method: 'POST',
      body: JSON.stringify({ itemIds, reason }),
    });
  },

  // User management
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  async updateUserRole(userId, role) {
    return this.makeRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async suspendUser(userId, reason = '') {
    return this.makeRequest(`/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async unsuspendUser(userId) {
    return this.makeRequest(`/admin/users/${userId}/unsuspend`, {
      method: 'POST',
    });
  },

  async deleteUser(userId) {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Authentication
  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

export { adminAPI };
