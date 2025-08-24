# 🚀 Manual Setup Guide

Panduan manual untuk menjalankan project Permata Indah Jewelry tanpa script otomatis.

## 📋 Prerequisites

- **Node.js** (versi 18 atau lebih baru)
- **npm** (biasanya terinstall bersama Node.js)

## 🔧 Setup Project

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Environment Files
```bash
# Copy environment files
cp env.example backend/.env
cp frontend/env.example frontend/.env
```

### 3. Setup Database
```bash
cd backend
npm run db:init
npm run db:seed
cd ..
```

### 4. Create Uploads Directory
```bash
mkdir backend/uploads
```

## 🖥️ Run Development

### Option 1: Run Both (Recommended)
```bash
# Dari root project
npm run dev
```

### Option 2: Run Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Option 3: Run Backend Only
```bash
cd backend
npm run dev
```

### Option 4: Run Frontend Only
```bash
cd frontend
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🧪 Test Backend

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test products endpoint
curl http://localhost:3001/api/products
```

Atau buka browser ke: http://localhost:3001/api/health

## 📱 Test the App

1. **Frontend**: Buka http://localhost:5173
2. **Register** user baru
3. **Login** dengan user yang dibuat
4. **Browse** products
5. **Add to cart** dan checkout

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Check ports
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Kill process
taskkill /PID <PID> /F
```

### Database Issues
```bash
cd backend
npm run db:reset  # Reset database
npm run db:init   # Initialize ulang
npm run db:seed   # Seed data
```

### Dependencies Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

## 🔄 Quick Commands

```bash
# Setup project
npm install && cd frontend && npm install && cd ../backend && npm install

# Start development
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend
```

## 📚 Available Scripts

```bash
# Root package.json scripts
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only (port 5173)
npm run dev:backend      # Start backend only (port 3001)
npm run build            # Build frontend
npm run lint             # Lint frontend
```

Happy coding! 🎉
