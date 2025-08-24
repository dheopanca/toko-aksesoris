# PowerShell development script for Permata Indah Jewelry

Write-Host "🚀 Starting Permata Indah Jewelry development servers..." -ForegroundColor Green

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
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
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

# Check if dependencies are installed
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    try {
        Set-Location frontend
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Frontend dependencies installation failed"
        }
        Set-Location ..
        Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install frontend dependencies: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Backend dependencies not found. Installing..." -ForegroundColor Yellow
    try {
        Set-Location backend
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Backend dependencies installation failed"
        }
        Set-Location ..
        Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install backend dependencies: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Check if database exists
if (-not (Test-Path "backend/database.sqlite")) {
    Write-Host "🗄️ Database not found. Initializing..." -ForegroundColor Yellow
    try {
        Set-Location backend
        
        # Check if .env exists
        if (-not (Test-Path ".env")) {
            Write-Host "📝 Creating .env file..." -ForegroundColor Blue
            if (Test-Path "../env.example") {
                Copy-Item "../env.example" ".env"
            }
            else {
                @"
# Backend environment variables
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
            }
        }
        
        npm run db:init
        if ($LASTEXITCODE -ne 0) {
            throw "Database initialization failed"
        }
        
        npm run db:seed
        if ($LASTEXITCODE -ne 0) {
            throw "Database seeding failed"
        }
        
        Set-Location ..
        Write-Host "✅ Database initialized and seeded successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to initialize database: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Create uploads directory if it doesn't exist
if (-not (Test-Path "backend/uploads")) {
    Write-Host "📁 Creating uploads directory..." -ForegroundColor Blue
    New-Item -ItemType Directory -Name "uploads" -Path "backend" -Force | Out-Null
}

# Check if frontend .env exists
if (-not (Test-Path "frontend/.env")) {
    Write-Host "📝 Creating frontend .env file..." -ForegroundColor Blue
    if (Test-Path "frontend/env.example") {
        Copy-Item "frontend/env.example" "frontend/.env"
    }
    else {
        @"
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Permata Indah Jewelry
VITE_NODE_ENV=development
"@ | Out-File -FilePath "frontend/.env" -Encoding UTF8
    }
}

Write-Host ""
Write-Host "✅ All dependencies and database ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers concurrently using npm run dev from root
try {
    Write-Host "🔄 Starting servers with npm run dev..." -ForegroundColor Blue
    npm run dev
}
catch {
    Write-Host "❌ Failed to start servers: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 You can also start servers manually:" -ForegroundColor Yellow
    Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor White
    Write-Host "   Terminal 2: cd frontend && npm run dev" -ForegroundColor White
}
