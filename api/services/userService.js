const { verifyFirebaseToken } = require("../config/firebase");
const User = require("../models/userModel");

const signUp = async (idToken, email, username, firstName, lastName) => {
    const firebaseUser = await verifyFirebaseToken(idToken);
    try {
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
        await admin.auth().deleteUser(firebaseUser.uid);
        throw error;
    }
};

const googleSignIn = async (idToken, email, displayName, photoURL) => {
    const firebaseUser = await verifyFirebaseToken(idToken);
    let user = await User.readUser(firebaseUser.uid);

    if (!user) {
        const username = email.split("@")[0];
        const names = displayName.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");
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

const getUser = async (idToken) => {
    const firebaseUser = await verifyFirebaseToken(idToken);
    const user = await User.readUser(firebaseUser.uid);
    return user;
};

module.exports = { signUp, getUser, googleSignIn };
