# PowerShell setup script for Permata Indah Jewelry project

Write-Host "🚀 Setting up Permata Indah Jewelry project..." -ForegroundColor Green

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm version: $(npm --version)" -ForegroundColor Green

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Blue
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
}
catch {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
try {
    Set-Location frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Set-Location ..
}
catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
try {
    Set-Location backend
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }

    # Create uploads directory
    Write-Host "📁 Creating uploads directory..." -ForegroundColor Blue
    if (-not (Test-Path "uploads")) {
        New-Item -ItemType Directory -Path "uploads" -Force | Out-Null
    }

    # Check if .env file exists, if not create from example
    if (-not (Test-Path ".env")) {
        Write-Host "📝 Creating .env file from example..." -ForegroundColor Blue
        if (Test-Path "../env.example") {
            Copy-Item "../env.example" ".env"
            Write-Host "✅ .env file created. Please update with your configuration." -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  env.example not found. Creating basic .env file..." -ForegroundColor Yellow
            @"
# Backend environment variables
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
        }
    }

    # Initialize database
    Write-Host "🗄️ Initializing database..." -ForegroundColor Blue
    npm run db:init
    if ($LASTEXITCODE -ne 0) {
        throw "Database initialization failed"
    }

    # Seed database with sample data
    Write-Host "🌱 Seeding database..." -ForegroundColor Blue
    npm run db:seed
    if ($LASTEXITCODE -ne 0) {
        throw "Database seeding failed"
    }

    Set-Location ..
}
catch {
    Write-Host "❌ $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check if frontend .env exists, if not create from example
if (-not (Test-Path "frontend/.env")) {
    Write-Host "📝 Creating frontend .env file from example..." -ForegroundColor Blue
    if (Test-Path "frontend/env.example") {
        Copy-Item "frontend/env.example" "frontend/.env"
        Write-Host "✅ Frontend .env file created." -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Frontend env.example not found. Creating basic .env file..." -ForegroundColor Yellow
        @"
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Permata Indah Jewelry
VITE_NODE_ENV=development
"@ | Out-File -FilePath "frontend/.env" -Encoding UTF8
    }
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start development:" -ForegroundColor Cyan
Write-Host "  npm run dev          # Start both frontend and backend" -ForegroundColor White
Write-Host "  npm run dev:frontend # Start frontend only (port 5173)" -ForegroundColor White
Write-Host "  npm run dev:backend  # Start backend only (port 3001)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: Make sure to update .env files with your configuration if needed." -ForegroundColor Yellow
Write-Host "   - Backend: backend/.env" -ForegroundColor White
Write-Host "   - Frontend: frontend/.env" -ForegroundColor White
