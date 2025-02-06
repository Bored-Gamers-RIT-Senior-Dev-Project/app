const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyFirebaseToken } = require("../../services/firebase");

router.post("/signin", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await verifyFirebaseToken(idToken);

    res.status(200).json({
      message: "Sign-in successful!",
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    res.status(401).json({ message: "Invalid ID token", error: error.message });
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
