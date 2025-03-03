const createHttpError = require("http-errors");
const db = require("../config/db");
const { makeObjectCamelCase } = require("../utils");

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
    lastName,
    username,
    profileImageUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}?background=edca82`,
    roleId = 1 // Default role for new users is Spectator
) => {
    try {
        const result = await db.query(
            `INSERT INTO
                users (FirebaseUID, Email, Username, FirstName, LastName, ProfileImageUrl, RoleId)
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
        if (result[0].affectedRows === 0) {
            throw new Error("User not created.");
        }
        return await readUser(firebaseUID);
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
        SELECT user.*, uni.UniversityName, team.TeamName
            FROM users AS user
            LEFT JOIN universities AS uni ON user.UniversityID = uni.UniversityId
            LEFT JOIN teams AS team ON user.TeamID = team.TeamId
            WHERE user.FirebaseUID = ?;
        `,
            [uid]
        );
        if (rows.length === 0) {
            return null;
        }
        return makeObjectCamelCase(rows[0]);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw error;
    }
};

const VALID_KEYS = [
    "USERID",
    "FIRSTNAME",
    "LASTNAME",
    "USERNAME",
    "EMAIL",
    "FIREBASEUID",
    "PROFILEIMAGEURL",
    "BIO",
    "CREATEDAT",
    "PAID",
    "TEAMID",
    "ROLEID",
    "UNIVERSITYID",
    "ISVALIDATED",
    "UNIVERSITYNAME",
    "TEAMNAME",
];
const updateUser = async (firebaseUid, body) => {
    if (body.username) body.username = await generateUsername(body.username);
    const updates = [];
    for (const key of Object.keys(body)) {
        if (VALID_KEYS.includes(key.toUpperCase())) {
            updates.push(`${key} = ?`);
        } else {
            console.error("Error fulfilling update request:", body);
            console.error("Invalid key:", key);
            throw createHttpError(400, "Invalid attempt to update user.");
        }
    }
    const keys = Object.keys(body)
        .map((key) => `${key} = ?`)
        .join(", ");

    const [rows] = await db.query(
        `UPDATE users SET ${keys} WHERE FirebaseUID = ?`,
        [...Object.values(body), firebaseUid]
    );

    if (rows.affectedRows === 0) {
        throw new Error("User not updated.");
    }

    return await readUser(firebaseUid);
};

/**
 * Generates a list of usernames that start with the given "base" username.
 * @param {String} username The username to check for duplicates.
 * @returns  {Promise<Array>} An array of usernames that start with the given string.
 */
const getSharedUsernames = async (username) => {
    try {
        //Select all usernames that start with the given username
        const [rows] = await db.query(
            `SELECT Username FROM users WHERE lower(Username) LIKE lower(?)`,
            [username + "%"]
        );
        //Return those rows.
        return rows.map((row) => row.Username);
    } catch (error) {
        console.error("Error checking username:", error.message);
        throw error;
    }
};

/**
 * Generates a unique username based on the given "base" username.
 * @param {String} username The "base" username to use.
 * @returns {Promise<String>} A unique username.
 */
const generateUsername = async (username, sharedUsernames = null) => {
    // Get all usernames that start with the given username
    if (!sharedUsernames) sharedUsernames = await getSharedUsernames(username);

    // If the username is not taken, return it
    if (!sharedUsernames.includes(username)) {
        return username;
    }

    // Otherwise, append a number to the username until we find a unique one
    let i = 1;
    while (sharedUsernames.includes(`${username}-${i}`)) {
        i++;
        if (i > 100)
            console.error(
                `Error reserving username ${username}.  An unreasonable number of usernames were found with that prefix.`
            );
        throw new Error(
            "Error reserving a username based on the information provided."
        );
    }
    return `${username}-${i}`;
};

/**
 * Checks a username for availability and generates a unique username if necessary.
 * @param {String} username The username to check.
 * @param {Boolean} strict If true, the function will throw an error if the username is already taken.
 * @returns {Promise<String>} A unique username.
 * @throws {Error} If the username is taken and strict is true.
 */
const checkUsername = async (username, strict = false) => {
    const sharedUsernames = await getSharedUsernames(username);
    if (sharedUsernames.includes(username) && strict) {
        throw new Error("Username is taken");
    }
    return await generateUsername(username, sharedUsernames);
};

module.exports = { createUser, readUser, updateUser, checkUsername };
