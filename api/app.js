// Adding for now to ban dumb things durning development, but we can remove
// this later:
"use strict";

//Require Middleware
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Require Routes
const users = require("./routes/users");
const test = require("./routes/test");
const createError = require("http-errors");

//Initialize Express
const express = require("express");
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Enable CORS

// Routes
app.use("/api/users", users);
app.use("/api", test);

//404 any routes not defined above
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
    }); // FIXME: This is temporary, send to user friendly error page instead (Respond with an error response, React Router the frontend has the tools to do this.  -Nate)
});

module.exports = app;
