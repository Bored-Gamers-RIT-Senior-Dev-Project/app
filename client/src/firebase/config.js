// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfzd4-OFjawSBlAR0enDnFblo7EMPkPPk",
  authDomain: "iste-501.firebaseapp.com",
  projectId: "iste-501",
  storageBucket: "iste-501.appspot.com",
  messagingSenderId: "889357924286",
  appId: "1:889357924286:web:cfdde904ca920266566bef",
  measurementId: "G-FJSMLNTCS8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Analytics (optional, if you’re using it)
const analytics = getAnalytics(app);

// Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase services for use in other files
export { app, analytics, auth, googleProvider };
