const express = require("express");
const cors = require("./middleware/cors");
const authRoutes = require("./routes/index");

const app = express();

// Middleware
app.use(cors);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



