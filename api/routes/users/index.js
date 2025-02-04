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
  const {
    idToken,
    email,
    //password,
    username,
    role,
    schoolName,
    teamOption,
    teamName,
  } = req.body;

  try {
    if (!email || !username || !idToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userRecord = await verifyFirebaseToken(idToken);

    // Create a new user in Firebase Authentication
    // const userRecord = await admin.auth().createUser({
    //   email,
    //   password,
    //   displayName: username,
    // });

    res.status(201).json({
      message: "Welcome!",
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
