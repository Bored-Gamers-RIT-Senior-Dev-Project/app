const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: "BoardGame",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Save the original query function.
const originalQuery = pool.query.bind(pool);

// Patch the query function to log each call's success or failure.
pool.query = async function (...args) {
    try {
        const result = await originalQuery(...args);
        console.log("DB call successful with query:", args[0]);
        return result;
    } catch (error) {
        console.error("DB call failed with query:", args[0], "\nError:", error);
        throw error;
    }
};

module.exports = pool;
