import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../utils/adminAPI';
import { useToast } from '../../hooks/useToast';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';

const UserCard = ({ user, onUpdateRole, onSuspend, onDelete, onUnsuspend, loading, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [newRole, setNewRole] = useState(user.role);

  const handleRoleUpdate = async () => {
    if (newRole === user.role) return;
    
    setActionLoading({ ...actionLoading, role: true });
    await onUpdateRole(user._id, newRole);
    setActionLoading({ ...actionLoading, role: false });
  };

  const handleSuspend = async () => {
    setActionLoading({ ...actionLoading, suspend: true });
    await onSuspend(user._id);
    setActionLoading({ ...actionLoading, suspend: false });
  };

  const handleUnsuspend = async () => {
    setActionLoading({ ...actionLoading, unsuspend: true });
    await onUnsuspend(user._id);
    setActionLoading({ ...actionLoading, unsuspend: false });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setActionLoading({ ...actionLoading, delete: true });
      await onDelete(user._id);
      setActionLoading({ ...actionLoading, delete: false });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCurrentUser = currentUser?._id === user._id;
  const canModify = !isCurrentUser && currentUser?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-xl font-medium text-gray-600">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-sm text-blue-600 font-medium">(You)</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  {user.isVerified && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⭐ {user.points} points</span>
                  <span>📦 {user.totalItems || 0} items</span>
                  <span>🔄 {user.swapCount || 0} swaps</span>
                  <span>📅 {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Role Management */}
            {canModify && (
              <div className="flex items-center space-x-3 mt-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Role:</label>
                  <Select
                    value={newRole}
                    onChange={setNewRole}
                    options={[
                      { value: 'user', label: 'User' },
                      { value: 'manager', label: 'Manager' },
                      { value: 'admin', label: 'Admin' }
                    ]}
                    className="w-32"
                  />
                  {newRole !== user.role && (
                    <Button
                      onClick={handleRoleUpdate}
                      loading={actionLoading.role}
                      variant="primary"
                      size="sm"
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4">
              {canModify && (
                <>
                  {user.status === 'active' ? (
                    <Button
                      onClick={handleSuspend}
                      loading={actionLoading.suspend}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      🚫 Suspend
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUnsuspend}
                      loading={actionLoading.unsuspend}
                      disabled={loading}
                      variant="primary"
                      size="sm"
                    >
                      ✅ Unsuspend
                    </Button>
                  )}
                  <Button
                    onClick={handleDelete}
                    loading={actionLoading.delete}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    🗑️ Delete
                  </Button>
                </>
              )}
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>

            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-600">{user.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Login:</span>
                    <span className="ml-2 text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email Verified:</span>
                    <span className="ml-2 text-gray-600">{user.isVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Join Date:</span>
                    <span className="ml-2 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {user.bio && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Bio:</span>
                    <p className="mt-1 text-gray-600">{user.bio}</p>
                  </div>
                )}

                {user.location && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">
                      {user.location.city}, {user.location.state}
                    </span>
                  </div>
                )}

                {user.preferences && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Preferences:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.preferences.categories?.map((category, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.suspensionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <span className="font-medium text-red-800">Suspension Reason:</span>
                    <p className="mt-1 text-red-700">{user.suspensionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    status: '',
    search: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const toast = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(filters);
      if (response.success) {
        setUsers(response.data || []);
        setPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await adminAPI.suspendUser(userId, {
        reason: 'Account suspended by admin',
        duration: 30 // 30 days
      });
      toast.success('User suspended successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleUnsuspend = async (userId) => {
    try {
      await adminAPI.unsuspendUser(userId);
      toast.success('User unsuspended successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error unsuspending user:', error);
      toast.error('Failed to unsuspend user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBulkSuspend = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users to suspend');
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(userId => 
          adminAPI.suspendUser(userId, {
            reason: 'Bulk suspended by admin',
            duration: 30
          })
        )
      );
      toast.success(`${selectedUsers.length} users suspended successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error bulk suspending users:', error);
      toast.error('Failed to suspend some users');
    }
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Joined' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'points', label: 'Points' },
    { value: 'lastLogin', label: 'Last Login' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-1">
          View and manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              value={filters.role}
              onChange={(value) => setFilters({ ...filters, role: value, page: 1 })}
              options={roleOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
              options={statusOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search users..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <Select
              value={filters.sort}
              onChange={(value) => setFilters({ ...filters, sort: value, page: 1 })}
              options={sortOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <Select
              value={filters.order}
              onChange={(value) => setFilters({ ...filters, order: value, page: 1 })}
              options={orderOptions}
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              {selectedUsers.length} users selected
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleBulkSuspend}
              disabled={selectedUsers.length === 0}
              variant="outline"
              size="sm"
            >
              🚫 Suspend Selected ({selectedUsers.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="xl" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            No users match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="relative">
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user._id]);
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                    }
                  }}
                  disabled={currentUser?._id === user._id}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <UserCard
                user={user}
                onUpdateRole={handleUpdateRole}
                onSuspend={handleSuspend}
                onUnsuspend={handleUnsuspend}
                onDelete={handleDelete}
                loading={loading}
                currentUser={currentUser}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page <= 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page >= pagination.pages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
