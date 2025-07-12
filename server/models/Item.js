const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories', 'activewear', 'formal', 'casual', 'other'],
    required: [true, 'Please select a category']
  },
  type: {
    type: String,
    trim: true,
    maxlength: [50, 'Type cannot be more than 50 characters']
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '29', '30', '32', '34', '36', '38', '40', '42', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14', '15', 'One Size'],
    required: [true, 'Please select a size']
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: [true, 'Please select item condition'],
    default: 'good'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot be more than 30 characters']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'swapped', 'hidden'],
    default: 'available'
  },
  approved: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  // Additional fields for enhanced functionality
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand cannot be more than 50 characters']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  swapCount: {
    type: Number,
    default: 0,
    min: [0, 'Swap count cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  // For swap preferences
  swapPreferences: {
    preferredCategories: [{
      type: String,
      enum: ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories', 'activewear', 'formal', 'casual', 'other']
    }],
    preferredSizes: [{
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '29', '30', '32', '34', '36', '38', '40', '42', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14', '15', 'One Size']
    }],
    notes: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
itemSchema.index({ category: 1, size: 1, condition: 1 });
itemSchema.index({ uploader: 1, availability: 1 });
itemSchema.index({ approved: 1, availability: 1, isActive: 1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ 'location.city': 1, 'location.state': 1 });

// Virtual for like count
itemSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to check if user has liked the item
itemSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.toString() === userId.toString());
};

// Method to add/remove like
itemSchema.methods.toggleLike = function(userId) {
  const userLikeIndex = this.likes.findIndex(like => like.toString() === userId.toString());
  
  if (userLikeIndex > -1) {
    this.likes.splice(userLikeIndex, 1);
    return false; // unliked
  } else {
    this.likes.push(userId);
    return true; // liked
  }
};

// Middleware to set primary image if none exists
itemSchema.pre('save', function(next) {
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  next();
});

// Middleware to auto-approve items for admin users
itemSchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const uploader = await User.findById(this.uploader);
    if (uploader && uploader.role === 'admin') {
      this.approved = true;
    }
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
