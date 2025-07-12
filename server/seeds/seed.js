const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

const MONGO_URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-db-test';

// Predefined users data
const USERS_DATA = [
  {
    name: 'Admin User',
    email: 'admin@rewear.com',
    password: 'admin123',
    role: 'admin',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234567890/admin-avatar.jpg'
  },
  {
    name: 'Manan Vyas',
    email: 'manan@rewear.com',
    password: 'manan123',
    role: 'manager',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234567890/manan-avatar.jpg'
  },
  {
    name: 'Shrey Patel',
    email: 'shrey@rewear.com',
    password: 'shrey123',
    role: 'user',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234567890/shrey-avatar.jpg'
  },
  {
    name: 'Malhar Shah',
    email: 'malhar@rewear.com',
    password: 'malhar123',
    role: 'user',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234567890/malhar-avatar.jpg'
  },
  {
    name: 'OM Patel',
    email: 'om@rewear.com',
    password: 'om123',
    role: 'user',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234567890/om-avatar.jpg'
  }
];

// Categories and conditions for items
const CATEGORIES = ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories', 'activewear', 'formal', 'casual'];
const CONDITIONS = ['new', 'like-new', 'good', 'fair'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const BRANDS = ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Gap', 'Levi\'s', 'Calvin Klein', 'Tommy Hilfiger', 'Puma', 'Forever 21', 'Urban Outfitters', 'ASOS', 'Mango', 'COS'];

// Generate realistic fashion images using Unsplash
const generateImageUrls = (category, count = 3) => {
  const baseUrl = 'https://images.unsplash.com/';
  const imageMap = {
    'tops': [
      'photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
      'photo-1586790170083-2f9ceadc732d?w=500&h=600&fit=crop',
      'photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop',
      'photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop'
    ],
    'bottoms': [
      'photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop',
      'photo-1506629905607-c0ad21d9b6a8?w=500&h=600&fit=crop',
      'photo-1555689502-c4b22d76c56f?w=500&h=600&fit=crop',
      'photo-1605518216938-7c31b7b14ad0?w=500&h=600&fit=crop'
    ],
    'dresses': [
      'photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
      'photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop',
      'photo-1566479179817-c58a9e3b2b3e?w=500&h=600&fit=crop',
      'photo-1469334031218-e382a71b716b?w=500&h=600&fit=crop'
    ],
    'outerwear': [
      'photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop',
      'photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
      'photo-1516257984-b1b4d707412e?w=500&h=600&fit=crop',
      'photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop'
    ],
    'shoes': [
      'photo-1549298916-b41d501d3772?w=500&h=400&fit=crop',
      'photo-1560769629-975ec94e6a86?w=500&h=400&fit=crop',
      'photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop',
      'photo-1595950653106-6c9ebd614d3a?w=500&h=400&fit=crop'
    ],
    'accessories': [
      'photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop',
      'photo-1508296695146-257a814070b4?w=500&h=400&fit=crop',
      'photo-1591561954555-607968c989ab?w=500&h=400&fit=crop',
      'photo-1618354691373-d851c5c3a990?w=500&h=400&fit=crop'
    ],
    'activewear': [
      'photo-1506629905607-c0ad21d9b6a8?w=500&h=600&fit=crop',
      'photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop',
      'photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop',
      'photo-1615287904012-7b6f8b50f5f3?w=500&h=600&fit=crop'
    ],
    'formal': [
      'photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop',
      'photo-1551418290-a80d06c37b9c?w=500&h=600&fit=crop',
      'photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
      'photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop'
    ],
    'casual': [
      'photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
      'photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop',
      'photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
      'photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop'
    ]
  };

  const categoryImages = imageMap[category] || imageMap['casual'];
  return Array.from({ length: count }, (_, i) => ({
    url: baseUrl + faker.helpers.arrayElement(categoryImages),
    alt: `${category} image ${i + 1}`,
    isPrimary: i === 0
  }));
};

