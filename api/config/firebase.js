const admin = require("firebase-admin");
//chatgpt  helped me create a .env file never created before
// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix for multiline env vars
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
            process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
});

const verifyUser = async (idToken) => {
    try {
        return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        console.error("Error verifying Firebase token:", error.message);
        throw error;
    }
};

const deleteUser = async (uid) => {
    try {
        return await admin.auth().deleteUser(uid);
    } catch (error) {
        console.error("Error deleting Firebase user:", error.message);
        throw error;
    }
};

/**
 * Authentication function retrieves the user's token from the authentication header and verifies it with Firebase.
 * @param {*} req The Express Request Object
 * @param {*} res The Express Response Object
 * @param {*} next The Express next() function to pass the request to the next function in the chain.
 * @returns next() [on authentication failed] or res.status(401).send() [If authentication failed]
 */
const authenticationMiddleware = async (req, res, next) => {
    //Retrieve authorization header from the request headers.
    const { authorization } = req.headers;

    //If the request included an authorization header, grab the firebase information and verify it.
    if (authorization) {
        try {
            //Grab the token (sent in format "Bearer <token>") and verify it with Firebase.
            const token = authorization.split(" ")[1];
            const user = await verifyUser(token);

            //Add the user to the request object so that it can be accessed in our endpoint functions.
            req.user = user;
        } catch (error) {
            //If there's an error validating, log it and return an unauthorized warning
            console.error("Request failed token validation: ", error);
            return res.status(401).send();
        }
    }

    //Pass the request to the next function in the chain.
    return next();
};

module.exports = { authenticationMiddleware, deleteUser, verifyUser };
