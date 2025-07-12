const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDatabase = require('./seeds/seed');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-db-test';

const resetDatabase = async () => {
  try {
    console.log('🔄 Starting database reset...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 Connected to MongoDB');
    
    // Drop entire database
    console.log('💥 Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database dropped successfully');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    
    // Run seeding
    console.log('🌱 Starting fresh seeding...');
    await seedDatabase();
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
