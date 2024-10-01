const mysql = require('mysql2');
const express = require('express');
const path = require('path');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Storms!2024za',
    database: 'crowdfunding_db'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
});

// Example query to fetch data from FUNDRAISER table
connection.query('SELECT * FROM FUNDRAISER', (err, rows) => {
    if (err) {
        console.error('Error executing query (FUNDRAISER):', err.message);
        return;
    }
    console.log("Data received from the database (FUNDRAISER):", rows);
});

// Example query to fetch data from CATEGORY table
connection.query('SELECT * FROM CATEGORY', (err, rows) => {
    if (err) {
        console.error('Error executing query (CATEGORY):', err.message);
        return;
    }
    console.log("Data received from the database (CATEGORY):", rows);
});

// Express app setup
const app = express();

// Use express's built-in body parser for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "index.html"));
});

// Route to serve concert.html
app.get("/Fundraisers", (req, res) => {
    res.sendFile(path.join(__dirname,  "Fundraisers.html"));
});

// Route to serve add_concert.html
app.get("/add_Fundraisers", (req, res) => {
    res.sendFile(path.join(__dirname,  "add_Fundraisers.html"));
});

// Start the server
const port = 9090;
app.listen(port, () => {
    console.log(` crowdfundingAPI listening at http://localhost:${port}`);
});
