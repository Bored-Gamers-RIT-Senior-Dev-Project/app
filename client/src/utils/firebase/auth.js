import {
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { app } from "./config";

// Firebase Authentication
const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();

//Add scope for the user's email address, username, and profile picture to the Auth request
authProvider.addScope("email");
authProvider.addScope("profile");

//Sign-in functions
const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, authProvider);
    const additionalUserInfo = getAdditionalUserInfo(result);
    return { ...result, additionalUserInfo };
};
const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
};

//Sign-up function
const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
};

const observeAuthState = (callback) => onAuthStateChanged(auth, callback);

//TODO: .then() a snackbar confirming log-out was successful.
const signOut = () => auth.signOut();

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
