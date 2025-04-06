import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    getAdditionalUserInfo,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    signInWithEmailAndPassword,
    signInWithPopup,
    updatePassword,
} from "firebase/auth";
import { events } from "../events";
import { MessageData, Severity } from "../messageData";
import { app } from "./config";

// Firebase Authentication
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

//Add scope for the user's email address, username, and profile picture to the Auth request
googleAuthProvider.addScope("email");
googleAuthProvider.addScope("profile");

/**
 * Runs the Google sign-in flow and returns the user's information.
 * @returns {Promise<*>} The user's information and additional user info from Firebase.
 */
const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const additionalUserInfo = getAdditionalUserInfo(result);
    return { ...result, additionalUserInfo };
};

/**
 * Signs in a user with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns The user's information.
 */
const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
};

/**
 * Creates a new user in Firebase Authentication with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns
 */
const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
};

/**
 * Adds a callback to be called when the user's authentication state changes.
 * @param {*} callback The callback function to be called whenever the user's authentication state changes.
 * @returns The unsubscribe function for the observer registration.
 */
const observeAuthState = (callback) => onAuthStateChanged(auth, callback);

/**
 * Signs out the currently logged in user from Firebase Authentication.
 * @returns {Promise<void>} A promise that resolves when the user has been signed out.
 */
const signOut = () =>
    auth.signOut().then(() => {
        events.publish(
            "message",
            new MessageData(
                undefined,
                "You have been signed out.",
                Severity.SUCCESS
            )
        );
    });

/**
 * Gets the ID token of the currently logged in user from Firebase Authentication.
 * @returns {Promise<string | null>} The ID token of the currently logged in user, or null if no user is logged in.
 */
const getIdToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
};

/**
 * Updates a user's password
 * @param {string} oldPassword User's current password
 * @param {string} newPassword User's new password
 */
const changePassword = async (oldPassword, newPassword) => {
    const user = auth.currentUser;

    //If the user has defined google SSO, use reauthenticate with a google pop-up.
    const providers = user.providerData.map((provider) => provider.providerId);
    if (providers.includes("google.com")) {
        await reauthenticateWithPopup(user, googleAuthProvider);
    } else {
        //If the user hasn't defined google SSO, reauthenticate with their old password (from the form.)
        await reauthenticateWithCredential(
            EmailAuthProvider.credential(user.email, oldPassword)
        );
    }

    await updatePassword(user, newPassword).catch((e) => {
        console.error("Error Updating Password: ", e);
    });
};

export {
    changePassword,
    getIdToken,
    observeAuthState,
    // googleAuthProvider as authProvider,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    signUpWithEmail,
};