// Generate diverse items data
const generateItemsData = (users) => {
  const items = [];
  
  // Generate fewer items - just 1-2 per category for demo
  const itemsPerCategory = 1;
  
  CATEGORIES.forEach(category => {
    for (let i = 0; i < itemsPerCategory; i++) {
      const condition = faker.helpers.arrayElement(CONDITIONS);
      const size = faker.helpers.arrayElement(SIZES);
      const brand = faker.helpers.arrayElement(BRANDS);
      const uploader = faker.helpers.arrayElement(users);
      
      // Generate category-specific item names and descriptions
      let itemName, description;
      switch (category) {
        case 'tops':
          itemName = `${brand} ${faker.helpers.arrayElement(['Vintage T-Shirt', 'Cotton Blouse', 'Denim Shirt', 'Graphic Tee', 'Button-up Shirt', 'Crop Top', 'Tank Top', 'Polo Shirt'])}`;
          description = `Stylish ${itemName.toLowerCase()} perfect for casual wear. Made from high-quality materials with excellent fit and comfort.`;
          break;
        case 'bottoms':
          itemName = `${brand} ${faker.helpers.arrayElement(['Skinny Jeans', 'Cargo Pants', 'Chinos', 'Shorts', 'Leggings', 'Wide-leg Pants', 'Joggers', 'Trousers'])}`;
          description = `Comfortable ${itemName.toLowerCase()} that combines style and functionality. Perfect for everyday wear or special occasions.`;
          break;
        case 'dresses':
          itemName = `${brand} ${faker.helpers.arrayElement(['Summer Dress', 'Cocktail Dress', 'Maxi Dress', 'Wrap Dress', 'Shift Dress', 'Midi Dress', 'Mini Dress', 'Evening Dress'])}`;
          description = `Elegant ${itemName.toLowerCase()} that makes a statement. Flattering silhouette with beautiful details and premium fabric.`;
          break;
        case 'outerwear':
          itemName = `${brand} ${faker.helpers.arrayElement(['Winter Jacket', 'Blazer', 'Cardigan', 'Hoodie', 'Coat', 'Bomber Jacket', 'Trench Coat', 'Windbreaker'])}`;
          description = `Versatile ${itemName.toLowerCase()} perfect for layering. Keeps you warm and stylish in any weather.`;
          break;
        case 'shoes':
          itemName = `${brand} ${faker.helpers.arrayElement(['Running Shoes', 'Sneakers', 'Dress Shoes', 'Boots', 'Sandals', 'Loafers', 'High Heels', 'Flats'])}`;
          description = `Comfortable ${itemName.toLowerCase()} that complete any outfit. Great quality construction with excellent support.`;
          break;
        case 'accessories':
          itemName = `${brand} ${faker.helpers.arrayElement(['Leather Handbag', 'Watch', 'Sunglasses', 'Scarf', 'Belt', 'Necklace', 'Bracelet', 'Earrings'])}`;
          description = `Stylish ${itemName.toLowerCase()} that adds the perfect finishing touch. High-quality materials and timeless design.`;
          break;
        case 'activewear':
          itemName = `${brand} ${faker.helpers.arrayElement(['Yoga Pants', 'Sports Bra', 'Athletic Shorts', 'Running Jacket', 'Gym Top', 'Leggings', 'Training Shoes', 'Workout Set'])}`;
          description = `Performance ${itemName.toLowerCase()} designed for active lifestyles. Moisture-wicking and comfortable for any workout.`;
          break;
        case 'formal':
          itemName = `${brand} ${faker.helpers.arrayElement(['Business Suit', 'Formal Dress', 'Dress Shirt', 'Tie', 'Formal Jacket', 'Pencil Skirt', 'Dress Pants', 'Blouse'])}`;
          description = `Professional ${itemName.toLowerCase()} perfect for business meetings and formal events. Sophisticated style with perfect fit.`;
          break;
        case 'casual':
          itemName = `${brand} ${faker.helpers.arrayElement(['Casual Jeans', 'Comfort Tee', 'Sweatshirt', 'Casual Dress', 'Sneakers', 'Casual Shirt', 'Sweater', 'Casual Jacket'])}`;
          description = `Relaxed ${itemName.toLowerCase()} ideal for everyday comfort. Soft materials and casual style for any occasion.`;
          break;
        default:
          itemName = `${brand} Fashion Item`;
          description = `Quality fashion item from ${brand}. Perfect addition to any wardrobe.`;
      }
      
      items.push({
        title: itemName,
        description: description + ` This ${itemName.toLowerCase()} is in ${condition} condition and perfect for sustainable fashion lovers. Originally from ${brand}, it's ready for its next adventure!`,
        category,
        size,
        condition,
        brand,
        images: generateImageUrls(category, faker.number.int({ min: 2, max: 4 })),
        tags: faker.helpers.arrayElements([
          'sustainable', 'vintage', 'trendy', 'casual', 'formal', 'summer', 'winter', 
          'eco-friendly', 'designer', 'preloved', 'quality', 'comfortable', 'stylish'
        ], faker.number.int({ min: 2, max: 6 })),
        uploader: uploader._id,
        availability: faker.helpers.arrayElement(['available', 'available', 'available', 'swapped']), // More available items
        approved: true,
        approvedAt: faker.date.recent({ days: 7 }),
        points: faker.number.int({ min: 10, max: 150 }),
        originalPrice: faker.number.int({ min: 15, max: 300 }),
        estimatedValue: faker.number.int({ min: 10, max: 250 }),
        swapPreferences: faker.helpers.arrayElements(CATEGORIES, faker.number.int({ min: 1, max: 4 })),
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          coordinates: {
            lat: parseFloat(faker.location.latitude()),
            lng: parseFloat(faker.location.longitude())
          }
        },
        sustainability: {
          carbonFootprint: faker.number.float({ min: 0.5, max: 5.0, multipleOf: 0.1 }),
          waterUsage: faker.number.int({ min: 100, max: 2000 }),
          materialRecyclability: faker.number.int({ min: 70, max: 100 })
        }
      });
    }
  });
  
  return items;
};

