const Firebase = require("../config/firebase");
const User = require("../models/userModel");
const createHttpError = require("http-errors");

/**
 * Gets a list of all users
 * @param {string} uid Requestor's UID, validated from their request token.
 * @returns {Promise<List<object>>} A list of all users.
 * @throws {HttpError} 403 error if the requestor isn't a Super Admin.
 */
const getUserList = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);
    if ((!User.userHasRole("Super Admin"), user.uid)) {
        throw createHttpError(403);
    }
    return await User.getUserList();
};

/**
 * An alias for User.getUserByFirebaseId()
 * @param {string} uid The firebase UID of the user.  Should be validated from a token.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const getUserByFirebaseId = async (uid) => {
    const user = await User.getUserByFirebaseId(uid);
    return user;
};

/**
 * An alias for User.getUserByUserId()
 * @param {number} userId The local User Id of the user.
 * @return {Promise<object>} The user object from the database.
 * @throws {Error} If the user is not found.
 */
const getUserByUserId = async (userId) => {
    const user = await User.getUserByUserId(userId);
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
    let user = await User.getUserByFirebaseId(uid);

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
    password,
    email,
    roleId,
    universityId
) => {
    console.log(
        "Adding User: ",
        firstName,
        lastName,
        username,
        password,
        email,
        roleId,
        universityId
    );
    const user = await User.getUserByFirebaseId(requestUid);
    if (user.roleName !== "Super Admin") {
        throw createHttpError(403);
    }
    //Create user record in Firebase Authentication and get UID
    const createdUser = await Firebase.createUser(email, password);

    //Create user record in local database using UID from Firebase Authentication
    const userRecord = await User.createUser(
        createdUser.uid,
        email,
        firstName,
        lastName,
        username,
        undefined,
        roleId,
        universityId
    );

    // Return user record from local database
    return userRecord;
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
    if (user.roleName !== "Super Admin" /* && user.UserId !== userId */) {
        throw createHttpError(403);
    }

    // Delete user from local database.  Get the firebase uid from the local database.
    const deletedUser = await User.deleteUser(userId);

    //TODO: Delete user from Firebase Authentication.
    await Firebase.deleteUser(deletedUser.firebaseUid);

    return true;
};

module.exports = {
    createUser,
    deleteUser,
    getUserList,
    getUserByFirebaseId,
    getUserByUserId,
    googleSignIn,
    signUp,
    updateUser,
};
