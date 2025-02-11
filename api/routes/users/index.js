const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = require("../../config/db");
const { verifyFirebaseToken } = require("../../services/firebase");

router.post("/signin", async (req, res) => {
    const { idToken, method } = req.body;
    if (!idToken || !method) {
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

    try {
        let dbUser = await db.query(
            "SELECT Username, Email, RoleID, ProfileImageURL, TeamID, UniversityID FROM Users WHERE FirebaseUID = ?",
            [uid]
        );

        //Email/Password Sign in logic.
        if (method === "email") {
            if (dbUser[0].length === 0) {
                //If user doesn't exist in the DB.  This shouldn't happen if the method is email.
                console.log("WARNING: User in Firebase not found in Database.");
                return res.status(404).json({ message: "User not found" });
            }
        }
        //Google sign-in logic
        else if (method === "google") {
            const { email, displayName, photoURL } = req.body;

            const username = email.split("@")[0];
            const names = displayName.split(" ");
            const firstName = names[0];
            const lastName = names.slice(1).join(" ");

            //If this is the google user's first log-in, they haven't been loaded into the local DB yet.
            if (dbUser[0].length === 0) {
                await db.query(
                    "INSERT INTO Users (FirebaseUID, Email, Username, FirstName, LastName, ProfileImageUrl, RoleId) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [uid, email, username, firstName, lastName, photoURL, 1]
                );
                dbUser = await db.query(
                    "SELECT Username, Email, RoleID, ProfileImageURL, TeamID, UniversityID FROM Users WHERE FirebaseUID = ?",
                    [uid]
                );
            }
        }

        //Successful sign-in.  Report to user and send the dbUser information for the frontend to store
        res.status(200).json({
            message: "Sign-in successful!",
            user: dbUser[0][0],
        });
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        res.status(401).json({
            message: "Invalid ID token",
            error: error.message,
        });
    }
});

router.post("/signup", async (req, res) => {
    const { idToken, email, username } = req.body;
    if (!email || !username || !idToken) {
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
        await db.query(
            "INSERT INTO Users (Username, Email, FirebaseUID, RoleId) VALUES (?, ?, ?, ?)",
            [username, email, uid, 1]
        );
        const userQuery = await db.query(
            "SELECT Username, Email, RoleID, ProfileImageURL, TeamID, UniversityID FROM Users WHERE FirebaseUID = ?",
            [uid]
        );
        res.status(201).json({
            message: "Welcome!",
            user: userQuery[0][0],
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
