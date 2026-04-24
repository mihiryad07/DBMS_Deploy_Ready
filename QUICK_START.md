# Quick Start Guide - MySQL DBMS Warehouse Application

## 🚀 Quick Start (5 minutes)

### Step 1: Start MySQL Server

**Option A: Local MySQL Installation**
```bash
# Windows
# MySQL service should start automatically, or:
# Services → MySQL80 → Right-click → Start

# Linux
sudo systemctl start mysql

# Mac
brew services start mysql-server
```

**Option B: Using Docker**
```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Step 2: Create Database
```bash
# Connect to MySQL and run:
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS dbms_warehouse;"
```

### Step 3: Setup Backend

```bash
cd backend
npm install
npm run seed-mock
npm start
```

The backend will be running at `http://localhost:3000`

### Step 4: Setup Frontend

In a new terminal from the project root:

```bash
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`

### Step 5: Login

Open http://localhost:5173 in your browser

**Login Credentials:**
- Username: `admin`
- Password: `password`

---

## 📊 Database Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| employees | Employee data | 3 (2 managers, 1 worker) |
| employee_names | Employee names | 3 |
| employee_phones | Employee phone numbers | 2 |
| employee_addresses | Employee addresses | 1 |
| warehouses | Warehouse locations | 2 (abcd, efgh) |
| bins | Storage bins | 3 |
| parts | Parts and assemblies | 4 |
| assemblies | Assembly compositions | 2 |
| batches | Received batches | 2 |
| items | Individual items | 100 |
| backorders | Backorder entries | 2 |
| backordersOverTime | Historical tracking | 6 |

---

## 🔍 Verify Installation

### Check MySQL Connection
```bash
cd backend
node -e "const pool = require('./db/database'); pool.getConnection().then(() => console.log('✓ MySQL Connected')).catch(e => console.error('✗ Error:', e.message))"
```

### Check Tables
```sql
USE dbms_warehouse;
SHOW TABLES;
```

Expected output:
```
+---------------------------+
| Tables_in_dbms_warehouse  |
+---------------------------+
| assemblies                |
| backorders                |
| backordersOverTime        |
| batches                   |
| bins                      |
| employee_addresses        |
| employee_names            |
| employee_phones           |
| employees                 |
| items                      |
| parts                     |
| warehouses                |
+---------------------------+
```

---

## 🛠️ Common Commands

```bash
# Backend
npm start              # Start production server
npm run dev            # Start with auto-reload (needs nodemon)
npm run seed-mock      # Initialize database with mock data

# Frontend
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## 🧹 Reset Database

To completely reset and reinitialize:

```bash
cd backend
npm run seed-mock
```

This will:
1. Drop all existing tables
2. Create fresh tables
3. Populate with mock data

---

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | User authentication |
| GET | /api/dashboard | Dashboard statistics |
| GET | /api/employees | List employees |
| GET | /api/warehouses | List warehouses |
| GET | /api/bins | List bins |
| GET | /api/parts | List parts |
| GET | /api/backorders | List backorders |
| POST | /api/query | Execute predefined queries (q1-q8) |

---

## 🔧 Environment Configuration

Edit `backend/.env` if using non-default MySQL settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=dbms_warehouse
PORT=3000
```

---

## ❌ Troubleshooting

### "Cannot connect to MySQL"
- [ ] Verify MySQL server is running
- [ ] Check credentials (user/password)
- [ ] Verify database exists: `mysql -u root -proot -e "SHOW DATABASES;"`

### "Tables not found"
- [ ] Run initialization: `npm run seed-mock`
- [ ] Check database selection: `USE dbms_warehouse;`

### "Port 3000 already in use"
- [ ] Change PORT in `.env`
- [ ] Or kill existing process: `lsof -ti:3000 | xargs kill -9`

### Frontend can't reach backend
- [ ] Verify backend is running on port 3000
- [ ] Check CORS is enabled in backend/server.js
- [ ] Verify frontend is on http://localhost:5173

---

## 📚 For More Information

- MySQL Setup: See `MYSQL_SETUP.md`
- Database Schema: Check `REAL_DATA_IMPLEMENTATION.md`
- Backend Setup: See `backend/REAL_DATA_SETUP.md`

---

**Ready to go!** 🎉

Start the MySQL server, backend, and frontend, then navigate to http://localhost:5173
