# MongoDB Installation and Setup Guide

## Quick Setup Options

### Option 1: Install MongoDB Community Edition (Recommended)

1. **Download MongoDB Community Edition:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, x64, MSI
   - Download the installer

2. **Install MongoDB:**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional GUI)
   - Complete the installation

3. **Verify Installation:**
   ```bash
   mongod --version
   mongo --version
   ```

### Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Cluster:**
   - Click "Create Cluster"
   - Choose the free tier
   - Select your region
   - Click "Create Cluster"

3. **Get Connection String:**
   - Click "Connect"
   - Add your IP address
   - Create a database user
   - Copy the connection string

4. **Update Environment File:**
   ```bash
   # Replace in server/.env
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/hackathon-db?retryWrites=true&w=majority
   ```

## Running the Project

### After MongoDB is Set Up:

1. **Seed the Database:**
   ```bash
   cd server
   npm run seed
   ```

2. **Start the Application:**
   ```bash
   cd ..
   npm run dev
   ```

### What Each Command Does:

- `npm run seed` - Creates sample users and requests in the database
- `npm run dev` - Starts both backend (port 5000) and frontend (port 3000)

### Sample Login Credentials:

- **Admin:** admin@example.com / password123
- **Manager:** manager@example.com / password123
- **User:** user@example.com / password123

### Troubleshooting:

1. **MongoDB Connection Issues:**
   - Make sure MongoDB service is running
   - Check firewall settings
   - Verify connection string in .env file

2. **Port Already in Use:**
   - Change PORT in server/.env to a different port
   - Update REACT_APP_API_URL in client/.env accordingly

3. **Module Not Found Errors:**
   - Run `npm install` in root, server, and client directories
   - Clear node_modules and reinstall if needed

### Project Structure:

```
odooThon/
├── server/          # Backend API (Node.js + Express)
├── client/          # Frontend (React + Tailwind)
├── data/           # MongoDB data directory (if using local)
├── package.json    # Root package.json with concurrently
└── setup-and-run.bat # Windows setup script
```
