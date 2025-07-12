import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../utils/adminAPI';
import { useToast } from '../../hooks/useToast';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Select from '../../components/Select';

const ApprovalCard = ({ item, onApprove, onReject, loading }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState({ approve: false, reject: false });

  const handleApprove = async () => {
    setActionLoading({ ...actionLoading, approve: true });
    await onApprove(item._id);
    setActionLoading({ ...actionLoading, approve: false });
  };

  const handleReject = async () => {
    setActionLoading({ ...actionLoading, reject: true });
    await onReject(item._id);
    setActionLoading({ ...actionLoading, reject: false });
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Item Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">👗</span>
                </div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Size {item.size}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                  {item.brand && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {item.brand}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👤 {item.uploader?.name}</span>
                  <span>📧 {item.uploader?.email}</span>
                  <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4">
              <Button
                onClick={handleApprove}
                loading={actionLoading.approve}
                disabled={loading || actionLoading.reject}
                variant="primary"
                size="sm"
              >
                ✅ Approve
              </Button>
              <Button
                onClick={handleReject}
                loading={actionLoading.reject}
                disabled={loading || actionLoading.approve}
                variant="outline"
                size="sm"
              >
                ❌ Reject
              </Button>
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
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-600">{item.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Points:</span>
                    <span className="ml-2 text-gray-600">{item.points}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Original Price:</span>
                    <span className="ml-2 text-gray-600">${item.originalPrice}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Views:</span>
                    <span className="ml-2 text-gray-600">{item.views}</span>
                  </div>
                </div>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.location && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">
                      {item.location.city}, {item.location.state}
                    </span>
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

const ManageItems = ({ pendingOnly = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    search: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = useToast();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = pendingOnly 
        ? await adminAPI.getPendingItems(filters)
        : await adminAPI.getItems(filters);
      
      if (response.success) {
        setItems(response.data || []);
        setPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [filters, pendingOnly, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleApprove = async (itemId) => {
    try {
      await adminAPI.approveItem(itemId, {
        notes: 'Item approved via admin panel'
      });
      toast.success('Item approved successfully');
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error('Failed to approve item');
    }
  };

  const handleReject = async (itemId) => {
    try {
      await adminAPI.rejectItem(itemId, {
        reason: 'Item does not meet platform guidelines',
        notes: 'Rejected via admin panel'
      });
      toast.success('Item rejected successfully');
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast.error('Failed to reject item');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to approve');
      return;
    }

    try {
      await adminAPI.bulkApproveItems({
        itemIds: selectedItems,
        notes: 'Bulk approved via admin panel'
      });
      toast.success(`${selectedItems.length} items approved successfully`);
      setSelectedItems([]);
      fetchItems();
    } catch (error) {
      console.error('Error bulk approving items:', error);
      toast.error('Failed to bulk approve items');
    }
  };

  const handleBulkReject = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to reject');
      return;
    }

    try {
      await adminAPI.bulkRejectItems({
        itemIds: selectedItems,
        reason: 'Items do not meet platform guidelines',
        notes: 'Bulk rejected via admin panel'
      });
      toast.success(`${selectedItems.length} items rejected successfully`);
      setSelectedItems([]);
      fetchItems();
    } catch (error) {
      console.error('Error bulk rejecting items:', error);
      toast.error('Failed to bulk reject items');
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'activewear', label: 'Activewear' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' },
    { value: 'points', label: 'Points' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {pendingOnly ? 'Pending Items' : 'All Items'}
        </h1>
        <p className="text-gray-600 mt-1">
          {pendingOnly 
            ? 'Review and moderate pending item submissions'
            : 'View and manage all items in the system'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value, page: 1 })}
              options={categoryOptions}
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
              placeholder="Search items..."
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
      {pendingOnly && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedItems.length} items selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleBulkApprove}
                disabled={selectedItems.length === 0}
                variant="primary"
                size="sm"
              >
                ✅ Approve Selected ({selectedItems.length})
              </Button>
              <Button
                onClick={handleBulkReject}
                disabled={selectedItems.length === 0}
                variant="outline"
                size="sm"
              >
                ❌ Reject Selected ({selectedItems.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">
            {pendingOnly 
              ? 'All items have been reviewed. Great job!'
              : 'No items match your current filters.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="relative">
              {pendingOnly && (
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item._id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item._id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              )}
              <ApprovalCard
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={loading}
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

export default ManageItems;
