const { validationResult } = require('express-validator');
const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Create new swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { itemId, mode, message, offeredItemId, pointsOffered } = req.body;

    // Get the item being requested
    const item = await Item.findById(itemId).populate('uploader');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if item is available
    if (item.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Item is not available for swap'
      });
    }

    // Prevent self-requests
    if (item.uploader._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request swap for your own item'
      });
    }

    // Check if user already has a pending request for this item
    const existingRequest = await SwapRequest.findOne({
      item: itemId,
      requestedBy: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this item'
      });
    }

    // Validate mode-specific requirements
    if (mode === 'swap') {
      if (!offeredItemId) {
        return res.status(400).json({
          success: false,
          message: 'Offered item is required for swap mode'
        });
      }

      // Check if offered item exists and belongs to requester
      const offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem) {
        return res.status(404).json({
          success: false,
          message: 'Offered item not found'
        });
      }

      if (offeredItem.uploader.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only offer items you own'
        });
      }

      if (offeredItem.availability !== 'available') {
        return res.status(400).json({
          success: false,
          message: 'Offered item is not available'
        });
      }
    } else if (mode === 'points') {
      if (!pointsOffered || pointsOffered <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Points offered must be a positive number'
        });
      }

      // Check if user has enough points
      if (req.user.points < pointsOffered) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient points'
        });
      }
    }

    // Create swap request
    const swapRequest = await SwapRequest.create({
      item: itemId,
      requestedBy: req.user._id,
      itemOwner: item.uploader._id,
      mode,
      message,
      offeredItem: mode === 'swap' ? offeredItemId : undefined,
      pointsOffered: mode === 'points' ? pointsOffered : undefined
    });

    // Populate the response
    await swapRequest.populate([
      { path: 'item', select: 'title images category' },
      { path: 'requestedBy', select: 'name avatar points' },
      { path: 'itemOwner', select: 'name avatar points' },
      { path: 'offeredItem', select: 'title images category' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: swapRequest
    });
  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's swap requests (both sent and received)
// @route   GET /api/swaps/user
// @access  Private
const getUserSwapRequests = async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    // Build query based on type
    let query = {};
    if (type === 'sent') {
      query.requestedBy = req.user._id;
    } else if (type === 'received') {
      query.itemOwner = req.user._id;
    } else {
      query.$or = [
        { requestedBy: req.user._id },
        { itemOwner: req.user._id }
      ];
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const swapRequests = await SwapRequest.find(query)
      .populate([
        { path: 'item', select: 'title images category size condition' },
        { path: 'requestedBy', select: 'name avatar points' },
        { path: 'itemOwner', select: 'name avatar points' },
        { path: 'offeredItem', select: 'title images category size condition' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(query);

    res.json({
      success: true,
      data: swapRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching swap requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Accept swap request
// @route   PATCH /api/swaps/:id/accept
// @access  Private
const acceptSwapRequest = async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate([
        { path: 'item', select: 'title uploader' },
        { path: 'requestedBy', select: 'name points' },
        { path: 'itemOwner', select: 'name points' }
      ]);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user can respond
    if (!swapRequest.canRespond(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    // Update swap request
    swapRequest.status = 'accepted';
    swapRequest.response = {
      message: responseMessage || 'Swap request accepted',
      respondedAt: new Date()
    };

    await swapRequest.save();

    res.json({
      success: true,
      message: 'Swap request accepted successfully',
      data: swapRequest
    });
  } catch (error) {
    console.error('Error accepting swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Decline swap request
// @route   PATCH /api/swaps/:id/decline
// @access  Private
const declineSwapRequest = async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate([
        { path: 'item', select: 'title uploader' },
        { path: 'requestedBy', select: 'name points' },
        { path: 'itemOwner', select: 'name points' }
      ]);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user can respond
    if (!swapRequest.canRespond(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to decline this request'
      });
    }

    // Update swap request
    swapRequest.status = 'declined';
    swapRequest.response = {
      message: responseMessage || 'Swap request declined',
      respondedAt: new Date()
    };

    await swapRequest.save();

    res.json({
      success: true,
      message: 'Swap request declined successfully',
      data: swapRequest
    });
  } catch (error) {
    console.error('Error declining swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Complete swap request
// @route   PATCH /api/swaps/:id/complete
// @access  Private
const completeSwapRequest = async (req, res) => {
  try {
    const { completionNotes } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate([
        { path: 'item' },
        { path: 'requestedBy' },
        { path: 'itemOwner' },
        { path: 'offeredItem' }
      ]);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user can complete
    if (!swapRequest.canComplete(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this request'
      });
    }

    // Start transaction for points mode
    if (swapRequest.mode === 'points') {
      // Transfer points from requester to item owner
      const pointsToTransfer = swapRequest.pointsOffered;
      
      // Update user points
      await User.findByIdAndUpdate(
        swapRequest.requestedBy._id,
        { $inc: { points: -pointsToTransfer } }
      );

      await User.findByIdAndUpdate(
        swapRequest.itemOwner._id,
        { $inc: { points: pointsToTransfer } }
      );

      // Record transaction
      swapRequest.transaction = {
        pointsTransferred: pointsToTransfer,
        completedAt: new Date(),
        completionNotes: completionNotes || 'Points transaction completed'
      };
    } else {
      // For swap mode, just record completion
      swapRequest.transaction = {
        pointsTransferred: 0,
        completedAt: new Date(),
        completionNotes: completionNotes || 'Item swap completed'
      };
    }

    // Update swap request status
    swapRequest.status = 'completed';
    await swapRequest.save();

    // Update item availability
    const item = await Item.findById(swapRequest.item._id);
    if (item) {
      item.availability = 'swapped';
      item.swapCount = (item.swapCount || 0) + 1;
      await item.save();
    }

    // If swap mode, also update offered item
    if (swapRequest.mode === 'swap' && swapRequest.offeredItem) {
      const offeredItem = await Item.findById(swapRequest.offeredItem._id);
      if (offeredItem) {
        offeredItem.availability = 'swapped';
        offeredItem.swapCount = (offeredItem.swapCount || 0) + 1;
        await offeredItem.save();
      }
    }

    res.json({
      success: true,
      message: 'Swap completed successfully',
      data: swapRequest
    });
  } catch (error) {
    console.error('Error completing swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel swap request
// @route   PATCH /api/swaps/:id/cancel
// @access  Private
const cancelSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user can cancel
    if (!swapRequest.canCancel(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    // Update swap request
    swapRequest.status = 'cancelled';
    swapRequest.isActive = false;
    await swapRequest.save();

    res.json({
      success: true,
      message: 'Swap request cancelled successfully',
      data: swapRequest
    });
  } catch (error) {
    console.error('Error cancelling swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get swap request details
// @route   GET /api/swaps/:id
// @access  Private
const getSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate([
        { path: 'item', select: 'title images category size condition brand location' },
        { path: 'requestedBy', select: 'name avatar points' },
        { path: 'itemOwner', select: 'name avatar points' },
        { path: 'offeredItem', select: 'title images category size condition brand' }
      ]);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in this swap
    const isInvolved = swapRequest.requestedBy._id.toString() === req.user._id.toString() ||
                      swapRequest.itemOwner._id.toString() === req.user._id.toString();

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this swap request'
      });
    }

    res.json({
      success: true,
      data: swapRequest
    });
  } catch (error) {
    console.error('Error fetching swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get swap statistics for dashboard
// @route   GET /api/swaps/stats
// @access  Private
const getSwapStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get swap counts
    const sentRequests = await SwapRequest.countDocuments({ requestedBy: userId });
    const receivedRequests = await SwapRequest.countDocuments({ itemOwner: userId });
    const completedSwaps = await SwapRequest.countDocuments({
      $or: [{ requestedBy: userId }, { itemOwner: userId }],
      status: 'completed'
    });
    const pendingRequests = await SwapRequest.countDocuments({
      $or: [{ requestedBy: userId }, { itemOwner: userId }],
      status: 'pending'
    });

    // Get points transactions
    const pointsEarned = await SwapRequest.aggregate([
      { $match: { itemOwner: userId, status: 'completed', mode: 'points' } },
      { $group: { _id: null, total: { $sum: '$pointsOffered' } } }
    ]);

    const pointsSpent = await SwapRequest.aggregate([
      { $match: { requestedBy: userId, status: 'completed', mode: 'points' } },
      { $group: { _id: null, total: { $sum: '$pointsOffered' } } }
    ]);

    // Get recent swap activity
    const recentSwaps = await SwapRequest.find({
      $or: [{ requestedBy: userId }, { itemOwner: userId }],
      status: { $in: ['completed', 'accepted', 'pending'] }
    })
    .populate([
      { path: 'item', select: 'title images' },
      { path: 'requestedBy', select: 'name' },
      { path: 'itemOwner', select: 'name' }
    ])
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        sentRequests,
        receivedRequests,
        completedSwaps,
        pendingRequests,
        pointsEarned: pointsEarned[0]?.total || 0,
        pointsSpent: pointsSpent[0]?.total || 0,
        recentSwaps
      }
    });
  } catch (error) {
    console.error('Error fetching swap stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createSwapRequest,
  getUserSwapRequests,
  acceptSwapRequest,
  declineSwapRequest,
  completeSwapRequest,
  cancelSwapRequest,
  getSwapRequest,
  getSwapStats
};
