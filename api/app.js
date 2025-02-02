"use strict";

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const users = require("./routes/users");
const authRoutes = require("./routes/index");
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

// Debugging Middleware (Logs all incoming requests)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/test", test);
app.use("/api/routes", authRoutes);


app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}, 
  });
});

module.exports = app;
