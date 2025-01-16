const express = require("express")
const router = express.Router();
const mysql = require("mysql2");
const fs = require("node:fs");
const { exit } = require("node:process");
const password = (() => {
    let password = "";
    try {
        password = fs.readFileSync("./database_password.txt", "utf8");
        // Probably don't intend to have whitespace at the beginning or end of
        // a password:
        password = password.trim();
    } catch (error) {
        console.error(error);
        console.error(
            "Create a file called database_password.txt in the api directory,\n" +
            "and paste your database password there"
        )
        exit(1);
    }
    return password;
})();

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',      
    password: password, 
    database: 'BoardGame', 
    connectionLimit: 10   
});

router.get("/users", (req, res) => {
    pool.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Error fetching users');
        }
        res.json(results);
    });
});

module.exports = router;
