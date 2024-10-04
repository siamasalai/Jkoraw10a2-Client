const mysql = require('mysql2/promise');
const express = require('express');
const path = require('path');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Storms!2024za',
    database: 'crowdfunding_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Express app setup
const app = express();

// Use express's built-in body parser for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Helper function to execute SQL queries
async function executeQuery(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    }
}

// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route to serve Fundraisers.html
app.get("/Fundraisers", (req, res) => {
    res.sendFile(path.join(__dirname, "Fundraisers.html"));
});

// Route to serve add_Fundraisers.html
app.get("/add_Fundraisers", (req, res) => {
    res.sendFile(path.join(__dirname, "add_Fundraisers.html"));
});

// Route to serve the donation page
app.get("/donation", (req, res) => {
    res.sendFile(path.join(__dirname, "donation.html"));
});

app.get('/Admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Admin.html'));
});

// API route to get all fundraisers
app.get('/api/fundraisers', async (req, res) => {
    try {
        const fundraisers = await executeQuery('SELECT * FROM FUNDRAISER');
        res.json(fundraisers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fundraisers' });
    }
});

// API route to get a specific fundraiser
app.get('/api/fundraisers/:id', async (req, res) => {
    try {
        const [fundraiser] = await executeQuery('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [req.params.id]);
        if (fundraiser) {
            res.json(fundraiser);
        } else {
            res.status(404).json({ error: 'Fundraiser not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fundraiser' });
    }
});

// API route to add a new fundraiser
app.post('/api/fundraisers', async (req, res) => {
    const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.body;
    try {
        const result = await executeQuery(
            'INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID]
        );
        res.status(201).json({ id: result.insertId, message: 'Fundraiser added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding fundraiser' });
    }
});

// API route to add a new donation
app.post('/api/donations', async (req, res) => {
    const { NAME, DATE, AMOUNT, GIVER, FUNDRAISER_ID } = req.body;
    try {
        const result = await executeQuery(
            'INSERT INTO DONATION (NAME, DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?, ?, ?)',
            [NAME, DATE, AMOUNT, GIVER, FUNDRAISER_ID]
        );
        res.status(201).json({ id: result.insertId, message: 'Donation added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding donation' });
    }
});

// Start the server
const port = 9010;
app.listen(port, () => {
    console.log(`crowdfundingAPI listening at http://localhost:${port}`);
});