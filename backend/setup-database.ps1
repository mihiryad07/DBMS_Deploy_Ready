#!/usr/bin/env pwsh

<#
============================================================
 SQLite to MySQL Workbench Migration Setup
 PowerShell Version
============================================================
#>

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "   Database Migration: SQLite > MySQL Workbench" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# ============================================================
# CONFIGURATION - EDIT THESE VALUES
# ============================================================

$config = @{
    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = ""  # <-- EDIT: Enter your MySQL root password here
    DB_NAME = "dbms_warehouse"
}

# ============================================================
# VALIDATION
# ============================================================

if ([string]::IsNullOrWhiteSpace($config.DB_PASSWORD)) {
    Write-Host "⚠️  ERROR: Database password is empty!" -ForegroundColor Yellow
    Write-Host "`nPlease edit this script and set your MySQL root password:`n" -ForegroundColor Yellow
    Write-Host '  $config.DB_PASSWORD = "your_password_here"' -ForegroundColor White
    Write-Host "`nThen run the script again.`n" -ForegroundColor Yellow
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Green
Write-Host "   Host: $($config.DB_HOST)"
Write-Host "   User: $($config.DB_USER)"
Write-Host "   Database: $($config.DB_NAME)"
Write-Host "   Password: ***`n"

# ============================================================
# STEP 1: Create Database
# ============================================================

Write-Host "Step 1/2: Creating database..." -ForegroundColor Magenta

try {
    $createDb = "CREATE DATABASE IF NOT EXISTS $($config.DB_NAME);"
    
    $process = & {
        & mysql -h $config.DB_HOST -u $config.DB_USER "-p$($config.DB_PASSWORD)" -e $createDb 2>&1
    }
    
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL command failed"
    }
    
    Write-Host "✅ Database created`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database`n" -ForegroundColor Red
    Write-Host "Error: $_`n" -ForegroundColor Red
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Verify MySQL is running"
    Write-Host "  2. Check password is correct in this script"
    Write-Host "  3. Try: mysql -u root -p -e `"SELECT 1;`""
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

# ============================================================
# STEP 2: Initialize Schema & Data
# ============================================================

Write-Host "Step 2/2: Initializing schema and loading mock data...`n" -ForegroundColor Magenta

$env:DB_HOST = $config.DB_HOST
$env:DB_USER = $config.DB_USER
$env:DB_PASSWORD = $config.DB_PASSWORD
$env:DB_NAME = $config.DB_NAME

try {
    & node db/init.js
    
    if ($LASTEXITCODE -ne 0) {
        throw "Database initialization failed"
    }
} catch {
    Write-Host "`n❌ Failed to initialize database" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

# ============================================================
# SUCCESS
# ============================================================

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "   ✅ Migration Complete!" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Green

Write-Host "📊 Database Summary:" -ForegroundColor Cyan
Write-Host "   ✓ 12 tables created" -ForegroundColor Green
Write-Host "   ✓ Mock data loaded" -ForegroundColor Green
Write-Host "   ✓ Ready for MySQL Workbench" -ForegroundColor Green

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start backend server:" -ForegroundColor White
Write-Host "      npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. Open new terminal for frontend:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3. Access application:" -ForegroundColor White
Write-Host "      http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "   4. Login credentials:" -ForegroundColor White
Write-Host "      Username: admin" -ForegroundColor Yellow
Write-Host "      Password: password" -ForegroundColor Yellow

Write-Host "`n🔧 View in MySQL Workbench:" -ForegroundColor Cyan
Write-Host "   Host: $($config.DB_HOST)"
Write-Host "   User: $($config.DB_USER)"
Write-Host "   Password: (your password)"
Write-Host "   Database: $($config.DB_NAME)"

Write-Host "`n📋 Tables created:" -ForegroundColor Cyan
Write-Host "   Employees: employees, employee_names, employee_phones, employee_addresses" -ForegroundColor White
Write-Host "   Warehouse: warehouses, bins" -ForegroundColor White
Write-Host "   Inventory: parts, assemblies" -ForegroundColor White
Write-Host "   Transactions: batches, items" -ForegroundColor White
Write-Host "   Orders: backorders, backordersOverTime" -ForegroundColor White

Write-Host "`n✨ Database migration from SQLite to MySQL Workbench complete!" -ForegroundColor Green
Write-Host "`nPress Enter to close..." -ForegroundColor Cyan
Read-Host
