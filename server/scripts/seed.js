const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Request = require('../models/Request');

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'John Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Jane Manager',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager'
  },
  {
    name: 'Mike User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user'
  }
];

const sampleRequests = [
  {
    title: 'Fix printer in office 201',
    description: 'The printer in office 201 is not working properly. It keeps jamming and needs maintenance.',
    category: 'technical',
    priority: 'medium',
    location: 'Office 201',
    status: 'pending'
  },
  {
    title: 'Request new employee onboarding',
    description: 'Need to prepare onboarding materials for new employee starting next week.',
    category: 'hr',
    priority: 'high',
    location: 'HR Department',
    status: 'in-progress'
  },
  {
    title: 'Office cleaning supplies',
    description: 'We are running low on cleaning supplies in the break room.',
    category: 'administrative',
    priority: 'low',
    location: 'Break Room',
    status: 'resolved'
  },
  {
    title: 'Software license renewal',
    description: 'Adobe Creative Suite license expires next month and needs renewal.',
    category: 'administrative',
    priority: 'urgent',
    location: 'IT Department',
    status: 'pending'
  },
  {
    title: 'Air conditioning repair',
    description: 'The AC unit in the main office is not cooling properly.',
    category: 'maintenance',
    priority: 'high',
    location: 'Main Office',
    status: 'in-progress'
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
    await Request.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create requests with random user assignments
    const requestsWithUsers = sampleRequests.map(request => ({
      ...request,
      createdBy: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
      assignedTo: Math.random() > 0.5 ? createdUsers[Math.floor(Math.random() * createdUsers.length)]._id : undefined
    }));

    const createdRequests = await Request.create(requestsWithUsers);
    console.log(`Created ${createdRequests.length} requests`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager: manager@example.com / password123');
    console.log('User: user@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
