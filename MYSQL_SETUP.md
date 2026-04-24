# MySQL Setup Instructions

This project has been migrated from SQLite to MySQL. Follow these steps to get your database running:

## Prerequisites

1. **MySQL Server** - Install MySQL Server 5.7 or higher
   - Windows: Download from https://dev.mysql.com/downloads/mysql/
   - Or use MySQL via Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0`

2. **MySQL Workbench** (Optional) - GUI for database management
   - Download: https://dev.mysql.com/downloads/workbench/

## Setup Guide

### Step 1: Create the Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE dbms_warehouse;
```

### Step 2: Install Node Dependencies

From the backend folder, run:

```bash
cd backend
npm install
```

This installs the new MySQL driver (`mysql2` package).

### Step 3: Configure Environment Variables (Optional)

You can customize the MySQL connection by setting environment variables in your terminal:

```bash
# Windows Command Prompt
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=dbms_warehouse

# Windows PowerShell
$env:DB_HOST="localhost"
$env:DB_USER="root"
$env:DB_PASSWORD="root"
$env:DB_NAME="dbms_warehouse"

# Linux/Mac
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=root
export DB_NAME=dbms_warehouse
```

**Default values** (if no environment variables are set):
- DB_HOST: `localhost`
- DB_USER: `root`
- DB_PASSWORD: `root`
- DB_NAME: `dbms_warehouse`

### Step 4: Initialize the Database and Tables

Run the initialization script to create all tables and populate them with mock data:

```bash
npm run seed-mock
```

This will:
- Drop any existing tables (if they exist)
- Create all required tables with proper relationships
- Insert mock employee, warehouse, part, and batch data

### Step 5: Start the Backend Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Database Schema

The following tables have been created in MySQL:

### Core Tables
- **employees** - Employee records with manager status
- **employee_names** - Employee name information (multivalued)
- **employee_phones** - Employee phone numbers (multivalued)
- **employee_addresses** - Employee addresses (multivalued)

### Warehouse & Inventory
- **warehouses** - Warehouse locations
- **bins** - Storage bins in warehouses
- **parts** - Parts and assemblies inventory
- **assemblies** - Mapping of assembly parts

### Transactions
- **batches** - Batches of parts received
- **items** - Individual items in batches
- **backorders** - Active backorders
- **backordersOverTime** - Historical backorder tracking

## API Endpoints Available

After starting the server, the following endpoints will be available:

- `GET /api/dashboard` - Dashboard statistics
- `GET /api/employees` - List employees
- `GET /api/warehouses` - List warehouses
- `GET /api/bins` - List bins
- `GET /api/parts` - List parts
- `GET /api/backorders` - List backorders
- `POST /api/login` - Login (username: admin, password: password)
- `POST /api/query` - Run predefined queries (q1-q8)

## Troubleshooting

### Connection Error: "Access denied for user 'root'@'localhost'"
- Check your MySQL password is correct
- Verify MySQL service is running
- Check environment variables are set correctly

### Connection Error: "Cannot get a connection, pool error: getConnection error"
- Ensure MySQL server is running
- Check the database name exists: `SHOW DATABASES;`
- Verify connection parameters in environment variables

### Table already exists error when running seed-mock
- The script will drop existing tables first
- If you want to keep data, comment out the DROP TABLE lines in backend/db/init.js

## Viewing Data in MySQL Workbench

1. Open MySQL Workbench
2. Create a new MySQL Connection:
   - Hostname: localhost
   - Username: root
   - Password: root (or your custom password)
3. Click "Test Connection"
4. Double-click the connection to open it
5. Select the `dbms_warehouse` database in the left panel
6. You can now browse and query the tables

## Frontend Setup

From the project root directory:

```bash
npm install
npm run dev
```

This will start the frontend on `http://localhost:5173` (Vite dev server)

## Key Changes from SQLite

1. **Connection**: Changed from file-based SQLite to networked MySQL
2. **Query Syntax**: 
   - SQLite string concatenation (`||`) → MySQL CONCAT()
   - SQLite AUTOINCREMENT → MySQL AUTO_INCREMENT
   - SQLite BOOLEAN → MySQL TINYINT(1)
3. **Async Promises**: API now uses mysql2/promise for better async handling
4. **Data Types**: VARCHAR with character limits for better MySQL compatibility

## Database Backup

To backup your MySQL database:

```bash
# Using mysqldump
mysqldump -u root -proot dbms_warehouse > backup.sql

# To restore:
mysql -u root -proot dbms_warehouse < backup.sql
```

---

For more information about MySQL setup, visit: https://dev.mysql.com/doc/
