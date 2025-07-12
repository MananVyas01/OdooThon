import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SwapModal from '../components/SwapModal';
import ImageGallery from '../components/ImageGallery';
import { showToast } from '../utils/toast';

const ItemDetails = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchItem();
    if (user) {
      fetchUserItems();
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getItem(id);
      setItem(response.data.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await itemAPI.getMyItems({ limit: 50 });
      setUserItems(response.data.data);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const response = await itemAPI.toggleLike(id);
      const isLiked = response.data.liked;
      
      if (isLiked) {
        showToast.success('❤️ Added to favorites!', {
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          },
        });
      } else {
        showToast.info('💔 Removed from favorites', {
          duration: 2000,
        });
      }
      
      fetchItem(); // Refresh to update like status
    } catch (error) {
      console.error('Error toggling like:', error);
      showToast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await itemAPI.deleteItem(id);
      showToast.success('🗑️ Item deleted successfully');
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast.error('Failed to delete item');
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
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

  const getCategoryColor = (category) => {
    const colors = {
      'tops': 'bg-blue-100 text-blue-800',
      'bottoms': 'bg-purple-100 text-purple-800',
      'outerwear': 'bg-indigo-100 text-indigo-800',
      'dresses': 'bg-pink-100 text-pink-800',
      'shoes': 'bg-cyan-100 text-cyan-800',
      'accessories': 'bg-yellow-100 text-yellow-800',
      'activewear': 'bg-green-100 text-green-800',
      'formal': 'bg-gray-100 text-gray-800',
      'casual': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isOwner = user && item && item.uploader._id === user._id;
  const isLiked = user && item && item.likes.some(like => like._id === user._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="xl" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <Link to="/items">
            <Button>Browse Items</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/items')}>
            ← Back to Items
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <ImageGallery 
              images={item.images} 
              itemTitle={item.title}
            />
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!isOwner && (
                    <Button
                      variant="outline"
                      onClick={handleLikeToggle}
                      className="flex items-center space-x-1"
                    >
                      <span>{isLiked ? '❤️' : '🤍'}</span>
                      <span>{item.likes?.length || 0}</span>
                    </Button>
                  )}
                  
                  {isOwner && (
                    <>
                      <Link to={`/items/${item._id}/edit`}>
                        <Button variant="outline">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        onClick={() => setDeleteModal(true)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👁️ {item.views || 0} views</span>
                <span>❤️ {item.likes?.length || 0} likes</span>
                {item.brand && <span>🏷️ {item.brand}</span>}
                {item.originalPrice && <span>💰 ${item.originalPrice}</span>}
              </div>
            </div>

            {/* Item Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Size</span>
                  <p className="text-gray-900">{item.size}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Condition</span>
                  <p className="text-gray-900 capitalize">{item.condition}</p>
                </div>
                {item.type && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="text-gray-900">{item.type}</p>
                  </div>
                )}
                {item.brand && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Brand</span>
                    <p className="text-gray-900">{item.brand}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-700">
                📍 {item.location.city}, {item.location.state}
                {item.location.zipCode && ` ${item.location.zipCode}`}
              </p>
            </div>

            {/* Swap Preferences */}
            {item.swapPreferences?.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Swap Preferences</h2>
                <p className="text-gray-700">{item.swapPreferences.notes}</p>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Listed By</h2>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {item.uploader.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.uploader.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.uploader.points || 0} points
                  </p>
                </div>
              </div>
            </div>

            {/* Contact/Swap Button */}
            {!isOwner && item.availability === 'available' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => setSwapModal(true)}
                  >
                    <span>🔄</span>
                    <span>Request Swap</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => setSwapModal(true)}
                  >
                    <span>💎</span>
                    <span>Redeem with Points</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Your points: {user?.points || 0} | Suggested: {item.points || 10} points
                </p>
              </div>
            )}

            {/* Item Not Available */}
            {!isOwner && item.availability !== 'available' && (
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <p className="text-gray-600">
                  This item is currently {item.availability === 'swapped' ? 'swapped' : 'not available'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Delete Item"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{item.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Swap Modal */}
        <SwapModal
          isOpen={swapModal}
          onClose={() => setSwapModal(false)}
          item={item}
          userItems={userItems}
        />
      </div>
    </div>
  );
};

export default ItemDetails;
