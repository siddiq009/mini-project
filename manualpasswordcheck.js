const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Siddiq@1215', // Replace with your MySQL password
    database: 'login_system'
});

// Function to manually check password
function checkPasswordManually(username, inputPassword) {
    db.query('SELECT password FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return;
        }

        if (results.length > 0) {
            const storedPasswordHash = results[0].password;

            bcrypt.compare(inputPassword, storedPasswordHash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return;
                }

                if (isMatch) {
                    console.log('Password is correct.');
                } else {
                    console.log('Password is incorrect.');
                }
            });
        } else {
            console.log('User not found.');
        }
    });
}

// Manually call the function to test
checkPasswordManually('test_username', 'test_password');
