const createError = require('http-errors');
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use("/api/auth", authRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback for React SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}, // Hide stack trace in production
  });
});

module.exports = app;
