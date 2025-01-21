const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes"); // Ensure this matches your file path
const db = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

// Test database connection
db.getConnection()
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error("MySQL connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
