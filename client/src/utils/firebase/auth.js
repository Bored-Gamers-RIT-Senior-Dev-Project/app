import {
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { events } from "../events";
import { MessageData, Severity } from "../messageData";
import { app } from "./config";

// Firebase Authentication
const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();

//Add scope for the user's email address, username, and profile picture to the Auth request
authProvider.addScope("email");
authProvider.addScope("profile");

/**
 * Runs the Google sign-in flow and returns the user's information.
 * @returns {Promise<*>} The user's information and additional user info from Firebase.
 */
const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, authProvider);
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

export {
    getIdToken,
    observeAuthState,
    // googleAuthProvider as authProvider,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    signUpWithEmail,
};
