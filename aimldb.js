const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;



function fetchattendance(branch){
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',// Replace with your MySQL password
        database: 'attendancedb', // Your database name
        password:"1928"
    
    });
    
    const q = "SELECT * FROM `sTUDENT ATT`;"
    db.query(q, (err, result)=>{
        if (err){
            console.log("error occurred " + err);
        }
        else{
            console.log(result);
        }
        db.end();
    })
}
