const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (idToken) => {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new Error("Invalid Firebase ID token");
  }
};

module.exports = { verifyFirebaseToken };
