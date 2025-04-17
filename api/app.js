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
const tournament = require("./routes/tournament");
const [payment, stripeWebhook] = require("./routes/payment");
const createError = require("http-errors");

const uploadService = require("./services/imageUploadService");

//Initialize Express
const express = require("express");
const app = express();

// Middleware
app.use(logger("dev"));
app.use("/api/stripe/webhook-process-events", stripeWebhook);

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
app.use("/api/stripe", payment);
// app.use("/api", test);
app.use("/api/user-images", express.static(__dirname + "/user-images"));
app.use("/api/tournament", tournament);

//404 any routes not defined above
app.use((_req, _res, next) => {
    next(createError(404));
});

// Error Handler
app.use(
    /**
     *
     * @param {Error | import("http-errors").HttpError} err
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} _next
     */
    (err, req, res, _next) => {
        //Only provide error in development
        const error = req.app.get("env") === "development" ? err : {};

        if (err.status == null || err.status >= 500) {
            //If the error is null or a 500, log it so we can diagnose.
            console.error("=====================");
            console.error("An Unhandled Error Occurred.");
            console.error(`Path: ${req.url}`);
            console.error(`Body: ${JSON.stringify(req.body)}`);
            console.error(`Error: ${err.message}`);
            console.error("=====================");

            err.status = 500;
        }

        // set locals, only providing error in development

        res.locals.message = err.message;
        res.locals.error = error;

        // Send an error message
        res.status(err.status).json({
            message: err.message, // https://stackoverflow.com/a/32836884
            error,
        });
    }
);

module.exports = app;
