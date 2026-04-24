const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const initializeDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Initialize database on startup
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err.message);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
