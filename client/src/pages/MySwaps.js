import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { swapAPI } from '../utils/api';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Select from '../components/Select';
import Modal from '../components/Modal';
import TextArea from '../components/TextArea';

const MySwaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({});
  const [responseModal, setResponseModal] = useState({ isOpen: false, swap: null, action: null });
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const toast = useToast();

  const fetchSwaps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await swapAPI.getUserSwapRequests(filters);
      setSwaps(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      toast.error('Failed to load swap requests');
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchSwaps();
  }, [filters, fetchSwaps]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleResponse = (swap, action) => {
    setResponseModal({ isOpen: true, swap, action });
    setResponseMessage('');
  };

  const submitResponse = async () => {
    if (!responseModal.swap) return;

    try {
      setResponding(true);
      const { swap, action } = responseModal;
      
      if (action === 'accept') {
        await swapAPI.acceptSwapRequest(swap._id, { responseMessage });
        toast.success('Swap request accepted!');
      } else if (action === 'decline') {
        await swapAPI.declineSwapRequest(swap._id, { responseMessage });
        toast.success('Swap request declined');
      }

      setResponseModal({ isOpen: false, swap: null, action: null });
      fetchSwaps();
    } catch (error) {
      console.error('Error responding to swap:', error);
      toast.error('Failed to respond to swap request');
    } finally {
      setResponding(false);
    }
  };

  const handleComplete = async (swapId) => {
    try {
      await swapAPI.completeSwapRequest(swapId, { 
        completionNotes: 'Swap completed successfully' 
      });
      toast.success('Swap marked as completed!');
      fetchSwaps();
    } catch (error) {
      console.error('Error completing swap:', error);
      toast.error('Failed to complete swap');
    }
  };

  const handleCancel = async (swapId) => {
    try {
      await swapAPI.cancelSwapRequest(swapId);
      toast.success('Swap request cancelled');
      fetchSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
      toast.error('Failed to cancel swap request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode) => {
    return mode === 'swap' ? '🔄' : '💎';
  };

  const typeOptions = [
    { value: 'all', label: 'All Swaps' },
    { value: 'sent', label: 'Sent Requests' },
    { value: 'received', label: 'Received Requests' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Swaps</h1>
          <p className="text-gray-600 mt-2">Manage your swap requests and exchanges</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <Select
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
                options={typeOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={statusOptions}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ type: 'all', status: '', page: 1, limit: 20 })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Swaps List */}
        {swaps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No swap requests found</h3>
            <p className="text-gray-600 mb-4">
              Start browsing items to make your first swap request!
            </p>
            <Link to="/items">
              <Button>Browse Items</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {swaps.map((swap) => (
              <div
                key={swap._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getModeIcon(swap.mode)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {swap.item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {swap.mode === 'swap' ? 'Item Swap' : `${swap.pointsOffered} Points`}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(swap.status)}`}>
                        {swap.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Requested Item</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {swap.item.images && swap.item.images.length > 0 ? (
                            <img
                              src={swap.item.images[0].url}
                              alt={swap.item.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">👗</span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {swap.item.title}
                          </span>
                        </div>
                      </div>

                      {swap.mode === 'swap' && swap.offeredItem && (
                        <div>
                          <p className="text-sm text-gray-500">Offered Item</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {swap.offeredItem.images && swap.offeredItem.images.length > 0 ? (
                              <img
                                src={swap.offeredItem.images[0].url}
                                alt={swap.offeredItem.title}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">👗</span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {swap.offeredItem.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>From: {swap.requestedBy.name}</p>
                        <p>To: {swap.itemOwner.name}</p>
                      </div>
                      <div>
                        <p>Created: {new Date(swap.createdAt).toLocaleDateString()}</p>
                        {swap.response?.respondedAt && (
                          <p>Responded: {new Date(swap.response.respondedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    {swap.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{swap.message}</p>
                      </div>
                    )}

                    {swap.response?.message && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Response:</strong> {swap.response.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    {swap.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResponse(swap, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResponse(swap, 'decline')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {swap.status === 'accepted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComplete(swap._id)}
                      >
                        Mark Complete
                      </Button>
                    )}

                    {['pending', 'accepted'].includes(swap.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(swap._id)}
                      >
                        Cancel
                      </Button>
                    )}

                    <Link to={`/items/${swap.item._id}`}>
                      <Button variant="outline" size="sm">
                        View Item
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={pagination.page === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Response Modal */}
        <Modal
          isOpen={responseModal.isOpen}
          onClose={() => setResponseModal({ isOpen: false, swap: null, action: null })}
          title={`${responseModal.action === 'accept' ? 'Accept' : 'Decline'} Swap Request`}
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {responseModal.action === 'accept' 
                ? 'You are accepting this swap request. You can add a message to the requester.'
                : 'You are declining this swap request. Please provide a reason for the requester.'
              }
            </p>
            <TextArea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Add a message (optional)..."
              rows={3}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setResponseModal({ isOpen: false, swap: null, action: null })}
              >
                Cancel
              </Button>
              <Button
                variant={responseModal.action === 'accept' ? 'primary' : 'danger'}
                onClick={submitResponse}
                disabled={responding}
              >
                {responding ? 'Processing...' : (responseModal.action === 'accept' ? 'Accept' : 'Decline')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MySwaps;
