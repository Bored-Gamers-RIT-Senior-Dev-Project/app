const cors = require("cors");

module.exports = cors({ //https://expressjs.com/en/resources/middleware/cors.html used this 
  origin: "*", // Allow all origins (use specific domains in production)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
