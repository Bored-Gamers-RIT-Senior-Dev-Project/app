const express = require("express");
const cors = require("./middleware/cors");
const users = require("./routes/users/index");


const app = express();

// Middleware
app.use(cors);
app.use(express.json());

// Debugging Middleware (Logs all incoming requests)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});



app.use("/api/users", users);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
