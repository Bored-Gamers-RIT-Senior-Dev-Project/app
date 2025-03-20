const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");

router.get("/profile", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();
    try {
        const user = await UserService.getUser(uid);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("", async (req, res, next) => {
    const { uid } = req.user;
    const { email, username, firstName, lastName } = req.body;

    if (!uid) {
        return res.status(401).send();
    }

    if (!email || !username || !firstName || !lastName) {
        return res.status(400).json({ message: "Invalid request format." });
    }
    try {
        const user = await UserService.signUp(
            uid,
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
    const { uid } = req.user;
    console.log(req.user);
    console.log(req.body);
    if (!uid) {
        return res.status(401).send();
    }

    try {
        const user = await UserService.googleSignIn(
            uid,
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
    const { uid } = req.user;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const user = await UserService.updateUser(uid, req.body);
        res.status(200).json({
            message: "User updated",
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
