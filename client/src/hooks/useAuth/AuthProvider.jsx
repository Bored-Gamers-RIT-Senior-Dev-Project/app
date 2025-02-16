import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getUserData } from "../../utils/api";
import { observeAuthState } from "../../utils/firebase/auth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    // useEffect with empty array only runs on component initialization.
    // Uses firebase onAuthStateChanged via firebase/auth.js to subscribe to auth state changes.
    // Tracks user token state.
    useEffect(() => {
        observeAuthState(async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                setToken(token);
            } else {
                setToken(null);
            }
        });
    }, []);

    // useEffect with token deps will update whenever the token state is changed.
    // - Get user data from the API and store it in userData state.
    // - If token updates to null (logged out), user follows suit and updates to null.
    useEffect(() => {
        if (token) {
            getUserData(token).then((data) => setUserData(data));
        } else {
            setUserData(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider };
