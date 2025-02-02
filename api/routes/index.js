const express = require("express");
const router = express.Router();
const { verifyFirebaseToken } = require("../services/firebase");
const admin = require("firebase-admin"); 

// Sign-In Route
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

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { email, password, username, role, schoolName, teamOption, teamName } = req.body;

  try {
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    res.status(201).json({
      message: "Sign-up successful!",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        username: userRecord.displayName,
        role,
        schoolName,
        teamOption,
        teamName,
      },
    });
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    res.status(400).json({ message: "Sign-up failed", error: error.message });
  }
});
module.exports = router;