#!/bin/bash

echo "🚀 Starting Permata Indah Jewelry development servers..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Frontend dependencies not found. Installing..."
    cd frontend || exit 1
    if ! npm install; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    echo "✅ Frontend dependencies installed successfully"
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Backend dependencies not found. Installing..."
    cd backend || exit 1
    if ! npm install; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
    cd ..
    echo "✅ Backend dependencies installed successfully"
fi

# Check if database exists
if [ ! -f "backend/database.sqlite" ]; then
    echo "🗄️ Database not found. Initializing..."
    cd backend || exit 1
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file..."
        if [ -f "../env.example" ]; then
            cp ../env.example .env
        else
            cat > .env << EOF
# Backend environment variables
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
EOF
        fi
    fi
    
    if ! npm run db:init; then
        echo "❌ Database initialization failed"
        exit 1
    fi
    
    if ! npm run db:seed; then
        echo "❌ Database seeding failed"
        exit 1
    fi
    
    cd ..
    echo "✅ Database initialized and seeded successfully"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "backend/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p backend/uploads
fi

# Check if frontend .env exists
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    if [ -f "frontend/env.example" ]; then
        cp frontend/env.example frontend/.env
    else
        cat > frontend/.env << EOF
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Permata Indah Jewelry
VITE_NODE_ENV=development
EOF
    fi
fi

echo ""
echo "✅ All dependencies and database ready!"
echo ""
echo "🚀 Starting development servers..."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers concurrently using npm run dev from root
echo "🔄 Starting servers with npm run dev..."
if ! npm run dev; then
    echo "❌ Failed to start servers"
    echo "💡 You can also start servers manually:"
    echo "   Terminal 1: cd backend && npm run dev"
    echo "   Terminal 2: cd frontend && npm run dev"
fi
