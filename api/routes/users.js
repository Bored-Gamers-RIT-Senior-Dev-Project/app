const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const UserService = require("../../services/userService");
const HttpError = require("../models/httpError");

router.post("/get", async (req, res) => {
    const { token } = req.body;
    try {
        const user = UserService.getUser(token);
        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.code).json({ message: error.message });
        }
        console.log("Error getting user information:", error.message);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});

router.post("/signin", async (req, res) => {
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
                user = await UserService.signIn(idToken);
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
        if (error instanceof HttpError) {
            return res.status(error.code).json({ message: error.message });
        }
        console.log("Error during sign-in:", error.message);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});

router.post("/signup", async (req, res) => {
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
        if (error instanceof HttpError) {
            return res.status(error.code).json({ message: error.message });
        }
        console.log("Error during sign-up:", error.message);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
module.exports = router;
