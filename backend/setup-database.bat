@echo off
REM ============================================================
REM  SQLite to MySQL Workbench Migration Setup
REM  Complete Initialization Script
REM ============================================================

echo.
echo ============================================================
echo   Database Migration: SQLite ^> MySQL Workbench
echo ============================================================
echo.

REM ============================================================
REM  CONFIGURATION - EDIT THESE VALUES
REM ============================================================
REM Enter your MySQL root password below:
SET DB_PASSWORD=

REM If your MySQL setup is different, modify these:
SET DB_HOST=localhost
SET DB_USER=root
SET DB_NAME=dbms_warehouse

REM ============================================================
REM  VALIDATION
REM ============================================================

if "%DB_PASSWORD%"=="" (
    echo.
    echo ⚠️  WARNING: Database password is empty!
    echo.
    echo Please edit this file and set your MySQL root password:
    echo   Line 10: SET DB_PASSWORD=your_password_here
    echo.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo 📋 Configuration:
echo   Host: %DB_HOST%
echo   User: %DB_USER%
echo   Database: %DB_NAME%
echo   Password: ***
echo.

REM ============================================================
REM  STEP 1: Create Database
REM ============================================================

echo Step 1: Creating database...
mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" >nul 2>&1

if errorlevel 1 (
    echo ❌ Failed to create database
    echo.
    echo Troubleshooting:
    echo   1. Verify MySQL is running
    echo   2. Check password is correct in this script
    echo   3. Try: mysql -u root -p -e "SELECT 1;"
    echo.
    pause
    exit /b 1
)

echo ✅ Database created
echo.

REM ============================================================
REM  STEP 2: Initialize Schema & Data
REM ============================================================

echo Step 2: Initializing schema and loading mock data...
echo.

setlocal enabledelayedexpansion
set "DB_PASSWORD=%DB_PASSWORD%"
set "DB_USER=%DB_USER%"
set "DB_HOST=%DB_HOST%"
set "DB_NAME=%DB_NAME%"

node db/init.js

if errorlevel 1 (
    echo.
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)

endlocal

echo.
echo ============================================================
echo   ✅ Migration Complete!
echo ============================================================
echo.
echo 📊 Database Summary:
echo   ✓ 12 tables created
echo   ✓ Mock data loaded
echo   ✓ Ready for MySQL Workbench
echo.
echo 🚀 Next Steps:
echo   1. Start backend server: npm start
echo   2. Open new terminal for frontend: npm run dev
echo   3. Access app: http://localhost:5173
echo   4. Login: admin / password
echo.
echo 🔧 View in MySQL Workbench:
echo   Host: %DB_HOST%
echo   User: %DB_USER%
echo   Password: (your password)
echo   Database: %DB_NAME%
echo.
echo Tables created:
echo   - employees, employee_names, employee_phones, employee_addresses
echo   - warehouses, bins
echo   - parts, assemblies
echo   - batches, items
echo   - backorders, backordersOverTime
echo.

pause
