const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import middleware
const { auth: authMiddleware } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Import controllers
const {
  getPendingItems,
  getAllItems,
  approveItem,
  rejectItem,
  getAdminStats,
  bulkApproveItems,
  bulkRejectItems
} = require('../controllers/adminController');

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  deleteUser,
  getUserStats,
  resetUserPassword
} = require('../controllers/userManagementController');

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(isAdmin);

// ===================
// ADMIN DASHBOARD ROUTES
// ===================

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/stats', getAdminStats);

// ===================
// ITEM MANAGEMENT ROUTES
// ===================

// @route   GET /api/admin/items
// @desc    Get all items with filtering and pagination
// @access  Private (Admin only)
router.get('/items', getAllItems);

// @route   GET /api/admin/items/pending
// @desc    Get pending items for approval
// @access  Private (Admin only)
router.get('/items/pending', getPendingItems);

// @route   PATCH /api/admin/items/:id/approve
// @desc    Approve a specific item
// @access  Private (Admin only)
router.patch('/items/:id/approve', [
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], approveItem);

// @route   PATCH /api/admin/items/:id/reject
// @desc    Reject a specific item
// @access  Private (Admin only)
router.patch('/items/:id/reject', [
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], rejectItem);

// @route   PATCH /api/admin/items/bulk-approve
// @desc    Bulk approve multiple items
// @access  Private (Admin only)
router.patch('/items/bulk-approve', [
  body('itemIds')
    .isArray({ min: 1 })
    .withMessage('Item IDs must be a non-empty array'),
  body('itemIds.*')
    .isMongoId()
    .withMessage('Each item ID must be a valid MongoDB ObjectId'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], bulkApproveItems);

// @route   PATCH /api/admin/items/bulk-reject
// @desc    Bulk reject multiple items
// @access  Private (Admin only)
router.patch('/items/bulk-reject', [
  body('itemIds')
    .isArray({ min: 1 })
    .withMessage('Item IDs must be a non-empty array'),
  body('itemIds.*')
    .isMongoId()
    .withMessage('Each item ID must be a valid MongoDB ObjectId'),
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], bulkRejectItems);

// ===================
// USER MANAGEMENT ROUTES
// ===================

// @route   GET /api/admin/users/stats
// @desc    Get user management statistics
// @access  Private (Admin only)
router.get('/users/stats', getUserStats);

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get detailed user information
// @access  Private (Admin only)
router.get('/users/:id', getUserById);

// @route   PATCH /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.patch('/users/:id/role', [
  body('role')
    .isIn(['user', 'admin', 'manager'])
    .withMessage('Role must be one of: user, admin, manager'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], updateUserRole);

// @route   PATCH /api/admin/users/:id/suspend
// @desc    Suspend or unsuspend a user
// @access  Private (Admin only)
router.patch('/users/:id/suspend', [
  body('suspended')
    .isBoolean()
    .withMessage('Suspended must be a boolean value'),
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], suspendUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (soft delete)
// @access  Private (Admin only)
router.delete('/users/:id', [
  body('reason')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
], deleteUser);

// @route   PATCH /api/admin/users/:id/reset-password
// @desc    Reset user password
// @access  Private (Admin only)
router.patch('/users/:id/reset-password', [
  body('temporaryPassword')
    .optional()
    .isLength({ min: 8, max: 20 })
    .withMessage('Temporary password must be between 8 and 20 characters')
], resetUserPassword);

module.exports = router;
