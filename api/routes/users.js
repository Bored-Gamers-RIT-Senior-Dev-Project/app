const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const createError = require("http-errors");

router.get("/user", async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return req.status(401);
    try {
        const user = await UserService.getUser(authorization.split(" ")[1]);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("/signin", async (req, res, next) => {
    const { idToken, method, email, displayName, photoURL } = req.body;
    if (!idToken || !method) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        let user;
        //TODO: change the way the front-end calls endpoints so that we don't need to do this.  Create a separate endpoint for Google sign-ups and use "/get" route for all user data retrieval.
        switch (method) {
            case "google":
                user = await UserService.googleSignIn(
                    idToken,
                    email,
                    displayName,
                    photoURL
                );
                break;
            case "email":
                user = await UserService.getUser(idToken);
                if (!user) {
                    throw createError(404, "User not found.");
                }
                break;
            default:
                return res
                    .status(400)
                    .json({ message: "Invalid sign-in method." });
        }
        return res.status(200).json({
            message: "Sign-in successful!",
            user,
        }); //Successful sign-in.  Report to user and send the dbUser information for the frontend to store
    } catch (error) {
        next(error);
    }
});

router.post("/signup", async (req, res, next) => {
    const { idToken, email, username, firstName, lastName } = req.body;
    if (!email || !username || !idToken || !firstName || !lastName) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const user = await UserService.signUp(
            idToken,
            email,
            username,
            firstName,
            lastName
        );
        res.status(201).json({
            message: "Welcome!",
            user,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/update", async (req, res, next) => {
    const { idToken, ...body } = req.body;
    try {
        const user = await UserService.updateUser(idToken, body);
        res.status(200).json({
            message: "User updated",
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
