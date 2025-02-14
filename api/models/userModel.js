const db = require("../config/db");
const randomString = require("../config/randomString");

/**
 * Creates a user in the database.
 * @param {string} firebaseUID The firebase UID of the user.  Should be validated from a token.
 * @param {string} email The email of the user.
 * @param {string} firstName The first name of the user.
 * @param {string} lastName The last name of the user.  Defaults to an empty string if undefined.
 * @param {string} username The user's display name.
 * @param {string} profileImageUrl The profile image URL of the user.  Defaults to a generated avatar URL if undefined.
 * @param {number} roleId The role ID of the user.  Defaults to 1 if undefined.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const createUser = async (
    firebaseUID,
    email,
    firstName,
    lastName = "",
    username = email.split("@")[0] + "-" + randomString(4),
    profileImageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}?background=edca82`,
    roleId = 1 // Default role for new users is Spectator
) => {
    try {
        const result = await db.query(
            `INSERT INTO
                Users (FirebaseUID, Email, Username, FirstName, LastName, ProfileImageUrl, RoleId)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                firebaseUID,
                email,
                username,
                firstName,
                lastName,
                profileImageUrl,
                roleId,
            ]
        );
        return {
            id: result.insertId,
            firebaseUID,
            email,
            firstName,
            lastName,
            username,
            profileImageUrl,
            roleId,
        };
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
};

/**
 * Retrieve a user from the database by their Firebase UID.
 * @param {string} uid The firebase UID of the user.  Should be validated from a token.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const readUser = async (uid) => {
    try {
        const [rows] = await db.query(
            `
            SELECT * 
            FROM Users
            WHERE FirebaseUID = ?
        `,
            [uid]
        );
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw error;
    }
};

module.exports = { createUser, readUser };
