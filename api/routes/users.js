const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");

router.get("/profile", async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send();
    try {
        const user = await UserService.getUser(authorization.split(" ")[1]);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("", async (req, res, next) => {
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

router.post("/google", async (req, res, next) => {
    const { email, displayName, photoURL } = req.body;
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send();
    }

    try {
        const user = await UserService.googleSignIn(
            authorization.split(" ")[1],
            email,
            displayName,
            photoURL
        );
        return res.status(200).json({
            message: "Welcome!",
            user,
        }); //Successful sign-in.  Report to user and send the dbUser information for the frontend to store
    } catch (error) {
        next(error);
    }
});

router.put("", async (req, res, next) => {
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
