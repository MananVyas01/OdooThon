const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Item = require('../models/Item');

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    points: 100
  },
  {
    name: 'Fashion Enthusiast',
    email: 'fashion@example.com',
    password: 'password123',
    role: 'user',
    points: 50
  },
  {
    name: 'Style Swapper',
    email: 'style@example.com',
    password: 'password123',
    role: 'user',
    points: 75
  },
  {
    name: 'Wardrobe Manager',
    email: 'wardrobe@example.com',
    password: 'password123',
    role: 'manager',
    points: 60
  }
];

const sampleItems = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic vintage denim jacket in excellent condition. Perfect for layering and adding a retro touch to any outfit.',
    category: 'outerwear',
    type: 'jacket',
    size: 'M',
    condition: 'good',
    brand: 'Levi\'s',
    originalPrice: 89.99,
    tags: ['vintage', 'denim', 'classic', 'retro'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        alt: 'Vintage Denim Jacket',
        isPrimary: true
      }
    ],
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94102'
    },
    swapPreferences: {
      preferredCategories: ['tops', 'outerwear'],
      preferredSizes: ['M', 'L'],
      notes: 'Looking for similar vintage pieces or quality basics'
    },
    approved: true,
    points: 15
  },
  {
    title: 'Floral Summer Dress',
    description: 'Beautiful floral print dress perfect for summer occasions. Lightweight and comfortable fabric.',
    category: 'dresses',
    type: 'midi dress',
    size: 'S',
    condition: 'like-new',
    brand: 'Zara',
    originalPrice: 59.99,
    tags: ['floral', 'summer', 'midi', 'casual'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        alt: 'Floral Summer Dress',
        isPrimary: true
      }
    ],
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90210'
    },
    swapPreferences: {
      preferredCategories: ['dresses', 'tops'],
      preferredSizes: ['S', 'M'],
      notes: 'Interested in other summer dresses or nice tops'
    },
    approved: true,
    points: 12
  },
  {
    title: 'Designer Leather Boots',
    description: 'Genuine leather ankle boots in black. Minimal wear, very comfortable and stylish.',
    category: 'shoes',
    type: 'ankle boots',
    size: '8',
    condition: 'good',
    brand: 'Steve Madden',
    originalPrice: 129.99,
    tags: ['leather', 'boots', 'black', 'designer'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400',
        alt: 'Designer Leather Boots',
        isPrimary: true
      }
    ],
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    swapPreferences: {
      preferredCategories: ['shoes', 'accessories'],
      preferredSizes: ['8', '8.5'],
      notes: 'Looking for other designer shoes or nice accessories'
    },
    approved: true,
    points: 20
  },
  {
    title: 'Casual White Sneakers',
    description: 'Clean white sneakers perfect for everyday wear. Comfortable and versatile.',
    category: 'shoes',
    type: 'sneakers',
    size: '9',
    condition: 'good',
    brand: 'Adidas',
    originalPrice: 79.99,
    tags: ['white', 'sneakers', 'casual', 'comfortable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        alt: 'Casual White Sneakers',
        isPrimary: true
      }
    ],
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60601'
    },
    swapPreferences: {
      preferredCategories: ['shoes'],
      preferredSizes: ['9', '9.5'],
      notes: 'Open to other casual shoes'
    },
    approved: true,
    points: 10
  },
  {
    title: 'Professional Blazer',
    description: 'Navy blue blazer perfect for professional settings. Well-tailored and maintained.',
    category: 'formal',
    type: 'blazer',
    size: 'L',
    condition: 'like-new',
    brand: 'Hugo Boss',
    originalPrice: 199.99,
    tags: ['blazer', 'professional', 'navy', 'formal'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        alt: 'Professional Blazer',
        isPrimary: true
      }
    ],
    location: {
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      zipCode: '02101'
    },
    swapPreferences: {
      preferredCategories: ['formal', 'tops'],
      preferredSizes: ['L', 'XL'],
      notes: 'Looking for other professional wear'
    },
    approved: true,
    points: 25
  },
  {
    title: 'Vintage Band T-Shirt',
    description: 'Authentic vintage band t-shirt from the 90s. Great condition for its age.',
    category: 'tops',
    type: 't-shirt',
    size: 'M',
    condition: 'good',
    brand: 'Vintage',
    originalPrice: 25.00,
    tags: ['vintage', 'band', 'tshirt', '90s'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        alt: 'Vintage Band T-Shirt',
        isPrimary: true
      }
    ],
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      zipCode: '78701'
    },
    swapPreferences: {
      preferredCategories: ['tops', 'casual'],
      preferredSizes: ['M', 'L'],
      notes: 'Love vintage pieces and band merch'
    },
    approved: true,
    points: 8
  },
  {
    title: 'Yoga Leggings Set',
    description: 'High-quality yoga leggings with matching sports bra. Perfect for workouts.',
    category: 'activewear',
    type: 'leggings',
    size: 'M',
    condition: 'like-new',
    brand: 'Lululemon',
    originalPrice: 118.00,
    tags: ['yoga', 'leggings', 'activewear', 'workout'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506629905057-7c0a44c2e3f4?w=400',
        alt: 'Yoga Leggings Set',
        isPrimary: true
      }
    ],
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      zipCode: '98101'
    },
    swapPreferences: {
      preferredCategories: ['activewear'],
      preferredSizes: ['M'],
      notes: 'Looking for other high-quality activewear'
    },
    approved: true,
    points: 18
  },
  {
    title: 'Designer Handbag',
    description: 'Authentic designer handbag in excellent condition. Timeless style.',
    category: 'accessories',
    type: 'handbag',
    size: 'One Size',
    condition: 'good',
    brand: 'Michael Kors',
    originalPrice: 249.99,
    tags: ['designer', 'handbag', 'accessories', 'luxury'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        alt: 'Designer Handbag',
        isPrimary: true
      }
    ],
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      zipCode: '33101'
    },
    swapPreferences: {
      preferredCategories: ['accessories'],
      preferredSizes: ['One Size'],
      notes: 'Interested in other designer accessories'
    },
    approved: true,
    points: 30
  },
  {
    title: 'Denim Skinny Jeans',
    description: 'Classic blue skinny jeans, comfortable stretch fabric. Perfect fit.',
    category: 'bottoms',
    type: 'jeans',
    size: '28',
    condition: 'good',
    brand: 'American Eagle',
    originalPrice: 49.99,
    tags: ['denim', 'jeans', 'skinny', 'stretch'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400',
        alt: 'Denim Skinny Jeans',
        isPrimary: true
      }
    ],
    location: {
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      zipCode: '80201'
    },
    swapPreferences: {
      preferredCategories: ['bottoms'],
      preferredSizes: ['28', '29'],
      notes: 'Looking for other jeans or pants'
    },
    approved: true,
    points: 12
  },
  {
    title: 'Silk Scarf Collection',
    description: 'Set of 3 beautiful silk scarves in different patterns. Elegant and versatile.',
    category: 'accessories',
    type: 'scarf',
    size: 'One Size',
    condition: 'like-new',
    brand: 'Various',
    originalPrice: 75.00,
    tags: ['silk', 'scarf', 'accessories', 'elegant'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400',
        alt: 'Silk Scarf Collection',
        isPrimary: true
      }
    ],
    location: {
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      zipCode: '97201'
    },
    swapPreferences: {
      preferredCategories: ['accessories'],
      preferredSizes: ['One Size'],
      notes: 'Love accessories and jewelry'
    },
    approved: true,
    points: 15
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create items with random user assignments
    const itemsWithUsers = sampleItems.map((item, index) => ({
      ...item,
      uploader: createdUsers[index % createdUsers.length]._id,
    }));

    const createdItems = await Item.create(itemsWithUsers);
    console.log(`Created ${createdItems.length} items`);

    // Add some likes to items
    for (let i = 0; i < createdItems.length; i++) {
      const item = createdItems[i];
      const numLikes = Math.floor(Math.random() * 3);
      
      for (let j = 0; j < numLikes; j++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        if (!item.likes.includes(randomUser._id)) {
          item.likes.push(randomUser._id);
        }
      }
      
      // Add some views
      item.views = Math.floor(Math.random() * 50) + 1;
      await item.save();
    }

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Fashion Enthusiast: fashion@example.com / password123');
    console.log('Style Swapper: style@example.com / password123');
    console.log('Wardrobe Manager: wardrobe@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
