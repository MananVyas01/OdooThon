@echo off
echo ================================
echo MongoDB Setup and Project Runner
echo ================================

echo.
echo Step 1: Installing MongoDB...
echo.

REM Check if MongoDB is already installed
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB is already installed!
    goto :start_mongodb
)

echo MongoDB not found. Please install MongoDB manually:
echo.
echo 1. Download MongoDB Community Edition from:
echo    https://www.mongodb.com/try/download/community
echo.
echo 2. Run the installer and follow the setup wizard
echo.
echo 3. Make sure to:
echo    - Install MongoDB as a Service
echo    - Install MongoDB Compass (optional)
echo    - Add MongoDB to your PATH
echo.
echo 4. After installation, restart this script
echo.
pause
exit /b 1

:start_mongodb
echo.
echo Step 2: Starting MongoDB Service...
echo.

REM Start MongoDB service
net start MongoDB >nul 2>&1
if %errorlevel% == 0 (
    echo MongoDB service started successfully!
) else (
    echo MongoDB service may already be running or needs manual start
)

echo.
echo Step 3: Seeding Database...
echo.

cd /d "%~dp0server"
call npm run seed
if %errorlevel% neq 0 (
    echo Database seeding failed. Please check your MongoDB connection.
    pause
    exit /b 1
)

echo.
echo Step 4: Starting the Application...
echo.

cd /d "%~dp0"
call npm run dev

pause
