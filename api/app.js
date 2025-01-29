// Adding for now to ban dumb things durning development, but we can remove
// this later:
"use strict";
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const bodyParser = require("body-parser");
const cors = require("cors");

const users = require("./routes/users");
const test = require("./routes/test");
const auth = require("./routes/auth");

const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.use("/api", users);
app.use("/api", test);
app.use("/api", auth);

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
require("dotenv").config();

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}, // Hide stack trace in production
  });
});

module.exports = app;
