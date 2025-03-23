const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");

//Gets a user's profile information
router.get("/profile", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();
    try {
        const user = await UserService.getUserByFirebaseId(uid);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

//User sign-in, expects the sender to have authenticated with Firebase
router.post("register", async (req, res, next) => {
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

//Google sign-in, used to create local records of firebase sign-in
router.post("/register/google", async (req, res, next) => {
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

/**
 * POST to manually create a user.
 * Unlike 'register', the UID of the responsible user is defined separately from the user being created.
 * Requires admin role.
 */
router.post("", async (req, res, next) => {
    const { uid } = req.user;
    if (!uid) return res.status(401).send();
    try {
        //userService create user
    } catch (error) {
        next(error);
    }
});

/**
 * PUT to Update a user.
 * TODO: Update this version to serve as our admin update user function and lock down to Admin roles.
 * TODO: Separate route to update a user profile accessible only to the user themselves (and possibly University Rep?)
 */
router.put("/:userId", async (req, res, next) => {
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

/**
 * DELETE to delete a user.
 * Requires admin role, or matching user ID (?).
 */
router.delete("/:userId", async (req, res, next) => {
    const { uid } = req.user;
    const { userId } = req.params;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        //userService delete user
        // const status = await userService.deleteUser(uid, userId);
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
