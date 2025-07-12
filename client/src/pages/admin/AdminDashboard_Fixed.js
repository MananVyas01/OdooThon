import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated and is admin
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }
    
    try {
      const userObj = JSON.parse(user);
      return userObj.role === 'admin';
    } catch (e) {
      return false;
    }
  };

  // Auto-login function for testing
  const autoLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'password123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
          toast.success('Auto-login successful!');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return false;
    }
  };

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired, try auto-login
        const loginSuccess = await autoLogin();
        if (loginSuccess) {
          return fetchStats(); // Retry with new token
        } else {
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        toast.success('Statistics loaded successfully!');
      } else {
        throw new Error(data.message || 'Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    const init = async () => {
      // Check if already authenticated
      if (checkAuth()) {
        setIsAuthenticated(true);
        await fetchStats();
      } else {
        // Try auto-login
        const loginSuccess = await autoLogin();
        if (loginSuccess) {
          await fetchStats();
        } else {
          setError('Authentication required');
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  };

  const getApprovalRate = () => {
    if (!stats?.overview) return 0;
    const { totalItems, approvedItems } = stats.overview;
    return totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0;
  };

  const handleRetry = () => {
    fetchStats();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform statistics</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            {error.includes('Authentication') ? 'Authentication Required' : 'Failed to Load Statistics'}
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleLogin}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform statistics</p>
        {isAuthenticated && (
          <div className="mt-2 text-sm text-green-600">
            ✅ Authenticated as Admin
          </div>
        )}
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatNumber(stats?.overview?.totalUsers)}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatNumber(stats?.overview?.totalItems)}
          </div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatNumber(stats?.overview?.pendingItems)}
          </div>
          <div className="text-sm text-gray-600">Pending Items</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {getApprovalRate()}%
          </div>
          <div className="text-sm text-gray-600">Approval Rate</div>
        </div>
      </div>
      
      {/* User Roles & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles</h3>
          <div className="space-y-3">
            {stats?.userRoles && Object.entries(stats.userRoles).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{role}</span>
                <span className="font-semibold text-gray-900">{formatNumber(count)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {stats?.categoryStats?.slice(0, 5).map((category) => (
              <div key={category._id} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{category._id}</span>
                <span className="font-semibold text-gray-900">{formatNumber(category.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats?.recentActivity?.newUsersLast30Days)}
            </div>
            <div className="text-sm text-gray-600">New Users (30 days)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(stats?.recentActivity?.newItemsLast30Days)}
            </div>
            <div className="text-sm text-gray-600">New Items (30 days)</div>
          </div>
        </div>
      </div>
      
      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
