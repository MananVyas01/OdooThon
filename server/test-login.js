const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testLogin = async () => {
  try {
    console.log('Testing login...');
    
    // Test parameters
    const email = 'alice@example.com';
    const password = 'password123';
    
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', user.email);
    console.log('User isActive:', user.isActive);
    console.log('User password hash:', user.password);
    
    // Check if user is active
    if (!user.isActive) {
      console.log('User is not active');
      return;
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return;
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    console.log('Token generated:', !!token);
    console.log('Login successful!');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit();
};

testLogin();
