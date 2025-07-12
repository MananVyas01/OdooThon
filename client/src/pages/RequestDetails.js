import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { requestAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getRequest(id);
      setRequest(response.data.request);
    } catch (error) {
      console.error('Error fetching request:', error);
      toast.error('Failed to load request');
      navigate('/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      await requestAPI.addComment(id, { text: newComment });
      setNewComment('');
      toast.success('Comment added successfully');
      fetchRequest(); // Refresh to show new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      setDeleting(true);
      await requestAPI.deleteRequest(id);
      toast.success('Request deleted successfully');
      navigate('/requests');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = request && (
    request.createdBy._id === user?.id || 
    user?.role === 'admin' || 
    user?.role === 'manager'
  );

  const canDelete = request && (
    request.createdBy._id === user?.id || 
    user?.role === 'admin'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Request not found</p>
          <Button onClick={() => navigate('/requests')}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
              <p className="text-gray-600 mt-2">Request Details</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate('/requests')}
              >
                Back to List
              </Button>
              {canEdit && (
                <Link to={`/requests/${id}/edit`}>
                  <Button variant="outline">
                    Edit
                  </Button>
                </Link>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  onClick={() => setDeleteModal(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-sm text-gray-900">{request.category}</p>
                </div>
                {request.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{request.location}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
              </div>

              {request.dueDate && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(request.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p className="font-medium">Created</p>
                  <p>{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p>{new Date(request.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({request.comments?.length || 0})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <Button
                  type="submit"
                  loading={addingComment}
                  disabled={addingComment || !newComment.trim()}
                >
                  Add Comment
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {request.comments?.map((comment) => (
                  <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 font-medium text-sm">
                            {comment.createdBy?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {comment.createdBy?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))}

                {(!request.comments || request.comments.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Created By */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Created By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium">
                    {request.createdBy?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.createdBy?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {request.createdBy?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {request.createdBy?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned To */}
            {request.assignedTo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned To</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-medium">
                      {request.assignedTo?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {request.assignedTo?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.assignedTo?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.assignedTo?.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {request.tags && request.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {request.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Request"
      >
        <div className="mb-4">
          <p className="text-gray-700">
            Are you sure you want to delete this request? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDeleteRequest}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RequestDetails;
