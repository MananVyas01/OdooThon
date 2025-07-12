const express = require('express');
const { body } = require('express-validator');
const {
  createSwapRequest,
  getUserSwapRequests,
  acceptSwapRequest,
  declineSwapRequest,
  completeSwapRequest,
  cancelSwapRequest,
  getSwapRequest,
  getSwapStats
} = require('../controllers/swapController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateSwapRequest = [
  body('itemId')
    .isMongoId()
    .withMessage('Valid item ID is required'),
  body('mode')
    .isIn(['swap', 'points'])
    .withMessage('Mode must be either "swap" or "points"'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  body('offeredItemId')
    .optional()
    .isMongoId()
    .withMessage('Valid offered item ID is required'),
  body('pointsOffered')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Points offered must be a positive integer')
];

const validateResponse = [
  body('responseMessage')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Response message cannot exceed 500 characters')
];

const validateCompletion = [
  body('completionNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Completion notes cannot exceed 500 characters')
];

// All routes require authentication
router.use(auth);

// Swap request routes
router.post('/', validateSwapRequest, createSwapRequest);
router.get('/user', getUserSwapRequests);
router.get('/stats', getSwapStats);
router.get('/:id', getSwapRequest);

// Swap request actions
router.patch('/:id/accept', validateResponse, acceptSwapRequest);
router.patch('/:id/decline', validateResponse, declineSwapRequest);
router.patch('/:id/complete', validateCompletion, completeSwapRequest);
router.patch('/:id/cancel', cancelSwapRequest);

module.exports = router;
