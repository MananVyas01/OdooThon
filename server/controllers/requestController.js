const { validationResult } = require('express-validator');
const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const requestData = {
      ...req.body,
      createdBy: req.user.id
    };

    const request = await Request.create(requestData);
    await request.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    // Role-based filtering
    if (req.user.role === 'user') {
      query.createdBy = req.user.id;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const requests = await Request.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.createdBy', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user can view this request
    if (req.user.role === 'user' && request.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user can update this request
    const canUpdate = 
      request.createdBy.toString() === req.user.id ||
      req.user.role === 'admin' ||
      req.user.role === 'manager';

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Request updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user can delete this request
    const canDelete = 
      request.createdBy.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!canDelete) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to request
// @route   POST /api/requests/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.comments.push({
      text,
      createdBy: req.user.id
    });

    await request.save();
    await request.populate('comments.createdBy', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/requests/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const query = req.user.role === 'user' ? { createdBy: req.user.id } : {};

    const stats = await Request.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Request.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Request.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0 },
      categoryStats,
      priorityStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  addComment,
  getDashboardStats
};
