const Firebase = require("../config/firebase");
const User = require("../models/userModel");
const { createHttpError } = require("http-errors");

/**
 * An alias for User.readUser()
 * @param {string} uid The firebase UID of the user.  Should be validated from a token.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const getUser = async (uid) => {
    const user = await User.readUser(uid);
    return user;
};

/**
 * Runs the sign-up code to create a user in the database
 * @param {string} uid The user's Firebase UID provided through authentication.
 * @param {string} email The user's email address.
 * @param {string} username The user's username.
 * @param {string} firstName The user's first name.
 * @param {string} lastName The user's last name.
 * @returns The newly created user object.
 */
const signUp = async (uid, email, username, firstName, lastName) => {
    try {
        username = await User.checkUsername(username);
        const result = await User.createUser(
            uid,
            email,
            firstName,
            lastName,
            username
        );
        return result;
    } catch (error) {
        //If there's an error adding the FirebaseUser to the local database, delete the record from Firebase to avoid mismatched records.
        await Firebase.deleteUser(uid);
        throw error;
    }
};

/**
 * Handles a user's first sign-in via Google.  Creates the entry in the database if it doesn't exist.
 * @param {string} uid
 * @param {string} email
 * @param {string} displayName
 * @param {string} photoURL
 * @returns The newly created user object, or the existing user object if it already exists.
 */
const googleSignIn = async (uid, email, displayName, photoURL) => {
    let user = await User.readUser(uid);

    if (!user) {
        const names = displayName.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");
        const username = await User.checkUsername(email.split("@")[0]);
        user = await User.createUser(
            uid,
            email,
            firstName,
            lastName,
            username,
            photoURL
        );
    }
    return user;
};

/**
 * Creates a user in the database.
 * @param {*} requestUid The user's Firebase UID provided through authentication.
 * @param {*} firstName The first name of the user to be created.
 * @param {*} lastName
 * @param {*} username
 * @param {*} email
 * @param {*} profileImageUrl
 * @param {*} roleId
 * @param {*} universityId
 */
const createUser = async (
    requestUid,
    firstName,
    lastName,
    username,
    email,
    profileImageUrl,
    roleId,
    universityId
) => {
    const user = await getUser(requestUid);
    if (user.role !== "Super Admin") {
        throw createHttpError(403);
    }
    //TODO: Validate and sanitize inputs
    //TODO: Create user record in Firebase Authentication and get UID
    //TODO: Create user record in local database using UID from Firebase Authentication
    //TODO: Return user record from local database
    return {};
};

/**
 * Updates a user's information in the database.
 * @param {string} uid The user's Firebase UID provided through authentication.s
 * @param {*} body The information to update.
 * @returns The updated user object.
 */
const updateUser = async (uid, body) => {
    const user = await User.updateUser(uid, body);
    return user;
};

const deleteUser = async (uid, userId) => {
    const user = await getUser(uid);
    if (user.role !== "Super Admin" /* && user.UserId !== userId */) {
        throw createHttpError(403);
    }
    //TODO: Delete user from local database.  Get the firebase uid from the local database.
    //TODO: Delete user from Firebase Authentication.

    return true;
};

module.exports = {
    createUser,
    deleteUser,
    getUser,
    googleSignIn,
    signUp,
    updateUser,
};
