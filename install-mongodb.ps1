# MongoDB Auto-Installer for Windows
# Run this script as Administrator

Write-Host "================================" -ForegroundColor Green
Write-Host "MongoDB Auto-Installer" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$adminRole = [Security.Principal.WindowsBuiltInRole]::Administrator

if (-not $principal.IsInRole($adminRole)) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    Write-Host "   Right-click on PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Check if MongoDB is already installed
$mongoPath = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongoPath) {
    Write-Host "✅ MongoDB is already installed at: $($mongoPath.Source)" -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 0
}

Write-Host "🔄 MongoDB not found. Installing..." -ForegroundColor Yellow
Write-Host ""

# Create temp directory
$tempDir = "$env:TEMP\mongodb-install"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

# Download MongoDB
$mongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.8.msi"
$msiPath = "$tempDir\mongodb-installer.msi"

Write-Host "📥 Downloading MongoDB Community Edition..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $mongoUrl -OutFile $msiPath -UseBasicParsing
    Write-Host "✅ Download completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please download manually from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install MongoDB
Write-Host "🔧 Installing MongoDB..." -ForegroundColor Cyan
try {
    $installArgs = @(
        "/i", $msiPath,
        "/quiet",
        "INSTALLLOCATION=C:\Program Files\MongoDB\Server\7.0\",
        "ADDLOCAL=all"
    )
    
    Start-Process -FilePath "msiexec.exe" -ArgumentList $installArgs -Wait -NoNewWindow
    Write-Host "✅ MongoDB installation completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add MongoDB to PATH
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

if ($currentPath -notlike "*$mongoPath*") {
    Write-Host "🔧 Adding MongoDB to system PATH..." -ForegroundColor Cyan
    $newPath = "$currentPath;$mongoPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "✅ MongoDB added to PATH" -ForegroundColor Green
} else {
    Write-Host "✅ MongoDB already in PATH" -ForegroundColor Green
}

# Create MongoDB service
Write-Host "🔧 Creating MongoDB service..." -ForegroundColor Cyan
try {
    $mongoDataDir = "C:\data\db"
    $mongoLogDir = "C:\data\log"
    
    # Create data directories
    if (-not (Test-Path $mongoDataDir)) {
        New-Item -ItemType Directory -Path $mongoDataDir -Force | Out-Null
    }
    if (-not (Test-Path $mongoLogDir)) {
        New-Item -ItemType Directory -Path $mongoLogDir -Force | Out-Null
    }
    
    # Create MongoDB configuration file
    $configContent = @"
storage:
  dbPath: C:\data\db
systemLog:
  destination: file
  path: C:\data\log\mongod.log
  logAppend: true
net:
  port: 27017
  bindIp: 127.0.0.1
"@
    
    $configPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"
    $configContent | Out-File -FilePath $configPath -Encoding utf8
    
    # Install MongoDB service
    & "$mongoPath\mongod.exe" --config $configPath --install
    
    # Start MongoDB service
    Start-Service -Name MongoDB
    
    Write-Host "✅ MongoDB service created and started" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Service creation failed, but MongoDB is installed" -ForegroundColor Yellow
    Write-Host "   You can start MongoDB manually with: mongod" -ForegroundColor Yellow
}

# Cleanup
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎉 MongoDB installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your terminal/command prompt" -ForegroundColor White
Write-Host "   2. Navigate to your project directory" -ForegroundColor White
Write-Host "   3. Run: node setup.js" -ForegroundColor White
Write-Host ""
Write-Host "💡 You can verify the installation by running: mongod --version" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
