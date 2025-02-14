const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const UserService = require("../services/userService");
const HttpError = require("../models/httpError");

router.post("/get", async (req, res, next) => {
    const { token } = req.body;
    try {
        const user = UserService.getUser(token);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("/signin", async (req, res, next) => {
    const { idToken, method, email, displayName, photoUrl } = req.body;
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
                    method,
                    email,
                    displayName,
                    photoUrl
                );
                break;
            case "email":
                user = await UserService.getUser(idToken);
                if (!user) {
                    throw new HttpError(404, "User not found.");
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
        const result = await UserService.signUp(
            idToken,
            email,
            username,
            firstName,
            lastName
        );
        res.status(201).json({
            message: "Welcome!",
            user: result,
        });
    } catch (error) {
        await admin.auth().deleteUser(uid);
        next(error);
    }
});
module.exports = router;
