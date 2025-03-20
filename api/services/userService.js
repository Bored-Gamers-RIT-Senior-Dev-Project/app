const { verifyUser, deleteUser } = require("../config/firebase");
const User = require("../models/userModel");

const getUser = async (uid) => {
    const user = await User.readUser(uid);
    return user;
};

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
        await deleteUser(uid);
        throw error;
    }
};

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

const updateUser = async (uid, body) => {
    const user = await User.updateUser(uid, body);
    return user;
};

module.exports = { signUp, getUser, googleSignIn, updateUser };
