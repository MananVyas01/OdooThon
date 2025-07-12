import React, { useState } from 'react';
import { swapAPI } from '../utils/api';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Button from './Button';
import TextArea from './TextArea';
import Select from './Select';

const SwapModal = ({ isOpen, onClose, item, userItems = [] }) => {
  const [swapData, setSwapData] = useState({
    mode: 'points',
    message: '',
    offeredItemId: '',
    pointsOffered: item?.points || 10
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    try {
      setSubmitting(true);

      const requestData = {
        itemId: item._id,
        mode: swapData.mode,
        message: swapData.message,
        ...(swapData.mode === 'swap' && { offeredItemId: swapData.offeredItemId }),
        ...(swapData.mode === 'points' && { pointsOffered: parseInt(swapData.pointsOffered) })
      };

      await swapAPI.createSwapRequest(requestData);
      toast.success('Swap request sent successfully!');
      onClose();
      
      // Reset form
      setSwapData({
        mode: 'points',
        message: '',
        offeredItemId: '',
        pointsOffered: item?.points || 10
      });
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSwapData(prev => ({ ...prev, [field]: value }));
  };

  // Filter available items for swap
  const availableItems = userItems.filter(userItem => 
    userItem.availability === 'available' && userItem._id !== item?._id
  );

  const modeOptions = [
    { value: 'points', label: `Redeem with Points (${swapData.pointsOffered} points)` },
    { value: 'swap', label: 'Swap with My Item' }
  ];

  const itemOptions = [
    { value: '', label: 'Select item to offer' },
    ...availableItems.map(userItem => ({
      value: userItem._id,
      label: `${userItem.title} (${userItem.category}, ${userItem.size})`
    }))
  ];

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Swap">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Item Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Item Details</h3>
          <div className="flex items-center space-x-4">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0].url}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">👗</span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600">{item.category} • {item.size}</p>
              <p className="text-sm text-gray-600">Listed by: {item.uploader?.name}</p>
            </div>
          </div>
        </div>

        {/* Swap Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Swap Method
          </label>
          <Select
            value={swapData.mode}
            onChange={(value) => handleInputChange('mode', value)}
            options={modeOptions}
          />
        </div>

        {/* Points Mode Options */}
        {swapData.mode === 'points' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points to Offer
            </label>
            <input
              type="number"
              min="1"
              max={user?.points || 0}
              value={swapData.pointsOffered}
              onChange={(e) => handleInputChange('pointsOffered', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Your current points: {user?.points || 0}
            </p>
            {(user?.points || 0) < swapData.pointsOffered && (
              <p className="text-sm text-red-600 mt-1">
                Insufficient points! You need {swapData.pointsOffered - (user?.points || 0)} more points.
              </p>
            )}
          </div>
        )}

        {/* Swap Mode Options */}
        {swapData.mode === 'swap' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Item to Offer
            </label>
            <Select
              value={swapData.offeredItemId}
              onChange={(value) => handleInputChange('offeredItemId', value)}
              options={itemOptions}
              required
            />
            {availableItems.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                You don't have any available items to offer for swap.
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <TextArea
            value={swapData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Add a personal message to the item owner..."
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              submitting ||
              (swapData.mode === 'points' && (user?.points || 0) < swapData.pointsOffered) ||
              (swapData.mode === 'swap' && !swapData.offeredItemId)
            }
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SwapModal;
