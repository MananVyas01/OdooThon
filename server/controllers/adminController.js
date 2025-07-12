const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Get all pending items for admin approval
// @route   GET /api/admin/items/pending
// @access  Private (Admin only)
const getPendingItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query for unapproved items
    const query = {
      approved: false,
      isActive: true
    };

    // Add filters
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const items = await Item.find(query)
      .populate('uploader', 'name email avatar points')
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
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all items (approved and unapproved) for admin
// @route   GET /api/admin/items
// @access  Private (Admin only)
const getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      approved,
      category,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Add filters
    if (approved !== undefined) query.approved = approved === 'true';
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const items = await Item.find(query)
      .populate('uploader', 'name email avatar points')
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
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve an item
// @route   PATCH /api/admin/items/:id/approve
// @access  Private (Admin only)
const approveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const item = await Item.findById(id).populate('uploader', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.approved) {
      return res.status(400).json({
        success: false,
        message: 'Item is already approved'
      });
    }

    // Update item
    item.approved = true;
    item.approvedBy = req.user._id;
    item.approvedAt = new Date();
    if (notes) item.moderationNotes = notes;

    await item.save();

    // Award points to uploader for approved item
    if (item.uploader) {
      await User.findByIdAndUpdate(
        item.uploader._id,
        { $inc: { points: 10 } } // Award 10 points for approved item
      );
    }

    res.json({
      success: true,
      message: 'Item approved successfully',
      data: item
    });
  } catch (error) {
    console.error('Error approving item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reject an item
// @route   PATCH /api/admin/items/:id/reject
// @access  Private (Admin only)
const rejectItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;

    const item = await Item.findById(id).populate('uploader', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.approved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an approved item'
      });
    }

    // Update item with rejection details
    item.approved = false;
    item.isActive = false; // Hide from listings
    item.rejectedBy = req.user._id;
    item.rejectedAt = new Date();
    item.rejectionReason = reason || 'Item does not meet platform guidelines';
    if (notes) item.moderationNotes = notes;

    await item.save();

    res.json({
      success: true,
      message: 'Item rejected successfully',
      data: item
    });
  } catch (error) {
    console.error('Error rejecting item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalItems = await Item.countDocuments({ isActive: true });
    const pendingItems = await Item.countDocuments({ approved: false, isActive: true });
    const approvedItems = await Item.countDocuments({ approved: true, isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
    const managerUsers = await User.countDocuments({ role: 'manager', isActive: true });
    const regularUsers = await User.countDocuments({ role: 'user', isActive: true });

    // Get category distribution
    const categoryStats = await Item.aggregate([
      { $match: { approved: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent pending items
    const recentPendingItems = await Item.find({ 
      approved: false, 
      isActive: true 
    })
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user registration stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    // Get item submission stats (last 30 days)
    const recentItems = await Item.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalItems,
          pendingItems,
          approvedItems,
          approvalRate: totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0
        },
        userRoles: {
          admin: adminUsers,
          manager: managerUsers,
          user: regularUsers
        },
        categoryStats,
        recentActivity: {
          newUsersLast30Days: recentUsers,
          newItemsLast30Days: recentItems
        },
        recentPendingItems
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk approve items
// @route   PATCH /api/admin/items/bulk-approve
// @access  Private (Admin only)
const bulkApproveItems = async (req, res) => {
  try {
    const { itemIds, notes } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of item IDs'
      });
    }

    // Update items
    const updateData = {
      approved: true,
      approvedBy: req.user._id,
      approvedAt: new Date()
    };
    if (notes) updateData.moderationNotes = notes;

    const result = await Item.updateMany(
      { 
        _id: { $in: itemIds }, 
        approved: false,
        isActive: true
      },
      updateData
    );

    // Award points to uploaders
    const items = await Item.find({ _id: { $in: itemIds } }).select('uploader');
    const uploaderIds = [...new Set(items.map(item => item.uploader))];
    
    await User.updateMany(
      { _id: { $in: uploaderIds } },
      { $inc: { points: 10 } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} items approved successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk approving items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk reject items
// @route   PATCH /api/admin/items/bulk-reject
// @access  Private (Admin only)
const bulkRejectItems = async (req, res) => {
  try {
    const { itemIds, reason, notes } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of item IDs'
      });
    }

    // Update items
    const updateData = {
      approved: false,
      isActive: false,
      rejectedBy: req.user._id,
      rejectedAt: new Date(),
      rejectionReason: reason || 'Item does not meet platform guidelines'
    };
    if (notes) updateData.moderationNotes = notes;

    const result = await Item.updateMany(
      { 
        _id: { $in: itemIds }, 
        approved: false,
        isActive: true
      },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} items rejected successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk rejecting items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getPendingItems,
  getAllItems,
  approveItem,
  rejectItem,
  getAdminStats,
  bulkApproveItems,
  bulkRejectItems
};
