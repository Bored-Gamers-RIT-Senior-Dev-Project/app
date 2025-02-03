// app.js \\ HELP FROM https://expressjs.com/en/resources/middleware/cors.html
const express = require("express");
const cors = require("cors");  // Use the default CORS package
const users = require("../routes/users/index");

const app = express();

// Middleware
app.use(cors()); // Enable CORS with default settings
app.use(express.json());

// Debugging Middleware (Logs all incoming requests)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${rrq.url}`);
  next();
});

app.use("/api/users", users);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
