const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const ImageUploadService = require("../services/imageUploadService");
const multer = require("multer");
const createHttpError = require("http-errors");

const upload = multer({ limits: { fileSize: 2e7 /* 20 MB */ } });

//Gets a user's profile information
router.get("/profile", async (req, res, next) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        const user = await UserService.getUserByFirebaseId(uid);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

//Gets a list of all users
router.get("", async (req, res, next) => {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        const list = await UserService.getUserList(uid);
        return res.status(200).json(list);
    } catch (error) {
        next(error);
    }
});

router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const uid = req.user?.uid;
    if (!uid) return res.status(401).send();
    try {
        const user = await UserService.getUserByUserId(userId);
        return res.status(200).json(user);
    } catch (e) {
        next(e);
    }
});

//User sign-in, expects the sender to have authenticated with Firebase
router.post("/register", async (req, res, next) => {
    const uid = req.user?.uid;
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
    const uid = req.user?.uid;
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
    const uid = req.user?.uid;
    const {
        email,
        firstName,
        lastName,
        username,
        password,
        roleId,
        universityId,
    } = req.body;

    if (!email || !password || !username) {
        return res.status(400).send();
    }

    if (!uid) return res.status(401).send();
    try {
        const user = await UserService.createUser(
            uid,
            firstName,
            lastName,
            username,
            password,
            email,
            roleId,
            universityId
        );
        return res.json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT to Update a user.
 */
router.put("/:userId", async (req, res, next) => {
    const uid = req.user?.uid;
    const { userId } = req.params;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        const user = await UserService.adminUpdateUser(uid, userId, req.body);
        res.status(200).json({
            message: "User updated",
        });
    } catch (error) {
        next(error);
    }
});

router.put(
    "/:userId/settings",
    upload.single("image"),
    async (req, res, next) => {
        const uid = req.user?.uid;
        const { userId } = req.params;
        if (!uid) {
            return res.status(401).send();
        }
        try {
            const { body, file } = req;
            console.debug("FormData received:", body);
            console.debug("File Received: ", file);
            await ImageUploadService.uploadUserImage(file.buffer, userId);
            return res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
);

/**
 * DELETE to delete a user.
 * Requires admin role, or matching user ID (?).
 */
router.delete("/:userId", async (req, res, next) => {
    const uid = req.user?.uid;
    const { userId } = req.params;
    if (!uid) {
        return res.status(401).send();
    }
    try {
        //userService delete user
        await UserService.deleteUser(uid, userId);
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
