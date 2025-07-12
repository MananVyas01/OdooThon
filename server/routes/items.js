const express = require('express');
const { body } = require('express-validator');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  updateItemStatus,
  toggleLike,
  getMyItems,
  getDashboardStats
} = require('../controllers/itemController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateItem = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories', 'activewear', 'formal', 'casual', 'other'])
    .withMessage('Invalid category'),
  body('size')
    .notEmpty()
    .withMessage('Size is required')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', 'One Size'])
    .withMessage('Invalid size'),
  body('condition')
    .notEmpty()
    .withMessage('Condition is required')
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('type')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Type cannot exceed 50 characters'),
  body('brand')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Brand cannot exceed 50 characters'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const tags = value.split(',').map(tag => tag.trim());
        if (tags.some(tag => tag.length > 30)) {
          throw new Error('Each tag cannot exceed 30 characters');
        }
      } else if (Array.isArray(value)) {
        if (value.some(tag => typeof tag !== 'string' || tag.length > 30)) {
          throw new Error('Each tag must be a string and cannot exceed 30 characters');
        }
      }
      return true;
    }),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Invalid image URL'),
  body('location.city')
    .optional()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
  body('location.state')
    .optional()
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),
  body('location.country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),
  body('location.zipCode')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Zip code cannot exceed 20 characters')
];

// Public routes
router.get('/', getItems);
router.get('/item/:id', getItem);

// Protected routes
router.use(auth); // All routes below require authentication

// User routes
router.get('/my-items', getMyItems);
router.get('/dashboard/stats', getDashboardStats);
router.post('/', validateItem, createItem);
router.put('/:id', validateItem, updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/status', updateItemStatus);
router.post('/:id/like', toggleLike);

module.exports = router;
