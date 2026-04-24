const mysql = require('mysql2/promise');

async function verifyDatabaseConnection() {
    console.log('Testing MySQL connection to warehouse_db...\n');
    
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Mihir',
        database: 'warehouse_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const connection = await pool.getConnection();
        console.log('✓ Successfully connected to MySQL database');
        
        // Get database info
        const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
        console.log(`✓ Current database: ${dbResult[0].current_db}`);
        
        // List tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`✓ Tables found: ${tables.length}`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`  - ${tableName}`);
        });
        
        // Check row counts
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log('\n📊 Row Counts:');
        for (const tableName of tableNames) {
            try {
                const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
                console.log(`  ${tableName}: ${countResult[0].count} rows`);
            } catch (err) {
                console.log(`  ${tableName}: Error counting rows`);
            }
        }
        
        connection.release();
        console.log('\n✓ Database verification complete!');
        process.exit(0);
        
    } catch (err) {
        console.error('✗ Connection failed:', err.message);
        console.error('\nPlease ensure:');
        console.error('1. MySQL Server is running');
        console.error('2. Database "warehouse_db" exists');
        console.error('3. Username: root, Password: Mihir are correct');
        process.exit(1);
    }
}

verifyDatabaseConnection();
