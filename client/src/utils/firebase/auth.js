import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
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
  const result = await signInWithPopup(auth, authProvider).then((result) => {
    console.log("Sign in:", result);
    return result;
  });
  console.log(result);
  return result.user;
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

export {
  // googleAuthProvider as authProvider,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
};
