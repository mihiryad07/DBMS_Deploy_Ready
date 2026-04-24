const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { dbAsync } = require('../db/database');

const queryDb = async (query, params = []) => {
    return await dbAsync.all(query, params);
};

const getDb = async (query, params = []) => {
    return await dbAsync.get(query, params);
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // In a real application, you would query the database to verify the user and hash the password.
    // For this demonstration, we are using a hardcoded admin login.
    if (username === 'admin' && password === 'password') {
        const token = 'mock-jwt-token-748923749823'; // Fake JWT token
        return res.json({ token, user: { id: 1, name: 'Admin', role: 'admin' } });
    }
    
    return res.status(401).json({ error: 'Invalid username or password. (Hint: admin / password)' });
});

router.get('/dashboard', async (req, res) => {
    try {
        const totalWarehousesResult = await getDb('SELECT COUNT(*) as count FROM warehouses');
        const totalEmployeesResult = await getDb('SELECT COUNT(*) as count FROM employees');
        const activeBackordersResult = await getDb("SELECT COUNT(*) as count FROM backorders WHERE status = 'Active'");
        const totalPartsResult = await getDb('SELECT sum(stock) as count FROM parts');

        const backordersOverTime = await queryDb('SELECT name, count FROM backordersOverTime');
        
        const partsPerWarehouse = await queryDb(`
            SELECT warehouse as name, sum(remaining) as parts 
            FROM bins 
            GROUP BY warehouse
        `);

        res.json({
            summaries: {
                totalWarehouses: totalWarehousesResult.count,
                totalEmployees: totalEmployeesResult.count,
                activeBackorders: activeBackordersResult.count,
                totalParts: totalPartsResult.count,
            },
            backordersOverTime,
            partsPerWarehouse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/employees', async (req, res) => {
    const { type } = req.query;
    try {
        let query = 'SELECT * FROM employees';
        let params = [];
        if (type) {
            query += ' WHERE type = ?';
            params.push(type);
        }
        const employees = await queryDb(query, params);
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/employees', async (req, res) => {
    const { employee_no, name, type, phone, department } = req.body;
    
    if (!employee_no || !name || !type || !phone || !department) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    try {
        const query = `INSERT INTO employees (employee_no, name, type, phone, department) VALUES (?, ?, ?, ?, ?)`;
        await queryDb(query, [employee_no, name, type, phone, department]);
        res.status(201).json({ message: 'Employee added successfully', employee_no });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queryDb('DELETE FROM employees WHERE employee_no = ?', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/warehouses', async (req, res) => {
    try {
        const rows = await queryDb('SELECT * FROM warehouses');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/warehouses', async (req, res) => {
    const { id, location, manager } = req.body;

    if (!id || !location || !manager) {
        return res.status(400).json({ error: 'All fields are required: id, location, manager.' });
    }

    try {
        const query = `INSERT INTO warehouses (id, location, manager) VALUES (?, ?, ?)`;
        await queryDb(query, [id, location, manager]);
        res.status(201).json({ message: 'Warehouse added successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/warehouses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queryDb('DELETE FROM warehouses WHERE id = ?', [id]);
        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/bins', async (req, res) => {
    try {
        const rows = await queryDb('SELECT * FROM bins');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/parts', async (req, res) => {
    try {
        const rows = await queryDb('SELECT * FROM parts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/parts', async (req, res) => {
    const { part_no, description, type, price, stock } = req.body;
    if (!part_no || !description || !type || price === undefined || stock === undefined) {
        return res.status(400).json({ error: 'All part fields are required.' });
    }
    try {
        const query = `INSERT INTO parts (part_no, description, type, price, stock) VALUES (?, ?, ?, ?, ?)`;
        await queryDb(query, [part_no, description, type, price, stock]);
        res.status(201).json({ message: 'Part added successfully', part_no });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/parts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queryDb('DELETE FROM parts WHERE part_no = ?', [id]);
        res.json({ message: 'Part deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/backorders', async (req, res) => {
    try {
        const rows = await queryDb('SELECT * FROM backorders');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/backorders', async (req, res) => {
    const { id, part_no, manager, orderDate, status, fulfilledDate } = req.body;
    if (!id || !part_no || !manager || !orderDate || !status) {
        return res.status(400).json({ error: 'Required fields missing for backorder.' });
    }
    try {
        const query = `INSERT INTO backorders (id, part_no, manager, orderDate, status, fulfilledDate) VALUES (?, ?, ?, ?, ?, ?)`;
        // fulfilledDate can be null if not completed
        await queryDb(query, [id, part_no, manager, orderDate, status, fulfilledDate || null]);
        res.status(201).json({ message: 'Backorder added successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/backorders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await queryDb('DELETE FROM backorders WHERE id = ?', [id]);
        res.json({ message: 'Backorder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/query', async (req, res) => {
    const { queryId } = req.body;
    try {
        switch(queryId) {
            case 'q1':
                return res.json({
                    columns: ['Employee No'],
                    rows: (await queryDb(`
                        SELECT employee_no
                        FROM employees
                        WHERE type = 'Worker' AND department IN (
                            SELECT department FROM employees WHERE name LIKE '%Tony Tona%' AND type = 'Manager'
                        )
                    `)).map(r => Object.values(r))
                });
            case 'q2':
                return res.json({
                    columns: ['Employee No', 'Name'],
                    rows: (await queryDb(`
                        SELECT employee_no, name
                        FROM employees
                        ORDER BY name;
                    `)).map(r => Object.values(r))
                });
            case 'q3':
                return res.json({
                    columns: ['Employee No', 'Phone'],
                    rows: (await queryDb(`
                        SELECT employee_no, phone
                        FROM employees
                        WHERE type = 'Manager';
                    `)).map(r => Object.values(r))
                });
            case 'q4':
                return res.json({
                    columns: ['Part No'],
                    rows: (await queryDb(`
                        SELECT part_no
                        FROM parts
                        WHERE type = 'Assembly'
                        ORDER BY part_no;
                    `)).map(r => Object.values(r))
                });
            case 'q5':
                return res.json({
                    columns: ['Manager', 'Part No', 'Backorder Date', 'Status'],
                    rows: (await queryDb(`
                        SELECT manager, 
                               part_no, 
                               orderDate as backorder_date, 
                               status
                        FROM backorders
                        WHERE status = 'Active';
                    `)).map(r => Object.values(r))
                });
            case 'q6':
                return res.json({
                    columns: ['Manager', 'Part No', 'Backorder Date', 'Fulfilled Date'],
                    rows: (await queryDb(`
                        SELECT manager, 
                               part_no, 
                               orderDate as backorder_date,
                               CASE 
                                   WHEN status = 'Active' THEN '2000-01-01'
                                   ELSE fulfilledDate
                               END AS fulfilled_date
                        FROM backorders;
                    `)).map(r => Object.values(r))
                });
            case 'q7':
                return res.json({
                    columns: ['Bin No', 'Remaining Capacity'],
                    rows: (await queryDb(`
                        SELECT bin_id as bin_no,
                               remaining as remaining_capacity
                        FROM bins;
                    `)).map(r => Object.values(r))
                });
            case 'q8':
                return res.json({
                    columns: ['Manager Name', 'Team Size'],
                    rows: (await queryDb(`
                        SELECT m.name as manager_name, count(w.employee_no) as team_size
                        FROM employees m
                        LEFT JOIN employees w ON m.department = w.department AND w.type = 'Worker'
                        WHERE m.type = 'Manager'
                        GROUP BY m.employee_no
                        HAVING team_size = (
                            SELECT MIN(team_count)
                            FROM (
                                SELECT COUNT(w2.employee_no) as team_count
                                FROM employees m2
                                LEFT JOIN employees w2 ON m2.department = w2.department AND w2.type = 'Worker'
                                WHERE m2.type = 'Manager'
                                GROUP BY m2.employee_no
                            ) AS temp
                        );
                    `)).map(r => Object.values(r))
                });
            default:
                return res.status(400).json({ error: "Unknown Query" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/custom-query', async (req, res) => {
    const { sql } = req.body;

    if (!sql || !sql.trim()) {
        return res.status(400).json({ error: 'SQL query is required.' });
    }

    // Only allow SELECT statements for safety
    const trimmed = sql.trim().toUpperCase();
    const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'REPLACE', 'TRUNCATE', 'ATTACH', 'DETACH'];
    for (const keyword of forbidden) {
        if (trimmed.startsWith(keyword)) {
            return res.status(403).json({ error: `Only SELECT queries are allowed. "${keyword}" statements are blocked.` });
        }
    }

    if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('WITH') && !trimmed.startsWith('PRAGMA') && !trimmed.startsWith('EXPLAIN')) {
        return res.status(403).json({ error: 'Only SELECT / WITH / PRAGMA / EXPLAIN queries are allowed.' });
    }

    try {
        const rows = await queryDb(sql);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        const data = rows.map(row => Object.values(row));

        res.json({
            columns,
            rows: data,
            rowCount: data.length,
            executedSql: sql.trim()
        });
    } catch (err) {
        res.status(400).json({ error: `SQL Error: ${err.message}` });
    }
});

module.exports = router;
