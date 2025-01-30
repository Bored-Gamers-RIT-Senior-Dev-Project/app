const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up
exports.signup = async (req, res) => {
  const { username, password, email, roleID, universityID } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // FIXME: Salt, or do something else!

    // Insert user into the database
    const [result] = await db.execute(
      `INSERT INTO Users (Username, Password, Email, RoleID, UniversityID) VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, roleID, universityID]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Username or email already exists." });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// Sign In
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database
    const [rows] = await db.execute(`SELECT * FROM Users WHERE Email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userID: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
