const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1928', // Replace with your MySQL password
    database: 'logindatabase' // Your database name
    
});


// Function to insert a user with a hashed password
function insertUser(username, password, fullName, email, role) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        console.log('Hashed password:', hash);

        // SQL query to insert a new user with the hashed password
        const query = 'INSERT INTO users (fullName, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
        
        db.query(query, [fullName, email, username, hash, role], (err, results) => {
            if (err) {
                console.error('Error during user insertion:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log('Username or email already exists!');
                } else {
                    console.log('Error inserting user:', err);
                }
            } else {
                console.log('User inserted successfully:', results);
            }
            db.end(); // Close the database connection
        });
    });
}

// Call the function with example data
insertUser('test_username', 'test_password', 'Test User', 'test@example.com', 'Student'); // Change values as needed

