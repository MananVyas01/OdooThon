const { validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

// @desc    Get all users with advanced filtering and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      search,
      isActive,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Add filters
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Execute query
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const itemCount = await Item.countDocuments({ uploader: user._id, isActive: true });
        const approvedItemCount = await Item.countDocuments({ 
          uploader: user._id, 
          approved: true, 
          isActive: true 
        });
        const swapCount = await SwapRequest.countDocuments({
          $or: [
            { requester: user._id },
            { 'itemOwner': user._id }
          ]
        });

        return {
          ...user.toObject(),
          stats: {
            itemCount,
            approvedItemCount,
            swapCount
          }
        };
      })
    );

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user details by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's items
    const items = await Item.find({ uploader: id, isActive: true })
      .select('title category images approved createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's swap requests
    const swapRequests = await SwapRequest.find({
      $or: [
        { requester: id },
        { 'itemOwner': id }
      ]
    })
      .populate('requestedItem', 'title category images')
      .populate('offeredItem', 'title category images')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user stats
    const stats = {
      totalItems: await Item.countDocuments({ uploader: id, isActive: true }),
      approvedItems: await Item.countDocuments({ uploader: id, approved: true, isActive: true }),
      pendingItems: await Item.countDocuments({ uploader: id, approved: false, isActive: true }),
      totalSwaps: await SwapRequest.countDocuments({
        $or: [
          { requester: id },
          { 'itemOwner': id }
        ]
      }),
      completedSwaps: await SwapRequest.countDocuments({
        $or: [
          { requester: id },
          { 'itemOwner': id }
        ],
        status: 'completed'
      })
    };

    res.json({
      success: true,
      data: {
        user: user.toObject(),
        stats,
        recentItems: items,
        recentSwapRequests: swapRequests
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, notes } = req.body;

    // Validate role
    const validRoles = ['user', 'admin', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: user, admin, manager'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-demotion from admin
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own admin role'
      });
    }

    const oldRole = user.role;
    user.role = role;
    user.roleChangedBy = req.user._id;
    user.roleChangedAt = new Date();
    if (notes) user.roleChangeNotes = notes;

    await user.save();

    res.json({
      success: true,
      message: `User role updated from ${oldRole} to ${role}`,
      data: {
        user: user.toObject(),
        oldRole,
        newRole: role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Suspend/Unsuspend user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Private (Admin only)
const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspended, reason, notes } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-suspension
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend yourself'
      });
    }

    // Prevent suspending other admins (unless you're a manager)
    if (user.role === 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can suspend admin users'
      });
    }

    user.suspended = suspended;
    user.suspendedBy = req.user._id;
    user.suspendedAt = suspended ? new Date() : null;
    if (reason) user.suspensionReason = reason;
    if (notes) user.suspensionNotes = notes;

    // If suspending, also deactivate user's items
    if (suspended) {
      await Item.updateMany(
        { uploader: id },
        { isActive: false }
      );
    }

    await user.save();

    res.json({
      success: true,
      message: suspended ? 'User suspended successfully' : 'User unsuspended successfully',
      data: user.toObject()
    });
  } catch (error) {
    console.error('Error suspending/unsuspending user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete yourself'
      });
    }

    // Prevent deleting other admins (unless you're a manager)
    if (user.role === 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Only managers can delete admin users'
      });
    }

    // Soft delete user
    user.isActive = false;
    user.deletedBy = req.user._id;
    user.deletedAt = new Date();
    if (reason) user.deletionReason = reason;
    if (notes) user.deletionNotes = notes;

    // Deactivate user's items
    await Item.updateMany(
      { uploader: id },
      { isActive: false }
    );

    // Cancel pending swap requests
    await SwapRequest.updateMany(
      {
        $or: [
          { requester: id },
          { 'itemOwner': id }
        ],
        status: 'pending'
      },
      { status: 'cancelled' }
    );

    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user.toObject()
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user management statistics
// @route   GET /api/admin/users/stats
// @access  Private (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const suspendedUsers = await User.countDocuments({ suspended: true });
    const deletedUsers = await User.countDocuments({ isActive: false });

    // Role distribution
    const roleStats = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Registration trends (last 12 months)
    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Most active users (by items posted)
    const mostActiveUsers = await User.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'uploader',
          as: 'items'
        }
      },
      {
        $addFields: {
          itemCount: { $size: '$items' }
        }
      },
      { $sort: { itemCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          itemCount: 1,
          points: 1,
          createdAt: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          deletedUsers
        },
        roleStats,
        registrationTrends,
        mostActiveUsers
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset user password
// @route   PATCH /api/admin/users/:id/reset-password
// @access  Private (Admin only)
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { temporaryPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate temporary password if not provided
    const tempPassword = temporaryPassword || Math.random().toString(36).slice(-8);

    user.password = tempPassword;
    user.passwordResetBy = req.user._id;
    user.passwordResetAt = new Date();
    user.mustChangePassword = true; // Force password change on next login

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        userId: user._id,
        temporaryPassword: tempPassword,
        message: 'User must change password on next login'
      }
    });
  } catch (error) {
    console.error('Error resetting user password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  deleteUser,
  getUserStats,
  resetUserPassword
};
