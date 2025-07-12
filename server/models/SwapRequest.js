const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item is required']
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  itemOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Item owner is required']
  },
  mode: {
    type: String,
    enum: ['swap', 'points'],
    required: [true, 'Swap mode is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  // For swap mode - item offered in exchange
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  // For points mode - points offered
  pointsOffered: {
    type: Number,
    min: [0, 'Points offered cannot be negative']
  },
  // Response from item owner
  response: {
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Response message cannot exceed 500 characters']
    },
    respondedAt: Date
  },
  // Transaction details
  transaction: {
    pointsTransferred: {
      type: Number,
      default: 0
    },
    completedAt: Date,
    completionNotes: String
  },
  // Meeting/exchange details
  meetingDetails: {
    proposedDate: Date,
    location: String,
    notes: String
  },
  // System tracking
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
swapRequestSchema.index({ item: 1, requestedBy: 1 });
swapRequestSchema.index({ itemOwner: 1, status: 1 });
swapRequestSchema.index({ requestedBy: 1, status: 1 });
swapRequestSchema.index({ status: 1, expiresAt: 1 });
swapRequestSchema.index({ mode: 1 });

// Virtual for checking if request is expired
swapRequestSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Method to check if user can respond to this request
swapRequestSchema.methods.canRespond = function(userId) {
  return this.itemOwner.toString() === userId.toString() && 
         this.status === 'pending' && 
         !this.isExpired;
};

// Method to check if user can cancel this request
swapRequestSchema.methods.canCancel = function(userId) {
  return this.requestedBy.toString() === userId.toString() && 
         ['pending', 'accepted'].includes(this.status);
};

// Method to check if request can be completed
swapRequestSchema.methods.canComplete = function(userId) {
  return (this.itemOwner.toString() === userId.toString() || 
          this.requestedBy.toString() === userId.toString()) && 
         this.status === 'accepted';
};

// Pre-save middleware to validate swap mode requirements
swapRequestSchema.pre('save', function(next) {
  if (this.mode === 'swap' && !this.offeredItem) {
    next(new Error('Offered item is required for swap mode'));
  } else if (this.mode === 'points' && (!this.pointsOffered || this.pointsOffered <= 0)) {
    next(new Error('Points offered is required and must be positive for points mode'));
  } else {
    next();
  }
});

// Pre-save middleware to prevent self-requests
swapRequestSchema.pre('save', function(next) {
  if (this.requestedBy.toString() === this.itemOwner.toString()) {
    next(new Error('Cannot request swap for your own item'));
  } else {
    next();
  }
});

// Pre-save middleware to auto-expire old requests
swapRequestSchema.pre('save', function(next) {
  if (this.status === 'pending' && this.isExpired) {
    this.status = 'declined';
    this.response = {
      message: 'Request automatically declined due to expiration',
      respondedAt: new Date()
    };
  }
  next();
});

// Static method to cleanup expired requests
swapRequestSchema.statics.cleanupExpired = async function() {
  const expiredRequests = await this.find({
    status: 'pending',
    expiresAt: { $lt: new Date() }
  });

  for (const request of expiredRequests) {
    request.status = 'declined';
    request.response = {
      message: 'Request automatically declined due to expiration',
      respondedAt: new Date()
    };
    await request.save();
  }

  return expiredRequests.length;
};

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
