const db = require('./database');
const { dbAsync } = require('./database');

const MOCK_DATA = {
  dashboard: {
    backordersOverTime: [
      { name: 'Jan', count: 12 },
      { name: 'Feb', count: 19 },
      { name: 'Mar', count: 15 },
      { name: 'Apr', count: 28 },
      { name: 'May', count: 22 },
      { name: 'Jun', count: 18 },
    ],
  },
  employees: [
    { employee_no: 'E1001', name: 'Tony Smith', type: 'Manager', phone: '+91-98765-43201', department: 'Logistics' },
    { employee_no: 'E1002', name: 'Sarah Connor', type: 'Worker', phone: '+91-98765-43202', department: 'Sorting' },
    { employee_no: 'E1003', name: 'Mike Johnson', type: 'Worker', phone: '+91-98765-43203', department: 'Forklift' },
    { employee_no: 'E1004', name: 'Elena Rogers', type: 'Manager', phone: '+91-98765-43204', department: 'Inventory' },
    { employee_no: 'E1005', name: 'James Doe', type: 'Worker', phone: '+91-98765-43205', department: 'Logistics' },
    { employee_no: 'E1006', name: 'David Chen', type: 'Manager', phone: '+91-98765-43206', department: 'Operations' },
    { employee_no: 'E1007', name: 'Maria Garcia', type: 'Manager', phone: '+91-98765-43207', department: 'Quality Control' },
    { employee_no: 'E1008', name: 'Robert Wilson', type: 'Manager', phone: '+91-98765-43208', department: 'Shipping' },
    { employee_no: 'E1009', name: 'Lisa Thompson', type: 'Manager', phone: '+91-98765-43209', department: 'Receiving' },
    { employee_no: 'E1010', name: 'Kevin Brown', type: 'Manager', phone: '+91-98765-43210', department: 'Maintenance' },
    { employee_no: 'E1011', name: 'Jennifer Davis', type: 'Worker', phone: '+91-98765-43211', department: 'Sorting' },
    { employee_no: 'E1012', name: 'Christopher Miller', type: 'Worker', phone: '+91-98765-43212', department: 'Forklift' },
    { employee_no: 'E1013', name: 'Amanda Martinez', type: 'Worker', phone: '+91-98765-43213', department: 'Logistics' },
    { employee_no: 'E1014', name: 'Daniel Anderson', type: 'Worker', phone: '+91-98765-43214', department: 'Operations' },
    { employee_no: 'E1015', name: 'Michelle Taylor', type: 'Worker', phone: '+91-98765-43215', department: 'Quality Control' },
    { employee_no: 'E1016', name: 'Jason Thomas', type: 'Worker', phone: '+91-98765-43216', department: 'Shipping' },
    { employee_no: 'E1017', name: 'Stephanie Jackson', type: 'Worker', phone: '+91-98765-43217', department: 'Receiving' },
    { employee_no: 'E1018', name: 'Andrew White', type: 'Worker', phone: '+91-98765-43218', department: 'Maintenance' },
    { employee_no: 'E1019', name: 'Rachel Harris', type: 'Worker', phone: '+91-98765-43219', department: 'Inventory' },
    { employee_no: 'E1020', name: 'Brian Clark', type: 'Worker', phone: '+91-98765-43220', department: 'Operations' },
    { employee_no: 'E1021', name: 'Nicole Lewis', type: 'Worker', phone: '+91-98765-43221', department: 'Sorting' },
    { employee_no: 'E1022', name: 'Timothy Robinson', type: 'Worker', phone: '+91-98765-43222', department: 'Forklift' },
    { employee_no: 'E1023', name: 'Heather Walker', type: 'Worker', phone: '+91-98765-43223', department: 'Logistics' },
    { employee_no: 'E1024', name: 'Justin Hall', type: 'Worker', phone: '+91-98765-43224', department: 'Quality Control' },
    { employee_no: 'E1025', name: 'Melissa Young', type: 'Worker', phone: '+91-98765-43225', department: 'Shipping' },
  ],
  warehouses: [
    { id: 'WH01', location: 'New York', manager: 'Tony Smith' },
    { id: 'WH02', location: 'Los Angeles', manager: 'Elena Rogers' },
    { id: 'WH03', location: 'Chicago', manager: 'David Chen' },
    { id: 'WH04', location: 'Houston', manager: 'Maria Garcia' },
    { id: 'WH05', location: 'Phoenix', manager: 'Robert Wilson' },
    { id: 'WH06', location: 'Philadelphia', manager: 'Lisa Thompson' },
    { id: 'WH07', location: 'San Antonio', manager: 'Kevin Brown' },
  ],
  bins: [
    { bin_id: 'B101', warehouse: 'WH01', capacity: 100, remaining: 20 },
    { bin_id: 'B102', warehouse: 'WH01', capacity: 150, remaining: 150 },
    { bin_id: 'B103', warehouse: 'WH01', capacity: 80, remaining: 45 },
    { bin_id: 'B201', warehouse: 'WH02', capacity: 200, remaining: 5 },
    { bin_id: 'B202', warehouse: 'WH02', capacity: 120, remaining: 85 },
    { bin_id: 'B301', warehouse: 'WH03', capacity: 50, remaining: 0 },
    { bin_id: 'B302', warehouse: 'WH03', capacity: 90, remaining: 60 },
    { bin_id: 'B401', warehouse: 'WH04', capacity: 180, remaining: 120 },
    { bin_id: 'B402', warehouse: 'WH04', capacity: 75, remaining: 25 },
    { bin_id: 'B501', warehouse: 'WH05', capacity: 110, remaining: 70 },
    { bin_id: 'B502', warehouse: 'WH05', capacity: 95, remaining: 95 },
    { bin_id: 'B601', warehouse: 'WH06', capacity: 130, remaining: 40 },
    { bin_id: 'B701', warehouse: 'WH07', capacity: 160, remaining: 100 },
    { bin_id: 'B702', warehouse: 'WH07', capacity: 85, remaining: 15 },
  ],
  parts: [
    { part_no: 'P-001', description: 'Hydraulic Valve', type: 'Part', price: 120.00, stock: 45 },
    { part_no: 'P-002', description: 'Engine Block Assy', type: 'Assembly', price: 4500.00, stock: 12 },
    { part_no: 'P-003', description: 'Transmission Belt', type: 'Part', price: 45.50, stock: 150 },
    { part_no: 'P-004', description: 'Control Module', type: 'Assembly', price: 850.00, stock: 5 },
    { part_no: 'P-005', description: 'Brake Pads', type: 'Part', price: 85.00, stock: 200 },
    { part_no: 'P-006', description: 'Fuel Pump Assy', type: 'Assembly', price: 320.00, stock: 18 },
    { part_no: 'P-007', description: 'Air Filter', type: 'Part', price: 25.00, stock: 300 },
    { part_no: 'P-008', description: 'Alternator Assy', type: 'Assembly', price: 280.00, stock: 22 },
    { part_no: 'P-009', description: 'Spark Plugs', type: 'Part', price: 8.50, stock: 500 },
    { part_no: 'P-010', description: 'Radiator Assy', type: 'Assembly', price: 195.00, stock: 15 },
    { part_no: 'P-011', description: 'Oil Filter', type: 'Part', price: 12.00, stock: 400 },
    { part_no: 'P-012', description: 'Transmission Assy', type: 'Assembly', price: 1200.00, stock: 8 },
  ],
  backorders: [
    { id: 'BO-1001', part_no: 'P-004', manager: 'Tony Smith', orderDate: '2023-11-01', status: 'Active', fulfilledDate: null },
    { id: 'BO-1002', part_no: 'P-001', manager: 'Elena Rogers', orderDate: '2023-10-15', status: 'Completed', fulfilledDate: '2023-10-20' },
    { id: 'BO-1003', part_no: 'P-002', manager: 'Tony Smith', orderDate: '2023-11-20', status: 'Active', fulfilledDate: null },
    { id: 'BO-1004', part_no: 'P-006', manager: 'David Chen', orderDate: '2023-11-25', status: 'Active', fulfilledDate: null },
    { id: 'BO-1005', part_no: 'P-008', manager: 'Maria Garcia', orderDate: '2023-11-10', status: 'Completed', fulfilledDate: '2023-11-15' },
    { id: 'BO-1006', part_no: 'P-010', manager: 'Robert Wilson', orderDate: '2023-11-28', status: 'Active', fulfilledDate: null },
    { id: 'BO-1007', part_no: 'P-012', manager: 'Lisa Thompson', orderDate: '2023-11-05', status: 'Completed', fulfilledDate: '2023-11-12' },
    { id: 'BO-1008', part_no: 'P-005', manager: 'Kevin Brown', orderDate: '2023-11-30', status: 'Active', fulfilledDate: null },
  ],
};

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Create tables if they don't exist (non-destructive)
        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS employees (
                employee_no TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                phone TEXT,
                department TEXT
            )
        `);

        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS warehouses (
                id TEXT PRIMARY KEY,
                location TEXT NOT NULL,
                manager TEXT
            )
        `);

        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS bins (
                bin_id TEXT PRIMARY KEY,
                warehouse TEXT NOT NULL,
                capacity INTEGER NOT NULL,
                remaining INTEGER NOT NULL
            )
        `);

        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS parts (
                part_no TEXT PRIMARY KEY,
                description TEXT NOT NULL,
                type TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL
            )
        `);

        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS backorders (
                id TEXT PRIMARY KEY,
                part_no TEXT NOT NULL,
                manager TEXT,
                orderDate TEXT,
                status TEXT NOT NULL,
                fulfilledDate TEXT
            )
        `);

        await dbAsync.run(`
            CREATE TABLE IF NOT EXISTS backordersOverTime (
                name TEXT PRIMARY KEY,
                count INTEGER NOT NULL
            )
        `);

        console.log('✓ Tables ensured.');

        // Only seed data if tables are empty (preserves existing data)
        const empCount = await dbAsync.get('SELECT COUNT(*) as count FROM employees');
        if (empCount.count === 0) {
            console.log('Tables are empty — seeding with initial data...');

            for (const emp of MOCK_DATA.employees) {
                await dbAsync.run(
                    'INSERT INTO employees (employee_no, name, type, phone, department) VALUES (?, ?, ?, ?, ?)',
                    [emp.employee_no, emp.name, emp.type, emp.phone, emp.department]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.employees.length} employees`);

            for (const wh of MOCK_DATA.warehouses) {
                await dbAsync.run(
                    'INSERT INTO warehouses (id, location, manager) VALUES (?, ?, ?)',
                    [wh.id, wh.location, wh.manager]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.warehouses.length} warehouses`);

            for (const bin of MOCK_DATA.bins) {
                await dbAsync.run(
                    'INSERT INTO bins (bin_id, warehouse, capacity, remaining) VALUES (?, ?, ?, ?)',
                    [bin.bin_id, bin.warehouse, bin.capacity, bin.remaining]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.bins.length} bins`);

            for (const part of MOCK_DATA.parts) {
                await dbAsync.run(
                    'INSERT INTO parts (part_no, description, type, price, stock) VALUES (?, ?, ?, ?, ?)',
                    [part.part_no, part.description, part.type, part.price, part.stock]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.parts.length} parts`);

            for (const bo of MOCK_DATA.backorders) {
                await dbAsync.run(
                    'INSERT INTO backorders (id, part_no, manager, orderDate, status, fulfilledDate) VALUES (?, ?, ?, ?, ?, ?)',
                    [bo.id, bo.part_no, bo.manager, bo.orderDate, bo.status, bo.fulfilledDate]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.backorders.length} backorders`);

            for (const bot of MOCK_DATA.dashboard.backordersOverTime) {
                await dbAsync.run(
                    'INSERT INTO backordersOverTime (name, count) VALUES (?, ?)',
                    [bot.name, bot.count]
                );
            }
            console.log(`  Inserted ${MOCK_DATA.dashboard.backordersOverTime.length} backorder timeline entries`);
        } else {
            console.log(`✓ Database already has data (${empCount.count} employees found) — skipping seed.`);
        }

        console.log('✓ Database initialized successfully!');
    } catch (err) {
        console.error('✗ Database initialization error:', err.message);
        throw err;
    }
}

module.exports = initializeDatabase;
