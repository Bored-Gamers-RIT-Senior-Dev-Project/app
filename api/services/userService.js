const { verifyUser, deleteUser } = require("../config/firebase");
const User = require("../models/userModel");

const getUser = async (idToken) => {
    const firebaseUser = await verifyUser(idToken);
    const user = await User.readUser(firebaseUser.uid);
    return user;
};

const signUp = async (idToken, email, username, firstName, lastName) => {
    const firebaseUser = await verifyUser(idToken);
    try {
        username = await User.checkUsername(username);
        const result = await User.createUser(
            firebaseUser.uid,
            email,
            firstName,
            lastName,
            username
        );
        return result;
    } catch (error) {
        //If there's an error adding the FirebaseUser to the local database, delete the record from Firebase to avoid mismatched records.
        await deleteUser(firebaseUser.uid);
        throw error;
    }
};

const googleSignIn = async (idToken, email, displayName, photoURL) => {
    const firebaseUser = await verifyUser(idToken);
    let user = await User.readUser(firebaseUser.uid);

    if (!user) {
        const names = displayName.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");
        const username = await User.checkUsername(email.split("@")[0]);
        user = await User.createUser(
            firebaseUser.uid,
            email,
            firstName,
            lastName,
            username,
            photoURL
        );
    }
    return user;
};

const updateUser = async (idToken, body) => {
    const { uid } = await verifyUser(idToken);
    const user = await User.updateUser(uid, body);
    return user;
};

module.exports = { signUp, getUser, googleSignIn, updateUser };
