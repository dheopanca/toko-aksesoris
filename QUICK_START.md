# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan project Permata Indah Jewelry secara manual.

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

### 2. Setup Environment
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

## 🖥️ Start Development

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

## 📚 More Information

Lihat `MANUAL_SETUP.md` untuk panduan lengkap.

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

Happy coding! 🎉
