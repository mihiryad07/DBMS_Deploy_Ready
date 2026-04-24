// Test API endpoints
const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: `/api${path}`,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function testAPI() {
    console.log('Testing API endpoints...\n');
    
    try {
        // Test dashboard
        console.log('1. Testing /api/dashboard...');
        const dashboard = await makeRequest('/dashboard');
        console.log(`   Status: ${dashboard.status}`);
        if (dashboard.status === 200) {
            console.log(`   ✓ Dashboard data loaded`);
            console.log(`   Total Warehouses: ${dashboard.data.summaries?.totalWarehouses}`);
            console.log(`   Total Employees: ${dashboard.data.summaries?.totalEmployees}`);
        } else {
            console.log(`   ✗ Error: ${dashboard.data}`);
        }

        // Test employees
        console.log('\n2. Testing /api/employees...');
        const employees = await makeRequest('/employees');
        console.log(`   Status: ${employees.status}`);
        if (employees.status === 200) {
            console.log(`   ✓ Employees loaded: ${employees.data.length} records`);
            if (employees.data.length > 0) {
                console.log(`   First employee: ${employees.data[0].name}`);
            }
        } else {
            console.log(`   ✗ Error: ${employees.data}`);
        }

        // Test warehouses
        console.log('\n3. Testing /api/warehouses...');
        const warehouses = await makeRequest('/warehouses');
        console.log(`   Status: ${warehouses.status}`);
        if (warehouses.status === 200) {
            console.log(`   ✓ Warehouses loaded: ${warehouses.data.length} records`);
            if (warehouses.data.length > 0) {
                console.log(`   First warehouse: ${warehouses.data[0].location}`);
            }
        } else {
            console.log(`   ✗ Error: ${warehouses.data}`);
        }

        // Test parts
        console.log('\n4. Testing /api/parts...');
        const parts = await makeRequest('/parts');
        console.log(`   Status: ${parts.status}`);
        if (parts.status === 200) {
            console.log(`   ✓ Parts loaded: ${parts.data.length} records`);
            if (parts.data.length > 0) {
                console.log(`   First part: ${parts.data[0].description}`);
            }
        } else {
            console.log(`   ✗ Error: ${parts.data}`);
        }

        // Test backorders
        console.log('\n5. Testing /api/backorders...');
        const backorders = await makeRequest('/backorders');
        console.log(`   Status: ${backorders.status}`);
        if (backorders.status === 200) {
            console.log(`   ✓ Backorders loaded: ${backorders.data.length} records`);
        } else {
            console.log(`   ✗ Error: ${backorders.data}`);
        }

        console.log('\n✓ API tests completed!');
    } catch (err) {
        console.error('Error testing API:', err.message);
        console.error('Make sure the backend server is running on http://localhost:3001');
    }
    
    process.exit(0);
}

// Wait 2 seconds for server to fully start, then test
setTimeout(testAPI, 2000);
