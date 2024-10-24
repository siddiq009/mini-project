
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Initialize the Express application    
const app = express();
const PORT = 3000;

// Middleware for serving static files and parsing request bodies
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Siddiq@1215', // Replace with your MySQL password
    database: 'login_system' // The database you created
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL database.');
});

const saltRounds = 10;



    
// Endpoint for handling signup
app.post('/signup', (req, res) => {
    const { fullName, email, username, password, role } = req.body;

    console.log('New signup request:', req.body);

    // Check for missing fields
    if (!fullName || !email || !username || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Hash the password before storing it
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ success: false, message: 'Error signing up!' });
        }

        // SQL query to insert a new user with the hashed password
        const query = 'INSERT INTO users (fullName, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [fullName, email, username, hashedPassword, role], (err, results) => {
            if (err) {
                console.error('Error during user signup:', err);

                // Error handling based on error type
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: 'Username or email already exists!' });
                } else {
                    return res.status(500).json({ success: false, message: 'Error signing up!' });
                }
            } 
            
            console.log('User signed up successfully:', results);
            return res.status(200).json({ success: true, message: 'User signed up successfully!' });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    const role = req.body.role ? req.body.role.trim() : '';

    // Check for missing fields
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
    db.query(query, [username, role], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username, password, or role.' });
        }

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (match) {
                // Password matches, send success response
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    redirectPage: '/index2.html'
                });
            } else {
                return res.status(401).json({ error: 'Invalid username, password, or role.' });
            }
        });
    });
});

// Endpoint to get attendance data
app.get('/attendance', (req, res) => {
    const query = 'SELECT * FROM attendance'; // Change this to your attendance table name
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching attendance data:', err);
            return res.status(500).json({ error: 'Error fetching data' });
        }
        return res.status(200).json(results); // Send the results as JSON
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
