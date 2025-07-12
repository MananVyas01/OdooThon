const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    points: 150,
    role: 'user'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    points: 100,
    role: 'user'
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'password123',
    points: 200,
    role: 'user'
  }
];

const sampleItems = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket from the 90s, perfect for casual wear',
    category: 'outerwear',
    type: 'jacket',
    size: 'M',
    condition: 'good',
    tags: ['vintage', 'denim', 'casual'],
    brand: 'Levi\'s',
    originalPrice: 80,
    availability: 'available',
    approved: true,
    isActive: true,
    location: {
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }
  },
  {
    title: 'Elegant Black Dress',
    description: 'Perfect for formal occasions, knee-length with lace details',
    category: 'dresses',
    type: 'dress',
    size: 'S',
    condition: 'like-new',
    tags: ['formal', 'elegant', 'black'],
    brand: 'Zara',
    originalPrice: 120,
    availability: 'available',
    approved: true,
    isActive: true,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    }
  },
  {
    title: 'Comfortable Running Shoes',
    description: 'Barely worn Nike running shoes, great for jogging and workouts',
    category: 'shoes',
    type: 'athletic',
    size: '9',
    condition: 'like-new',
    tags: ['athletic', 'nike', 'running'],
    brand: 'Nike',
    originalPrice: 150,
    availability: 'available',
    approved: true,
    isActive: true,
    location: {
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    }
  },
  {
    title: 'Cozy Wool Sweater',
    description: 'Warm and soft wool sweater, perfect for winter',
    category: 'tops',
    type: 'sweater',
    size: 'L',
    condition: 'good',
    tags: ['wool', 'winter', 'cozy'],
    brand: 'H&M',
    originalPrice: 60,
    availability: 'swapped',
    approved: true,
    isActive: true,
    location: {
      city: 'Boston',
      state: 'MA',
      zipCode: '02101'
    }
  },
  {
    title: 'Designer Handbag',
    description: 'Luxury leather handbag with gold hardware',
    category: 'accessories',
    type: 'bag',
    size: 'One Size',
    condition: 'new',
    tags: ['luxury', 'leather', 'designer'],
    brand: 'Michael Kors',
    originalPrice: 300,
    availability: 'available',
    approved: true,
    isActive: true,
    location: {
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    }
  },
  {
    title: 'Yoga Leggings',
    description: 'High-waisted yoga leggings with moisture-wicking fabric',
    category: 'activewear',
    type: 'leggings',
    size: 'M',
    condition: 'good',
    tags: ['yoga', 'activewear', 'comfortable'],
    brand: 'Lululemon',
    originalPrice: 90,
    availability: 'available',
    approved: true,
    isActive: true,
    location: {
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');
    
    // Create users
    const users = [];
    for (let userData of sampleUsers) {
      const user = new User({
        ...userData
      });
      await user.save();
      users.push(user);
    }
    console.log(`Created ${users.length} users`);
    
    // Create items
    const items = [];
    for (let i = 0; i < sampleItems.length; i++) {
      const itemData = sampleItems[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const item = new Item({
        ...itemData,
        uploader: randomUser._id,
        likes: [users[Math.floor(Math.random() * users.length)]._id], // Random likes
        views: Math.floor(Math.random() * 100) + 1 // Random views
      });
      await item.save();
      items.push(item);
    }
    console.log(`Created ${items.length} items`);
    
    console.log('Database seeded successfully!');
    console.log('Sample login credentials:');
    console.log('Email: alice@example.com, Password: password123');
    console.log('Email: bob@example.com, Password: password123');
    console.log('Email: carol@example.com, Password: password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
