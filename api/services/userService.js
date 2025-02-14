const { verifyFirebaseToken } = require("../config/firebase");
const User = require("../models/userModel");

const signUp = async (idToken, email, username, firstName, lastName) => {
    const firebaseUser = await verifyFirebaseToken(idToken);
    const result = await User.createUser(
        firebaseUser.uid,
        email,
        firstName,
        lastName,
        username
    );
    return result;
};

const signIn = async (idToken) => {
    const firebaseUser = await verifyFirebaseToken(idToken);
    let user = await User.readUser(firebaseUser.uid);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
};

const googleSignIn = async (idToken, email, displayName, photoURL) => {
    let user = await getUser(idToken);
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

module.exports = { signUp, signIn, getUser, googleSignIn };
