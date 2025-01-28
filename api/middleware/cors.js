const cors = require("cors");

module.exports = cors({
  origin: "*", // Allow all origins (use specific domains in production)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
