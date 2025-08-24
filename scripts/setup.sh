#!/bin/bash

echo "🚀 Setting up Permata Indah Jewelry project..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
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

# Install root dependencies
echo "📦 Installing root dependencies..."
if ! npm install; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend || exit 1
if ! npm install; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend || exit 1
if ! npm install; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    if [ -f ../env.example ]; then
        cp ../env.example .env
        echo "✅ .env file created. Please update with your configuration."
    else
        echo "⚠️  env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Backend environment variables
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
EOF
    fi
fi

# Initialize database
echo "🗄️ Initializing database..."
if ! npm run db:init; then
    echo "❌ Failed to initialize database"
    exit 1
fi

# Seed database with sample data
echo "🌱 Seeding database..."
if ! npm run db:seed; then
    echo "❌ Failed to seed database"
    exit 1
fi

cd ..

# Check if frontend .env exists, if not create from example
if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend .env file from example..."
    if [ -f frontend/env.example ]; then
        cp frontend/env.example frontend/.env
        echo "✅ Frontend .env file created."
    else
        echo "⚠️  Frontend env.example not found. Creating basic .env file..."
        cat > frontend/.env << EOF
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Permata Indah Jewelry
VITE_NODE_ENV=development
EOF
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "  npm run dev          # Start both frontend and backend"
echo "  npm run dev:frontend # Start frontend only (port 5173)"
echo "  npm run dev:backend  # Start backend only (port 3001)"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
echo "📝 Note: Make sure to update .env files with your configuration if needed."
echo "   - Backend: backend/.env"
echo "   - Frontend: frontend/.env"
