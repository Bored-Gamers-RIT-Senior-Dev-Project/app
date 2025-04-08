const createHttpError = require("http-errors");
const db = require("../config/db");
const { makeObjectCamelCase } = require("../utils");

/**
 * Defines the default "select" format that should be used for database queries retrieving users.
 */
const SQL_SELECTOR = `SELECT
            user.UserID AS userId,
            user.FirstName AS firstName,
            user.LastName AS lastName,
            user.Username AS username,
            user.Email AS email,
            user.ProfileImageURL AS profileImageUrl,
            user.Bio AS bio,
            user.CreatedAt AS createdAt,
            user.Paid AS paid,
            user.TeamID AS teamId,
            team.TeamName AS teamName,
            user.RoleID AS roleId,
            role.RoleName AS roleName,
            user.UniversityID AS universityID,
            uni.UniversityName AS universityName,
            user.IsValidated AS isValidated
        FROM users AS user
            LEFT JOIN universities AS uni ON user.UniversityID = uni.UniversityId
            LEFT JOIN teams AS team ON user.TeamID = team.TeamId
            JOIN roles AS role ON user.RoleId = role.RoleId`;

/**
 *@typedef {"FirebaseUID"|"UserID"} UserIdentifier
 */
/**
 * @readonly
 * @enum {UserIdentifier}
 */
const UserIds = Object.freeze({
    FIREBASE: "FirebaseUID",
    LOCAL: "UserID",
});

/**
 * @typedef {"Spectator"|"Super Admin"|"Aardvark Games Employee"|"Marketing Staff"|"Tournament Facilitator"|"Team Captain"|"Student/Player"|"College Admin"} RoleName
 */
/**
 * @readonly
 * @enum {RoleName}
 */
