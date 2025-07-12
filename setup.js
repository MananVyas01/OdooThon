const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Hackathon Project Setup Assistant');
console.log('====================================\n');

// Function to check if MongoDB is installed
function checkMongoDB() {
  return new Promise((resolve) => {
    exec('mongod --version', (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Function to check if MongoDB service is running
function checkMongoDBService() {
  return new Promise((resolve) => {
    exec('tasklist /FI "IMAGENAME eq mongod.exe"', (error, stdout, stderr) => {
      if (error || !stdout.includes('mongod.exe')) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Function to start MongoDB service
function startMongoDBService() {
  return new Promise((resolve) => {
    exec('net start MongoDB', (error, stdout, stderr) => {
      if (error) {
        console.log('⚠️  Could not start MongoDB service automatically');
        console.log('   You may need to start it manually or install MongoDB as a service');
        resolve(false);
      } else {
        console.log('✅ MongoDB service started successfully');
        resolve(true);
      }
    });
  });
}

// Function to seed database
function seedDatabase() {
  return new Promise((resolve) => {
    console.log('🌱 Seeding database with sample data...');
    exec('npm run seed', { cwd: path.join(__dirname, 'server') }, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Database seeding failed');
        console.log('   Error:', error.message);
        resolve(false);
      } else {
        console.log('✅ Database seeded successfully');
        console.log(stdout);
        resolve(true);
      }
    });
  });
}

// Function to start the application
function startApplication() {
  console.log('🚀 Starting the application...');
  console.log('   Backend will run on: http://localhost:5000');
  console.log('   Frontend will run on: http://localhost:3000');
  console.log('\n   Press Ctrl+C to stop the application\n');
  
  const child = exec('npm run dev', { cwd: __dirname });
  
  child.stdout.on('data', (data) => {
    console.log(data);
  });
  
  child.stderr.on('data', (data) => {
    console.log(data);
  });
  
  child.on('close', (code) => {
    console.log(`\n🛑 Application stopped with code ${code}`);
  });
}

// Main setup function
async function setup() {
  try {
    // Check MongoDB installation
    const mongoInstalled = await checkMongoDB();
    
    if (!mongoInstalled) {
      console.log('❌ MongoDB is not installed or not in PATH');
      console.log('\n📋 Please install MongoDB:');
      console.log('   1. Download from: https://www.mongodb.com/try/download/community');
      console.log('   2. Run the installer and follow the setup wizard');
      console.log('   3. Make sure to install MongoDB as a Service');
      console.log('   4. Add MongoDB to your system PATH');
      console.log('   5. Restart your terminal and run this script again');
      console.log('\n💡 Alternative: Use MongoDB Atlas (cloud database)');
      console.log('   See SETUP-GUIDE.md for detailed instructions');
      return;
    }
    
    console.log('✅ MongoDB is installed');
    
    // Check if MongoDB service is running
    const mongoRunning = await checkMongoDBService();
    
    if (!mongoRunning) {
      console.log('⚠️  MongoDB service is not running');
      console.log('🔄 Attempting to start MongoDB service...');
      
      const serviceStarted = await startMongoDBService();
      
      if (!serviceStarted) {
        console.log('\n💡 Try starting MongoDB manually:');
        console.log('   Option 1: Run "mongod" in a new terminal');
        console.log('   Option 2: Start MongoDB service from Windows Services');
        console.log('   Option 3: Use MongoDB Atlas (cloud database)');
        return;
      }
    } else {
      console.log('✅ MongoDB service is running');
    }
    
    // Wait a moment for MongoDB to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Seed the database
    const seedSuccess = await seedDatabase();
    
    if (!seedSuccess) {
      console.log('\n💡 You can try seeding manually later with:');
      console.log('   cd server && npm run seed');
    }
    
    console.log('\n🎉 Setup complete! Starting the application...\n');
    
    // Start the application
    startApplication();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run setup
setup();
