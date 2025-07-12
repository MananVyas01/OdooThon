const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Get all items (approved and available)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      category,
      size,
      condition,
      tags,
      location,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {
      approved: true,
      availability: 'available',
      isActive: true
    };

    // Add filters
    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (tags) query.tags = { $in: tags.split(',') };
    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const items = await Item.find(query)
      .populate('uploader', 'name avatar')
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('uploader', 'name avatar points')
      .populate('likes', 'name avatar');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment views if not the owner
    if (!req.user || item.uploader._id.toString() !== req.user._id.toString()) {
      await Item.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images,
      brand,
      originalPrice,
      location,
      swapPreferences
    } = req.body;

    // Process tags
    const processedTags = typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : Array.isArray(tags) ? tags : [];

    // Create item
    const item = await Item.create({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: processedTags,
      images: images || [],
      brand,
      originalPrice,
      location,
      swapPreferences,
      uploader: req.user._id
    });

    // Populate uploader info
    await item.populate('uploader', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      images,
      brand,
      originalPrice,
      location,
      swapPreferences
    } = req.body;

    // Process tags
    const processedTags = typeof tags === 'string' 
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : Array.isArray(tags) ? tags : [];

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        type,
        size,
        condition,
        tags: processedTags,
        images: images || item.images,
        brand,
        originalPrice,
        location,
        swapPreferences
      },
      { new: true, runValidators: true }
    ).populate('uploader', 'name avatar');

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update item availability status
// @route   PATCH /api/items/:id/status
// @access  Private
const updateItemStatus = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!['available', 'swapped', 'hidden'].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    item.availability = availability;
    await item.save();

    res.json({
      success: true,
      message: 'Item status updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle item like
// @route   POST /api/items/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const isLiked = item.toggleLike(req.user._id);
    await item.save();

    res.json({
      success: true,
      message: isLiked ? 'Item liked' : 'Item unliked',
      data: {
        isLiked,
        likeCount: item.likeCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user's items
// @route   GET /api/items/my-items
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const {
      availability,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { uploader: req.user._id };
    if (availability) query.availability = availability;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const items = await Item.find(query)
      .populate('uploader', 'name avatar')
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/items/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's items stats
    const totalItems = await Item.countDocuments({ uploader: userId });
    const availableItems = await Item.countDocuments({ uploader: userId, availability: 'available' });
    const swappedItems = await Item.countDocuments({ uploader: userId, availability: 'swapped' });
    const hiddenItems = await Item.countDocuments({ uploader: userId, availability: 'hidden' });

    // Get total views and likes for user's items
    const userItems = await Item.find({ uploader: userId });
    const totalViews = userItems.reduce((sum, item) => sum + item.views, 0);
    const totalLikes = userItems.reduce((sum, item) => sum + item.likes.length, 0);

    // Get category distribution
    const categoryStats = await Item.aggregate([
      { $match: { uploader: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentItems = await Item.countDocuments({
      uploader: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalItems,
        availableItems,
        swappedItems,
        hiddenItems,
        totalViews,
        totalLikes,
        categoryStats,
        recentItems,
        userPoints: req.user.points
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  toggleLike,
  getMyItems,
  getDashboardStats
};