const Roles = Object.freeze({
    SPECTATOR: "Spectator",
    ADMIN: "Super Admin",
    EMPLOYEE: "Aardvark Games Employee",
    MARKETING: "Marketing Staff",
    FACILITATOR: "Tournament Facilitator",
    CAPTAIN: "Team Captain",
    STUDENT: "Student/Player",
    UNIVERSITY_ADMIN: "College Admin",
});

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
    roleId = 1, // Default role for new users is Spectator
    universityId
) => {
    try {
        const result = await db.query(
            `INSERT INTO
                users (FirebaseUID, Email, Username, FirstName, LastName, ProfileImageUrl, RoleId, UniversityId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firebaseUID,
                email,
                username,
                firstName,
                lastName,
                profileImageUrl,
                roleId,
                universityId,
            ]
        );
        if (result[0].affectedRows === 0) {
            throw new Error("User not created.");
        }
        return await getUserByFirebaseId(firebaseUID);
    } catch (error) {
        console.error("Error creating user:", error.message);
        throw error;
    }
};

/**
 * Gets a list of all users in the database
 * @returns {Promise<Array<Object>>} User list
 */
const getUserList = async () => {
    try {
        const [rows] = await db.query(SQL_SELECTOR);
        return rows;
    } catch (e) {
        console.error("Error getting user list: ", e.message);
        throw e;
    }
};

/**
 * Retrieve a user from the database, using the column and value specified.
 * @param {string} column The column to use to match with value.  (TO PREVENT
 * SQL INJECTION, SHOULD ALWAYS BE USED HARD-CODED)
 * @param {string|number} value The value of {column} to search for.
 * @returns A matching user, or null if no user is found.
 */
const getUser = async (column, value) => {
    try {
        const [rows] = await db.query(
            `${SQL_SELECTOR} WHERE ?? = ?;
        `,
            [column, value]
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

/**
 * Retrieve a user from the database by their local userId value.
 * @param {string} userId The local ID of a user
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const getUserByUserId = async (userId) => getUser("user.UserID", userId);

/**
 * Retrieve a user from the database by their Firebase UID.
 * @param {string} uid The firebase UID of the user.  Should be validated from a token.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const getUserByFirebaseId = async (uid) => getUser("user.FirebaseUID", uid);

const VALID_KEYS = Object.freeze({
    FIRSTNAME: "FirstName",
    LASTNAME: "LastName",
    USERNAME: "Username",
    EMAIL: "Email",
    ProfileImageURL: "ProfileImageURL",
    BIO: "Bio",
    CreatedAt: "CreatedAt",
    PAID: "Paid",
    TEAMID: "TeamId",
    ROLEID: "RoleId",
    UNIVERSITYID: "UniversityID",
    ISVALIDATED: "IsValidated",
});
/**
 * Updates user entry
 * @param {number|string} userId  Id of the user to update
 * @param {object} body
 * @param {UserIdentifier} [identifier] Determines if DB should check
 */
const updateUser = async (userId, body, identifier = UserIds.LOCAL) => {
    if (body.username) body.username = await generateUsername(body.username);
    const updates = [];
    let wildCards = [];
    Object.entries(body).forEach(([key, value]) => {
        if (key.toLowerCase() == "password") {
            return;
        }
        const column = VALID_KEYS?.[key.toUpperCase()];
        if (column) {
            updates.push(`?? = ?`);
            wildCards = wildCards.concat([column, value]);
        } else {
            console.error(
                "Error fulfilling update request:",
                body,
                "Invalid key:",
                key
            );
            throw createHttpError(400, "Invalid attempt to update user.");
        }
    });
    if (updates.length == 0) return;

    const keys = updates.join(", ");

    const [rows] = await db.query(
        `
        UPDATE users 
        SET ${keys} 
        WHERE ?? = ?
        `,
        [...wildCards, identifier, userId]
    );

    if (rows.affectedRows === 0) {
        throw new Error("User not updated. No rows affected.");
    }

    return await getUserByUserId(userId);
};

/**
 * Request an update for a user, or update the user if it's not part of a
 * university
 * @param {number} userId the UserID to update
 * @param {object} body the body
 */
const updateUserOrRequestUpdate = async (userId, body) => {
    "use strict";
    const user = await getUserByUserId(userId);
    if (user.universityId == null) {
        updateUser(userId, body);
        return;
    }
    requestUserUpdate(userId, body);
};

/**
 * Add an item to the user_update table
 * @param {number} userId the UserID to request the update for
 * @param {object} body the body, containing the fields that have to be updated
 */
const requestUserUpdate = async (userId, body) => {
    "use strict";
    // TODO
};

/**
 *
 * @param {number} The userID of the user in the local database
 * @returns true
 * @throws 404 HttpError if deletion fails
 */
const deleteUser = async (userId) => {
    //Get the user record from the db.
    const [userRows] = await db.query(
        "SELECT FirebaseUID as firebaseID FROM users WHERE UserID = ?",
        [userId]
    );

    const user = userRows[0];

    if (!user) {
        throw createHttpError(404);
    }

    const result = await db.query(`DELETE FROM users WHERE userID = ?`, [
        userId,
    ]);

    if (result[0].affectedRows === 0) {
        console.error("Error deleting user from the database.");
        throw createHttpError(500);
    }

    return user;
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
        return rows.map((row) => row.Username.toLowerCase());
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
    if (!sharedUsernames.includes(username.toLowerCase())) {
        return username;
    }

    // Otherwise, append a number to the username until we find a unique one
    let i = 1;
    while (sharedUsernames.includes(`${username}-${i}`)) {
        i++;
        if (i > 100) {
            console.error(
                `Error reserving username ${username}.  An unreasonable number of usernames were found with that prefix.`
            );
            throw new Error(
                "Error reserving a username based on the information provided."
            );
        }
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

/**
 *
 * @param {string|number} userId A unique identifier for the user
 * @param {string} roleName The name of the role to check.
 * @param {UserIdentifier|undefined} identifier what column is used to identify the user
 * @returns {Promise<boolean>} true if the user has the specified role. Otherwise false.
 */
const userHasRole = async (userId, roleName, identifier = UserIds.FIREBASE) => {
    try {
        const [rows] = await db.query(
            `
            SELECT 1
            FROM users user
            LEFT JOIN roles role ON user.RoleId = role.RoleId
            WHERE
                LOWER(role.RoleName) = LOWER(?)
                AND ?? = ?;
            `,
            [roleName, `user.${identifier}`, userId]
        );
        if (rows.length == 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking role:", error.message);
        throw error;
    }
};

/**
 *
 * @param {number|string} userId User's ID: Either numeric Primary Key from the Local Database or UID from Firebase.
 * @param {string} roleName The Name of the role to grant.
 * @param {UserIdentifier} identifier The ID to check
 * @returns {Promise<boolean>} Resolves to true if the role is successfully granted.
 */
const grantRole = async (userId, roleName, identifier = UserIds.LOCAL) => {
    // Check if the roleName exists in the Roles table
    const [roleRows] = await db.query(
        `SELECT RoleID FROM roles WHERE RoleName = ?`,
        [roleName]
    );

    if (roleRows.length === 0) {
        console.error(`Role "${roleName}" does not exist.`);
        throw createHttpError(500);
    }

    // Proceed with updating the user's role
    const sql = `UPDATE users
        SET RoleID = ?
        WHERE ?? = ?;`;
    await db.query(sql, [roleRows[0].RoleID, identifier, userId]);
    return true;
};

module.exports = {
    UserIds,
    Roles,
    createUser,
    getUserList,
    getUserByUserId,
    getUserByFirebaseId,
    updateUser,
    deleteUser,
    checkUsername,
    userHasRole,
    grantRole,
};
