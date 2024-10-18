const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

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



const bcrypt = require('bcrypt');
const saltRounds = 10;

// Endpoint for handling signup
app.post('/signup', (req, res) => {
    const { fullName, email, username, password, role } = req.body;

    console.log('New signup request:', req.body);

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

                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ success: false, message: 'Username or email already exists!' });
                } else {
                    res.status(500).json({ success: false, message: 'Error signing up!' });
                }
            } else {
                console.log('User signed up successfully:', results);
                res.status(200).json({ success: true, message: 'User signed up successfully!' });
            }
        });
    });
});

// Endpoint for handling login
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    console.log('Login request received:', req.body);  // Logs the credentials received from the frontend

    // Step 2: SQL query to check if the user exists and retrieve the stored password
    const query = 'SELECT * FROM users WHERE username = ? AND role = ?';

    // Debug: Log the query parameters
    console.log('Running query:', query, [username, role]);

    // Executing the query
    db.query(query, [username, role], (err, results) => {
        if (err) {
            console.error('Error during login query:', err);
            return res.status(500).json({ success: false, message: 'Error during login!' });
        }

        console.log('Query result:', results); // Debug: Show the result of the query

        if (results.length > 0) {
            const user = results[0];  // Take the first result if user is found

            // Step 3: Compare the entered password with the stored hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ success: false, message: 'Error logging in!' });
                }

                if (isMatch) {
                    // Login successful
                    console.log('Password matched for user:', username);
                    res.status(200).json({
                        success: true,
                        redirectPage: '/index2.html'  // Send the redirect URL upon successful login
                    });
                } else {
                    // Password doesn't match
                    console.log('Invalid password for user:', username);
                    res.status(401).json({ success: false, message: 'Invalid username or password!' });
                }
            });
        } else {
            // No user found with the provided username and role
            console.log('User not found for username:', username);
            res.status(404).json({ success: false, message: 'User not found!' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
