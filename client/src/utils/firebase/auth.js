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
    updateEmail,
    updatePassword,
} from "firebase/auth";
import { events } from "../events";
import { ErrorData, MessageData, Severity } from "../messageData";
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
 * Re-authenticates a user in Firebase.  Uses Google.com SSO if enabled, otherwise uses provided password.
 * @param {string} password The user's current password.
 * @returns {Promise<boolean>} True if successfully authenticated, false if not authenticated.
 */
const reauthenticate = async (password) => {
    try {
        const user = auth.currentUser;

        //If the user has defined google SSO, use reauthenticate with a google pop-up.
        const providers = user.providerData.map(
            (provider) => provider.providerId
        );
        if (providers.includes("google.com")) {
            await reauthenticateWithPopup(user, googleAuthProvider);
            return [true, "Successfully authenticated with google."];
        } else {
            //If the user hasn't defined google SSO, reauthenticate with their old password (from the form.)
            if (!password) {
                new ErrorData(
                    "Please provide your current password.",
                    Severity.WARNING
                ).send();
                return false;
            }
            await reauthenticateWithCredential(
                user,
                EmailAuthProvider.credential(user.email, password)
            );
            return [true, "Successfully authenticated with password."];
        }
    } catch (e) {
        let message;
        switch (e.message) {
            case "Firebase: Error (auth/invalid-credential).":
                message = "Incorrect Password.";
                break;
            default:
                message = e.message;
        }
        new ErrorData(message).send();

        return false;
    }
};
/**
 * Updates a firebase user's email and password to the values provided
 * @param {string} newEmail The user's new email address
 * @param {string} newPassword The user's new password
 */
const updateCredentials = async (newEmail, newPassword) => {
    const user = auth.currentUser;
    const promises = [];
    if (newEmail) {
        promises.push(updateEmail(user, newEmail));
    }
    if (newPassword) {
        promises.push(updatePassword(user, newPassword));
    }
    await Promise.all(promises);
};

export {
    getIdToken,
    observeAuthState,
    reauthenticate,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    signUpWithEmail,
    updateCredentials,
};
