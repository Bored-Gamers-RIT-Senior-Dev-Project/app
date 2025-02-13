const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = require("../../config/db");
const { verifyFirebaseToken } = require("../../config/firebase");
const { createUser, getUser } = require("../../models/user");

router.post("/signin", async (req, res) => {
    const { idToken, method } = req.body;
    if (!idToken || !method) {
        return res.status(400).json({ message: "Invalid request format." });
    }

    try {
        const firebaseUser = await verifyFirebaseToken(idToken);
        let user = await getUser(firebaseUser.uid);
        if (!user) {
            if (method === "google") {
                const { email, displayName, photoURL } = req.body;

                const username = email.split("@")[0];
                const names = displayName.split(" ");
                const firstName = names[0];
                const lastName = names.slice(1).join(" ");
                const output = await createUser(
                    firebaseUser.uid,
                    email,
                    firstName,
                    lastName,
                    username,
                    photoURL
                );
                console.log(output);
                user = await getUser(firebaseUser.uid);
            } else {
                return res.status(401).json({ message: "User not found" });
            }
        }
        return res.status(200).json({
            message: "Sign-in successful!",
            user: user,
        }); //Successful sign-in.  Report to user and send the dbUser information for the frontend to store
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        res.status(401).json({
            message: "Invalid ID token",
            error: error.message,
        });
    }
});

router.post("/signup", async (req, res) => {
    const { idToken, email, username, firstName, lastName } = req.body;
    if (!email || !username || !idToken || !firstName || !lastName) {
        return res.status(400).json({ message: "Invalid request format." });
    }

    //Get UID from the firebase token
    let uid;
    try {
        const userEntry = await verifyFirebaseToken(idToken);

        uid = userEntry.uid;
    } catch {
        return res.status(401).json({ message: "Invalid Firebase Token" });
    }

    //Create the user in the local database
    try {
        const firebaseUser = await verifyFirebaseToken(idToken);
        const result = await createUser(
            firebaseUser.uid,
            email,
            firstName,
            lastName,
            username
        );
        console.log("Success: ", result);

        const user = await getUser(firebaseUser.uid);

        res.status(201).json({
            message: "Welcome!",
            user: user,
        });
    } catch (error) {
        await admin.auth().deleteUser(uid);
        console.error("Error during sign-up:", error.message);
        res.status(500).json({
            message: "Sign-up failed",
            error: error.message,
        });
    }
});
module.exports = router;
