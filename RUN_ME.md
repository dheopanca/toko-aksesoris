# 🚀 Run Project Permata Indah Jewelry

## 📋 Setup (Hanya Sekali)

```bash
# 1. Install semua dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 2. Copy environment files
cp env.example backend/.env
cp frontend/env.example frontend/.env

# 3. Setup database
cd backend
npm run db:init
npm run db:seed
cd ..

# 4. Buat folder uploads
mkdir backend/uploads
```

## 🖥️ Jalankan Project

### Cara 1: Keduanya Bersama (Recommended)
```bash
npm run dev
```

### Cara 2: Terpisah
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🌐 Akses

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🧪 Test

```bash
# Test backend
curl http://localhost:3001/api/health
```

## 🚨 Jika Error

```bash
# Kill port yang sudah digunakan
netstat -ano | findstr :3001
taskkill /PID <PID> /F

netstat -ano | findstr :5173  
taskkill /PID <PID> /F
```

**Selesai!** 🎉
