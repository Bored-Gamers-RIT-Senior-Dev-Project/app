const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// Sign In Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User fetched from DB:", user);
    console.log("Password from DB:", user.Password);

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Sign Up Route
router.post("/signup", async (req, res) => {
  try {
    const {
      Username,
      Password,
      Email,
      RoleID,
      ProfileImageURL,
      Bio,
      TeamID,
      UniversityID,
    } = req.body;

    if (!Username || !Password || !Email || !RoleID) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await db.query(
      //FIXME: Does this sanitize the inputs?
      `INSERT INTO Users (Username, Password, Email, RoleID, ProfileImageURL, Bio, TeamID, UniversityID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Username,
        null,
        Email,
        RoleID,
        ProfileImageURL || null,
        Bio || null,
        TeamID || null,
        UniversityID || null,
      ]
    );

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
