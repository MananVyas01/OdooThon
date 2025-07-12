@echo off
echo.
echo ========================================
echo MongoDB Installation for Windows
echo ========================================
echo.

echo Checking if MongoDB is already installed...
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is already installed!
    goto :start_project
)

echo MongoDB not found. Starting installation...
echo.

echo Please follow these steps:
echo 1. A browser window will open with MongoDB download page
echo 2. Download MongoDB Community Edition for Windows
echo 3. Run the installer with default settings
echo 4. Make sure to install MongoDB as a Service
echo 5. After installation, close this window and run: node setup.js

echo.
echo Opening MongoDB download page...
start https://www.mongodb.com/try/download/community

echo.
echo Alternatively, you can use MongoDB Atlas (cloud database):
echo 1. Go to: https://www.mongodb.com/cloud/atlas
echo 2. Create a free account and cluster
echo 3. Get the connection string
echo 4. Update server/.env with your Atlas connection string

echo.
pause

:start_project
echo.
echo MongoDB is ready! Starting the project setup...
echo.
node setup.js
pause
