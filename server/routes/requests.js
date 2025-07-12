const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  addComment,
  getDashboardStats
} = require('../controllers/requestController');

const router = express.Router();

// Validation rules
const createRequestValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').isIn(['technical', 'administrative', 'maintenance', 'hr', 'finance', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
];

const updateRequestValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('category').optional().isIn(['technical', 'administrative', 'maintenance', 'hr', 'finance', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('status').optional().isIn(['pending', 'in-progress', 'resolved', 'rejected']).withMessage('Invalid status'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  body('dueDate').optional().isISO8601().withMessage('Invalid due date format')
];

// Routes
router.get('/dashboard/stats', auth, getDashboardStats);
router.post('/', auth, createRequestValidation, createRequest);
router.get('/', auth, getRequests);
router.get('/:id', auth, getRequest);
router.put('/:id', auth, updateRequestValidation, updateRequest);
router.delete('/:id', auth, deleteRequest);
router.post('/:id/comments', auth, addComment);

module.exports = router;
