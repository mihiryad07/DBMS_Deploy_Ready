# MySQL Connection Troubleshooting Guide

## Current Issue
MySQL Authentication Error: `Access denied for user 'root'@'localhost' (using password: NO)`

This means MySQL root user DOES require a password.

## Solution - Find Your MySQL Root Password

### Option 1: Check Your MySQL Installation Notes
If you installed MySQL recently, check:
- Installation email or confirmation
- Desktop/Documents for setup instructions
- MySQL Installer output logs

### Option 2: Reset MySQL Root Password (Windows)

**Step 1: Stop MySQL Service**
```powershell
net stop MySQL80
# OR if your MySQL version is different:
net stop MySQL57
net stop MySQL57
```

**Step 2: Start MySQL without authentication**
```powershell
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld" --skip-grant-tables
```

**Step 3: Connect without password (new terminal)**
```powershell
mysql -u root
```

**Step 4: Reset root password**
```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
EXIT;
```

**Step 5: Restart MySQL service**
```powershell
net start MySQL80
```

**Step 6: Test connection with new password**
```powershell
mysql -u root -p'newpassword' -e "SELECT 1;"
```

### Option 3: Try Common Default Passwords

```powershell
# Try password: "mysql"
$env:DB_PASSWORD="mysql"; npm run seed-mock

# Try password: "M@y5ql"
$env:DB_PASSWORD="M@y5ql"; npm run seed-mock

# Try password: "password"
$env:DB_PASSWORD="password"; npm run seed-mock
```

### Option 4: Use a Different MySQL User

If you created a user during installation (e.g., "admin" or "warehouse"):
```powershell
$env:DB_USER="admin"
$env:DB_PASSWORD="your_password"
npm run seed-mock
```

---

## Once You Know Your Password

Set environment variable and try initialization:

```powershell
# Command Prompt
set DB_PASSWORD=your_mysql_password

# PowerShell
$env:DB_PASSWORD="your_mysql_password"

# Then run:
npm run seed-mock
```

---

## Alternative: Using Docker

If MySQL setup is too complicated, use Docker (requires Docker Desktop installed):

```powershell
# Start MySQL in Docker with known password
docker run --name dbms-mysql -e MYSQL_ROOT_PASSWORD=root123 -p 3306:3306 -d mysql:8.0

# Then set credentials
$env:DB_PASSWORD="root123"

# And initialize
npm run seed-mock
```

---

## Verify MySQL Configuration

Check what MySQL users exist:

```powershell
mysql -u root -p -e "SELECT user, host FROM mysql.user;"
# Enter the password when prompted
```

---

## Still Not Working?

Try this one-liner to check your MySQL setup:

```powershell
# Check if MySQL service is running
Get-Service | findstr -i mysql

# Check MySQL version
mysql --version

# Try connecting with various options
mysql -u root
mysql -u root -p
mysql -h 127.0.0.1 -u root
```

Once you resolve the password issue, run:
```powershell
npm run seed-mock
npm start
```

Then frontend in another terminal:
```powershell
npm run dev
```

Open: http://localhost:5173
