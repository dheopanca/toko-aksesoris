# Scripts Documentation

Scripts untuk setup dan menjalankan project Permata Indah Jewelry.

## 📋 Prerequisites

Sebelum menjalankan script, pastikan sudah menginstall:

- **Node.js** (versi 18 atau lebih baru)
- **npm** (biasanya terinstall bersama Node.js)

Download Node.js dari: https://nodejs.org/

## 🚀 Setup Scripts

### Windows (Recommended)
```cmd
# Double click file atau jalankan dari command prompt
scripts\setup.bat

# Atau dari npm
npm run setup
```

### Windows (PowerShell)
```powershell
# Jalankan sebagai Administrator jika diperlukan
.\scripts\setup.ps1
```

### Linux/Mac (Bash)
```bash
# Berikan permission execute terlebih dahulu
chmod +x scripts/setup.sh

# Jalankan script
./scripts/setup.sh

# Atau dari npm
npm run setup:bash
```

### Setup Manual
Jika script tidak berjalan, bisa setup manual:

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Setup database
cd backend
npm run db:init
npm run db:seed
cd ..

# Copy environment files
cp env.example backend/.env
cp frontend/env.example frontend/.env
```

## 🖥️ Development Scripts

### Windows (Recommended)
```cmd
# Double click file atau jalankan dari command prompt
scripts\dev.bat

# Atau dari npm
npm run dev:script
```

### Windows (PowerShell)
```powershell
.\scripts\dev.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh

# Atau dari npm
npm run dev:bash
```

### Manual Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 📁 Script Files

- **`setup.bat`** - Setup Batch untuk Windows (Recommended)
- **`setup.ps1`** - Setup PowerShell untuk Windows
- **`setup.sh`** - Setup Bash untuk Linux/Mac
- **`dev.bat`** - Development Batch untuk Windows (Recommended)
- **`dev.ps1`** - Development PowerShell untuk Windows
- **`dev.sh`** - Development Bash untuk Linux/Mac

## 🔧 What Scripts Do

### Setup Scripts
1. ✅ Check Node.js dan npm installation
2. 📦 Install semua dependencies (root, frontend, backend)
3. 📁 Buat direktori uploads
4. 📝 Buat file .env dari template
5. 🗄️ Initialize dan seed database
6. ✅ Konfirmasi setup selesai

### Development Scripts
1. ✅ Check semua prerequisites
2. 📦 Install dependencies jika belum ada
3. 🗄️ Setup database jika belum ada
4. 📝 Buat file .env jika belum ada
5. 🚀 Start development servers (frontend + backend)

## 🌐 Access URLs

Setelah setup dan menjalankan development:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🚨 Troubleshooting

### Permission Denied (Linux/Mac)
```bash
chmod +x scripts/*.sh
```

### PowerShell Execution Policy
```powershell
# Jalankan sebagai Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
```bash
# Check port usage
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Kill process jika diperlukan
taskkill /PID <PID> /F
```

### Database Issues
```bash
cd backend
npm run db:reset  # Reset database
npm run db:init   # Initialize ulang
npm run db:seed   # Seed data
```

## 📝 Environment Variables

Script akan otomatis membuat file `.env` dari template:

- **Backend**: `backend/.env`
- **Frontend**: `frontend/.env`

Pastikan update nilai-nilai penting seperti `JWT_SECRET` untuk production.

## 🔄 Quick Commands

```bash
# Setup project
npm run setup

# Start development
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only  
npm run dev:backend
```