// Generate swap requests
const generateSwapRequests = (items, users) => {
  const swapRequests = [];
  
  // Ensure we have enough items to create meaningful swaps
  if (items.length < 4 || users.length < 2) {
    console.log('⚠️  Insufficient items or users for swap generation');
    return swapRequests;
  }
  
  // 2 completed swaps
  for (let i = 0; i < 2; i++) {
    const requester = faker.helpers.arrayElement(users);
    const owner = faker.helpers.arrayElement(users.filter(u => u._id.toString() !== requester._id.toString()));
    
    // Find items owned by each user
    const ownerItems = items.filter(item => item.uploader.toString() === owner._id.toString());
    const requesterItems = items.filter(item => item.uploader.toString() === requester._id.toString());
    
    // Use fallback if no items found for specific users
    const requestedItem = ownerItems.length > 0 ? faker.helpers.arrayElement(ownerItems) : faker.helpers.arrayElement(items);
    const offeredItem = requesterItems.length > 0 ? faker.helpers.arrayElement(requesterItems) : faker.helpers.arrayElement(items);
    
    swapRequests.push({
      item: requestedItem._id,
      requestedBy: requester._id,
      itemOwner: owner._id,
      mode: 'swap',
      status: 'completed',
      message: faker.lorem.sentences(2),
      offeredItem: offeredItem._id,
      response: {
        message: 'Great swap! Looking forward to it.',
        respondedAt: faker.date.recent({ days: 25 })
      },
      acceptedAt: faker.date.recent({ days: 20 }),
      completedAt: faker.date.recent({ days: 15 }),
      rating: {
        requesterRating: faker.number.int({ min: 4, max: 5 }),
        ownerRating: faker.number.int({ min: 4, max: 5 }),
        requesterReview: 'Excellent condition, exactly as described!',
        ownerReview: 'Smooth transaction, highly recommended!'
      }
    });
  }
  
  // 2 pending swaps
  for (let i = 0; i < 2; i++) {
    const requester = faker.helpers.arrayElement(users);
    const owner = faker.helpers.arrayElement(users.filter(u => u._id.toString() !== requester._id.toString()));
    
    // Find items owned by each user
    const ownerItems = items.filter(item => item.uploader.toString() === owner._id.toString());
    const requesterItems = items.filter(item => item.uploader.toString() === requester._id.toString());
    
    // Use fallback if no items found for specific users
    const requestedItem = ownerItems.length > 0 ? faker.helpers.arrayElement(ownerItems) : faker.helpers.arrayElement(items);
    const swapMode = faker.helpers.arrayElement(['swap', 'points']);
    
    const swapData = {
      item: requestedItem._id,
      requestedBy: requester._id,
      itemOwner: owner._id,
      mode: swapMode,
      status: 'pending',
      message: faker.lorem.sentences(2)
    };
    
    if (swapMode === 'swap' && requesterItems.length > 0) {
      const offeredItem = faker.helpers.arrayElement(requesterItems);
      swapData.offeredItem = offeredItem._id;
    } else if (swapMode === 'points') {
      swapData.pointsOffered = faker.number.int({ min: 50, max: 200 });
    } else {
      // Fallback to points mode if no items available
      swapData.mode = 'points';
      swapData.pointsOffered = faker.number.int({ min: 50, max: 200 });
    }
    
    swapRequests.push(swapData);
  }
  
  return swapRequests;
};

// Hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      SwapRequest.deleteMany({})
    ]);
    
    // Create users
    console.log('👥 Creating users...');
    const usersWithHashedPasswords = await Promise.all(
      USERS_DATA.map(async (userData) => ({
        ...userData,
        password: await hashPassword(userData.password)
      }))
    );
    
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${users.length} users`);
    
    // Create items
    console.log('📦 Creating items...');
    const itemsData = generateItemsData(users);
    const items = await Item.insertMany(itemsData);
    console.log(`✅ Created ${items.length} items`);
    
    // Create swap requests
    console.log('🔄 Creating swap requests...');
    const swapRequestsData = generateSwapRequests(items, users);
    const swapRequests = await SwapRequest.insertMany(swapRequestsData);
    console.log(`✅ Created ${swapRequests.length} swap requests`);
    
    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📦 Items: ${items.length}`);
    console.log(`   🔄 Swap Requests: ${swapRequests.length}`);
    console.log(`   ✅ Completed Swaps: ${swapRequests.filter(s => s.status === 'completed').length}`);
    console.log(`   ⏳ Pending Swaps: ${swapRequests.filter(s => s.status === 'pending').length}`);
    
    console.log('\n🔐 Test Credentials:');
    USERS_DATA.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
