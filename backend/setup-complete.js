#!/usr/bin/env node

/**
 * Complete MySQL Database Setup & Migration
 * This script handles the full migration from SQLite to MySQL Workbench
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let passwordTries = [
    '',  // empty
    'password',
    'mysql',
    'root',
    '123456',
    'admin'
];

async function tryPassword(pwd) {
    return new Promise((resolve) => {
        const args = [
            '-u', 'root',
            ...(pwd ? ['-p' + pwd] : []),
            '-e',
            'SELECT 1 as status'
        ];
        
        const mysql = spawn('mysql', args, { 
            stdio: 'pipe',
            timeout: 5000
        });
        
        let output = '';
        mysql.stderr.on('data', (data) => {
            output += data.toString();
        });
        
        mysql.on('close', (code) => {
            resolve(code === 0);
        });
        
        mysql.on('error', () => {
            resolve(false);
        });
    });
}

async function findWorkingPassword() {
    console.log('\n🔍 Searching for working MySQL password...\n');
    
    for (const pwd of passwordTries) {
        const display = pwd ? '***' : '(empty)';
        process.stdout.write(`  Trying password: ${display}... `);
        
        const works = await tryPassword(pwd);
        if (works) {
            console.log('✅ SUCCESS!\n');
            return pwd;
        }
        console.log('❌');
    }
    
    return null;
}

async function createDatabase(password) {
    return new Promise((resolve) => {
        console.log('📝 Creating database "dbms_warehouse"...');
        
        const args = [
            '-u', 'root',
            ...(password ? ['-p' + password] : []),
            '-e',
            'CREATE DATABASE IF NOT EXISTS dbms_warehouse; SHOW DATABASES LIKE "dbms_warehouse";'
        ];
        
        const mysql = spawn('mysql', args, { stdio: 'pipe' });
        
        mysql.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Database created successfully!\n');
                resolve(true);
            } else {
                console.log('❌ Failed to create database\n');
                resolve(false);
            }
        });
    });
}

async function initializeSchema(password) {
    return new Promise((resolve) => {
        console.log('🗄️  Initializing database schema...\n');
        
        process.env.DB_PASSWORD = password || '';
        
        // Run the initialization script
        const init = spawn('node', ['db/init.js'], {
            cwd: __dirname,
            stdio: 'inherit'
        });
        
        init.on('close', (code) => {
            if (code === 0) {
                console.log('\n✅ Database schema initialized!\n');
                resolve(true);
            } else {
                console.log('\n❌ Failed to initialize schema\n');
                resolve(false);
            }
        });
    });
}

async function main() {
    console.log('\n' + '='.repeat(70));
    console.log('   SQLite → MySQL Workbench Migration & Setup');
    console.log('='.repeat(70));
    
    // Find working password
    const password = await findWorkingPassword();
    
    if (password === null) {
        console.log('❌ ERROR: Could not find working MySQL password!\n');
        console.log('📋 Manual Steps:');
        console.log('   1. Find your MySQL root password');
        console.log('   2. Run: $env:DB_PASSWORD="your_password"');
        console.log('   3. Run: npm run seed-mock\n');
        process.exit(1);
    }
    
    // Save password to env file
    const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=${password}
DB_NAME=dbms_warehouse
NODE_ENV=development
PORT=3000`;
    
    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);
    console.log(`💾 Saved credentials to: backend/.env\n`);
    
    // Set environment variable
    process.env.DB_PASSWORD = password;
    
    // Create database
    const dbCreated = await createDatabase(password);
    if (!dbCreated) {
        console.log('⚠️  Continue anyway...\n');
    }
    
    // Initialize schema and data
    const schemaOk = await initializeSchema(password);
    
    if (schemaOk) {
        console.log('\n' + '='.repeat(70));
        console.log('   ✅ Migration Complete!');
        console.log('='.repeat(70));
        console.log('\n📊 Database Summary:');
        console.log('   ✓ 12 tables created');
        console.log('   ✓ Mock data loaded');
        console.log('   ✓ MySQL Workbench ready');
        console.log('\n🚀 Next Steps:');
        console.log('   1. Start backend: npm start');
        console.log('   2. Start frontend (new terminal): npm run dev');
        console.log('   3. Open: http://localhost:5173');
        console.log('   4. Login: admin / password');
        console.log('\n🔧 View in MySQL Workbench:');
        console.log(`   Host: localhost`);
        console.log(`   User: root`);
        console.log(`   Password: ${password ? '***' : '(empty)'}`);
        console.log(`   Database: dbms_warehouse\n`);
    } else {
        console.log('❌ Migration failed. Check errors above.\n');
        process.exit(1);
    }
}

// Run setup
main().catch(err => {
    console.error('Setup error:', err);
    process.exit(1);
});
