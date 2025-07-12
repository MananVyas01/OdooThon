@echo off
echo.
echo ==========================================
echo MongoDB Installation Helper
echo ==========================================
echo.
echo This will install MongoDB Community Edition
echo on your Windows system.
echo.
echo IMPORTANT: This requires Administrator privileges
echo.
pause

echo.
echo Running MongoDB installer...
echo.

PowerShell -ExecutionPolicy Bypass -File "%~dp0install-mongodb.ps1"

echo.
echo Installation script completed.
echo.
echo To continue with your project setup:
echo 1. Close this window
echo 2. Open a new terminal/command prompt
echo 3. Navigate to your project folder
echo 4. Run: node setup.js
echo.
pause
