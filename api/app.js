// Adding for now to ban dumb things durning development, but we can remove
// this later:
"use strict";

//Require Middleware
const { authenticationMiddleware } = require("./config/firebase");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Require Routes
const index = require("./routes");
const users = require("./routes/users");
const university = require("./routes/university");
const teams = require("./routes/teams");
const createError = require("http-errors");

const uploadService = require("./services/imageUploadService");

//Initialize Express
const express = require("express");
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Enable CORS
app.use(authenticationMiddleware);

// Routes
app.use("/api", index);
app.use("/api/users", users);
app.use("/api/university", university);
app.use("/api/teams", teams);
// app.use("/api", test);
app.use("/api/user-images", express.static(__dirname + "/user-images"));

//404 any routes not defined above
app.use((_req, _res, next) => {
    next(createError(404));
});

// Error Handler
app.use((err, req, res, _next) => {
    //Only provide error in development
    const error = req.app.get("env") === "development" ? err : {};

    // set locals, only providing error in development

    res.locals.message = err.message;
    res.locals.error = error;

    // Send an error message
    res.status(err.status || 500).json({
        message: err.message, // https://stackoverflow.com/a/32836884
        error,
    });
});

module.exports = app;
