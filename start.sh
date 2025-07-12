#!/bin/bash

# Start MongoDB if not running
echo "Starting MongoDB..."
mongod --dbpath ./data/db --logpath ./data/log/mongod.log --fork 2>/dev/null || echo "MongoDB already running or using MongoDB Atlas"

# Seed the database with sample data
echo "Seeding database..."
cd server && npm run seed

# Start the application
echo "Starting the application..."
cd .. && npm run dev
