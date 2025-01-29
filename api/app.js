// Adding for now to ban dumb things durning development, but we can remove
// this later:
"use strict";
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const users = require("./routes/users");
const test = require("./routes/test");
const bodyParser = require("body-parser");
const cors = require("cors");

const createError = require('http-errors');
const express = require('express');
const path = require('path');


const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", users);
app.use("/api", test);
app.use("/api/auth", authRoutes);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message, // https://stackoverflow.com/a/32836884
    error: err,
  }); // FIXME: This is temporary, send to user friendly error page instead
});

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

