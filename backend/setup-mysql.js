#!/usr/bin/env node

/**
 * MySQL Setup Helper
 * Helps diagnose and fix MySQL connection issues
 */

const mysql = require('mysql2/promise');

async function testMySQLConnection(host, user, password, database) {
    try {
        console.log(`\n📋 Testing connection: ${user}@${host}/${database}`);
        console.log(`   Password: ${password ? '***' : '(empty)'}\n`);
        
        const connection = await mysql.createConnection({
            host,
            user,
            password: password || undefined,
            database,
            waitForConnections: true
        });

        const [result] = await connection.query('SELECT NOW() as current_time');
        console.log('✅ SUCCESS! MySQL Connection works!');
        console.log(`   Current time: ${result[0].current_time}\n`);
        
        await connection.end();
        return true;
    } catch (error) {
        console.log('❌ FAILED! Connection Error:');
        console.log(`   Code: ${error.code}`);
        console.log(`   Message: ${error.message}\n`);
        return false;
    }
}

async function createDatabase(host, user, password) {
    try {
        console.log(`\n📝 Creating database 'dbms_warehouse'...\n`);
        
        const connection = await mysql.createConnection({
            host,
            user,
            password: password || undefined
        });

        await connection.query('CREATE DATABASE IF NOT EXISTS dbms_warehouse');
        console.log('✅ Database created successfully!\n');
        
        await connection.end();
        return true;
    } catch (error) {
        console.log('❌ Failed to create database:');
        console.log(`   ${error.message}\n`);
        return false;
    }
}

async function runDiagnostics() {
    console.log('\n' + '='.repeat(60));
    console.log('   MySQL Setup Diagnostic Tool');
    console.log('='.repeat(60));

    // Get credentials from environment or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'dbms_warehouse';

    console.log('\n📌 Using Configuration:');
    console.log(`   Host: ${host}`);
    console.log(`   User: ${user}`);
    console.log(`   Password: ${password ? '***' : '(empty)'}`);
    console.log(`   Database: ${database}`);

    console.log('\n' + '-'.repeat(60));
    
    // Test connection
    const connected = await testMySQLConnection(host, user, password, database);
    
    if (!connected) {
        console.log('🔧 Troubleshooting Tips:');
        console.log('   1. Make sure MySQL server is running');
        console.log('   2. Check your MySQL user and password');
        console.log('   3. Set environment variables if needed:');
        console.log('      SET DB_USER=your_user');
        console.log('      SET DB_PASSWORD=your_password');
        console.log('   4. Try without password first (empty password)');
        console.log('   5. Run: mysql -u root -e "SELECT 1;" to test manually\n');
        return;
    }

    // Create database
    const dbCreated = await createDatabase(host, user, password);
    
    if (!dbCreated) {
        console.log('🔧 Could not create database - you may need to:\n');
        console.log('   1. Run this command manually:');
        console.log(`      mysql -u ${user} ${password ? `-p${password}` : ''} -e "CREATE DATABASE dbms_warehouse;"`);
        console.log('   2. Then run: npm run seed-mock\n');
        return;
    }

    console.log('✨ Everything looks good! You can now run:');
    console.log('   npm run seed-mock\n');
}

// Run diagnostics
runDiagnostics().catch(err => {
    console.error('Diagnostic error:', err);
    process.exit(1);
});
